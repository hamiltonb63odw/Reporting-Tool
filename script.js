// IndexedDB setup
const DB_NAME = 'odwReportDB';
const DB_VERSION = 1;
const STORE_NAME_ACCOUNTS = 'accounts';

let db;
let currentView = 'accounts'; // 'accounts' or 'reports'
let currentEditedAccount = null; // To hold account during report suggestion phase

// Predefined list of standardized reports with matching criteria and default parameters
const standardReports = [
    {
        id: 'std_daily_summary',
        name: 'Daily Operations Summary',
        type: 'Operational',
        tags: ['Daily', 'Summary', 'Performance'],
        defaultParameters: { frequency: 'Daily', emailRecipient: '', threshold: null },
        matchingCriteria: {
            numberOfShifts: { min: 2 },
            processesReturns: true
        },
        description: 'Provides a daily overview of key operational metrics like inbound/outbound volume, labor utilization, and open orders.'
    },
    {
        id: 'std_inventory_accuracy',
        name: 'Inventory Accuracy Report',
        type: 'Audit',
        tags: ['Inventory', 'Accuracy', 'Audit'],
        defaultParameters: { frequency: 'Weekly', minAccuracyThreshold: 0.98 },
        matchingCriteria: {
            wms: ['SAP EWM', 'Manhattan WMOS', 'JDA WMS', 'HighJump', 'RedPrairie', 'Blue Yonder', 'LogFire', 'Infor WMS', 'Oracle WMS', 'Custom']
        },
        description: 'Tracks the accuracy of inventory counts against system records, highlighting discrepancies and trends.'
    },
    {
        id: 'std_customer_sla',
        name: 'Customer SLA Performance',
        type: 'Performance',
        tags: ['SLA', 'Customer', 'Performance', 'Daily'],
        defaultParameters: { frequency: 'Daily', slaTarget: null, emailRecipient: '' },
        matchingCriteria: {
            customerSLAsText: { exists: true },
            accountType: ['Dedicated', 'Multi-Client']
        },
        description: 'Monitors performance against customer Service Level Agreements (SLAs), including on-time shipping and order fulfillment rates.'
    },
    {
        id: 'std_temp_control_monitoring',
        name: 'Temperature Control Monitoring',
        type: 'Compliance',
        tags: ['Temperature', 'Compliance', 'Audit'],
        defaultParameters: { frequency: 'Daily', minTemp: 34, maxTemp: 40, unit: 'Fahrenheit' },
        matchingCriteria: {
            temperatureControlled: true
        },
        description: 'Ensures compliance with temperature control requirements for sensitive goods, logging temperatures and deviations.'
    },
    {
        id: 'std_hazardous_materials',
        name: 'Hazardous Materials Compliance',
        type: 'Compliance',
        tags: ['Hazardous', 'Compliance', 'Safety'],
        defaultParameters: { frequency: 'Monthly', regulatoryBody: '' },
        matchingCriteria: {
            hazardousMaterials: true
        },
        description: 'Reports on the handling and storage of hazardous materials, ensuring adherence to safety and regulatory standards.'
    },
    {
        id: 'std_automation_utilization',
        name: 'Automation Utilization Report',
        type: 'Operational',
        tags: ['Automation', 'Efficiency', 'Daily'],
        defaultParameters: { frequency: 'Daily', targetUtilization: 0.8 },
        matchingCriteria: {
            usesAutomation: true
        },
        description: 'Provides insights into the utilization and efficiency of automated systems within the warehouse.'
    },
    {
        id: 'std_inbound_outbound_volume',
        name: 'Inbound/Outbound Volume',
        type: 'Operational',
        tags: ['Volume', 'Inbound', 'Outbound', 'Daily'],
        defaultParameters: { frequency: 'Daily' },
        matchingCriteria: {
            accountType: ['Dedicated', 'Multi-Client', 'Cross-Dock']
        },
        description: 'Tracks the daily volume of incoming and outgoing shipments, providing a high-level view of facility throughput.'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initDb();
    setupEventListeners();
    updateView();
});

function initDb() {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME_ACCOUNTS)) {
            const accountStore = db.createObjectStore(STORE_NAME_ACCOUNTS, { keyPath: 'id', autoIncrement: true });
            accountStore.createIndex('accountName', 'accountName', { unique: false });
            accountStore.createIndex('region', 'region', { unique: false });
            accountStore.createIndex('wms', 'wms', { unique: false });
            accountStore.createIndex('accountType', 'accountType', { unique: false });
            accountStore.createIndex('customerSolutionType', 'customerSolutionType', { unique: false, multiEntry: true });
            accountStore.createIndex('building', 'building', { unique: false });
            accountStore.createIndex('foodGrade', 'foodGrade', { unique: false });
            accountStore.createIndex('hazardousMaterials', 'hazardousMaterials', { unique: false });
            accountStore.createIndex('internationalShipping', 'internationalShipping', { unique: false });
            accountStore.createIndex('processesReturns', 'processesReturns', { unique: false });
            accountStore.createIndex('temperatureControlled', 'temperatureControlled', { unique: false });
            accountStore.createIndex('usesAutomation', 'usesAutomation', { unique: false });
        }
        // When a new database is created or an old one is upgraded, import initial data
        event.target.transaction.oncomplete = () => {
            importInitialData();
        };
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        console.log('IndexedDB opened successfully');
        loadAllAccounts();
        populateFilterOptions();
    };

    request.onerror = function(event) {
        console.error('IndexedDB error:', event.target.errorCode);
        showMessage('Error opening database. Some features may not work.', 'error');
    };
}

async function importInitialData() {
    try {
        const response = await fetch('initialData.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const initialAccounts = await response.json();
        const store = getObjectStore(STORE_NAME_ACCOUNTS, 'readwrite');
        let importCount = 0;
        for (const accountData of initialAccounts) {
            // Check if account with the same name already exists to prevent duplicates on subsequent loads
            const existingAccountRequest = store.index('accountName').get(accountData.accountName);
            await new Promise((resolve, reject) => {
                existingAccountRequest.onsuccess = (e) => {
                    if (!e.target.result) { // If account does not exist, add it
                        const addRequest = store.add(accountData);
                        addRequest.onsuccess = () => {
                            importCount++;
                            resolve();
                        };
                        addRequest.onerror = (err) => {
                            console.error('Error adding initial account:', err.target.error);
                            resolve(); // Resolve even on error to continue with other accounts
                        };
                    } else {
                        console.log(`Account "${accountData.accountName}" already exists, skipping initial import.`);
                        resolve();
                    }
                };
                existingAccountRequest.onerror = (err) => {
                    console.error('Error checking for existing account:', err.target.error);
                    resolve(); // Resolve even on error
                };
            });
        }
        if (importCount > 0) {
            showMessage(`Imported ${importCount} accounts from initialData.json.`, 'success');
        } else {
            showMessage('No new accounts imported from initialData.json (they might already exist).', 'info');
        }
        loadAllAccounts(); // Reload all accounts after import
    } catch (error) {
        console.error('Failed to load or import initial data:', error);
        showMessage('Failed to load initial data from JSON file.', 'error');
    }
}


function getObjectStore(storeName, mode) {
    const transaction = db.transaction([storeName], mode);
    return transaction.objectStore(storeName);
}

// --- Report Suggestion Logic ---
function doesAccountMatchCriteria(account, criteria) {
    for (const key in criteria) {
        if (!criteria.hasOwnProperty(key)) continue;
        const criterionValue = criteria[key];
        const accountValue = account[key];
        if (typeof criterionValue === 'boolean') {
            if (accountValue !== criterionValue) return false;
        } else if (Array.isArray(criterionValue)) {
            if (typeof accountValue === 'string') {
                const accountValuesArray = accountValue.split(',').map(s => s.trim());
                if (!criterionValue.some(c => accountValuesArray.includes(c))) return false;
            } else if (!criterionValue.includes(accountValue)) return false;
        } else if (typeof criterionValue === 'object' && criterionValue !== null) {
            if (criterionValue.min !== undefined && (typeof accountValue !== 'number' || accountValue < criterionValue.min)) return false;
            if (criterionValue.max !== undefined && (typeof accountValue !== 'number' || accountValue > criterionValue.max)) return false;
            if (criterionValue.exists !== undefined) {
                if (criterionValue.exists && (!accountValue || accountValue === '' || (Array.isArray(accountValue) && accountValue.length === 0))) return false;
                if (!criterionValue.exists && accountValue && accountValue !== '' && !(Array.isArray(accountValue) && accountValue.length === 0)) return false;
            }
        } else {
            if (accountValue !== criterionValue) return false;
        }
    }
    return true;
}

function suggestReportsForAccount(account) {
    const suggestions = [];
    standardReports.forEach(stdReport => {
        if (doesAccountMatchCriteria(account, stdReport.matchingCriteria)) {
            suggestions.push({
                id: stdReport.id,
                name: stdReport.name,
                type: stdReport.type,
                tags: [...stdReport.tags],
                reportPath: '',
                parameters: { ...stdReport.defaultParameters },
                suggested: true,
                uniqueId: `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
            });
        }
    });
    return suggestions;
}

// --- UI Functions for Suggested Reports ---
function displaySuggestedReportsUI(suggestedReports, accountData) {
    const suggestedReportsSection = document.getElementById('suggestedReportsSection');
    const suggestedReportsList = document.getElementById('suggestedReportsList');
    suggestedReportsList.innerHTML = '';
    currentEditedAccount = { ...accountData, associatedReports: [] };
    currentEditedAccount.tempSuggestedReports = suggestedReports.map(r => ({ ...r }));
    if (suggestedReports.length === 0) {
        suggestedReportsList.innerHTML = '<p class="text-gray-600 col-span-full">No standard reports were automatically suggested.</p>';
    }
    currentEditedAccount.tempSuggestedReports.forEach(report => {
        const reportCard = document.createElement('div');
        reportCard.id = `suggested-report-${report.uniqueId}`;
        reportCard.className = 'bg-white p-4 rounded-lg shadow border border-indigo-100 flex flex-col justify-between';
        reportCard.innerHTML = `
            <div>
                <h4 class="font-semibold text-lg text-indigo-700 mb-2">${report.name} <span class="text-sm text-gray-500">(${report.type})</span></h4>
                <p class="text-sm text-gray-600 mb-2">Tags: ${report.tags.join(', ')}</p>
                <div class="report-parameters-display text-sm text-gray-700">
                    <p><strong>Parameters:</strong></p>
                    ${Object.entries(report.parameters).map(([key, value]) => `<p class="ml-2">${key}: <span class="font-medium">${value || 'N/A'}</span></p>`).join('')}
                </div>
                <div id="parameters-editor-${report.uniqueId}" class="mt-3 p-3 bg-gray-50 rounded hidden">
                    <h5 class="font-medium text-gray-800 mb-2">Edit Parameters</h5>
                    ${renderParameterInputs(report.parameters, report.uniqueId)}
                    <button class="btn btn-primary btn-sm mt-2 save-params-btn" data-report-uid="${report.uniqueId}">Save Parameters</button>
                    <button class="btn btn-secondary btn-sm mt-2 cancel-params-btn" data-report-uid="${report.uniqueId}">Cancel</button>
                </div>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
                <button class="btn btn-blue btn-sm accept-suggestion-btn" data-report-uid="${report.uniqueId}">${report.accepted ? 'Accepted' : 'Add Report'}</button>
                <button class="btn btn-orange btn-sm customize-params-btn" data-report-uid="${report.uniqueId}">Customize</button>
                <button class="btn btn-red btn-sm remove-suggestion-btn" data-report-uid="${report.uniqueId}">Remove</button>
            </div>`;
        suggestedReportsList.appendChild(reportCard);
    });
    suggestedReportsSection.classList.remove('hidden');
    document.querySelector('.container > div:nth-child(4)').classList.add('hidden');
    document.querySelector('.container > div:nth-child(5)').classList.add('hidden');
    document.getElementById('searchBar').closest('.mb-6').classList.add('hidden');
    document.getElementById('toggleFilters').closest('.bg-gray-50').classList.add('hidden');
    document.getElementById('exportCsvBtn').classList.add('hidden');
    document.getElementById('viewAccountsBtn').classList.add('hidden');
    document.getElementById('viewReportsBtn').classList.add('hidden');
    addSuggestedReportListeners();
}

function renderParameterInputs(parameters, uniqueId) {
    let html = '';
    for (const key in parameters) {
        if (parameters.hasOwnProperty(key)) {
            const value = parameters[key];
            let inputType = 'text';
            if (typeof value === 'number') inputType = 'number';
            html += `
                <div class="mb-2">
                    <label for="param-${uniqueId}-${key}" class="block text-xs font-medium text-gray-700">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</label>
                    <input type="${inputType}" id="param-${uniqueId}-${key}" name="${key}" value="${value !== null ? value : ''}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-1 text-sm" />
                </div>`;
        }
    }
    return html;
}

function addSuggestedReportListeners() {
    document.querySelectorAll('.accept-suggestion-btn').forEach(button => {
        button.onclick = (e) => {
            const uniqueId = e.target.dataset.reportUid;
            const reportIndex = currentEditedAccount.tempSuggestedReports.findIndex(r => r.uniqueId === uniqueId);
            if (reportIndex > -1) {
                const reportToAccept = { ...currentEditedAccount.tempSuggestedReports[reportIndex] };
                delete reportToAccept.suggested;
                delete reportToAccept.uniqueId;
                const isAlreadyAdded = currentEditedAccount.associatedReports.some(ar => ar.name === reportToAccept.name && ar.type === reportToAccept.type);
                if (!isAlreadyAdded) {
                    currentEditedAccount.associatedReports.push(reportToAccept);
                    e.target.textContent = 'Accepted';
                    e.target.disabled = true;
                    showMessage(`${reportToAccept.name} added to account.`, 'success');
                } else {
                    showMessage(`${reportToAccept.name} is already added.`, 'info');
                }
            }
        };
    });
    document.querySelectorAll('.remove-suggestion-btn').forEach(button => {
        button.onclick = (e) => {
            const uniqueId = e.target.dataset.reportUid;
            const reportIndex = currentEditedAccount.tempSuggestedReports.findIndex(r => r.uniqueId === uniqueId);
            if (reportIndex > -1) {
                const removedReport = currentEditedAccount.tempSuggestedReports.splice(reportIndex, 1)[0];
                document.getElementById(`suggested-report-${uniqueId}`).remove();
                showMessage(`${removedReport.name} suggestion removed.`, 'info');
            }
        };
    });
    document.querySelectorAll('.customize-params-btn').forEach(button => {
        button.onclick = (e) => {
            const uniqueId = e.target.dataset.reportUid;
            document.getElementById(`parameters-editor-${uniqueId}`).classList.toggle('hidden');
        };
    });
    document.querySelectorAll('.save-params-btn').forEach(button => {
        button.onclick = (e) => {
            const uniqueId = e.target.dataset.reportUid;
            const editor = document.getElementById(`parameters-editor-${uniqueId}`);
            const reportIndex = currentEditedAccount.tempSuggestedReports.findIndex(r => r.uniqueId === uniqueId);
            if (reportIndex > -1) {
                const report = currentEditedAccount.tempSuggestedReports[reportIndex];
                const newParams = {};
                editor.querySelectorAll('input').forEach(input => {
                    newParams[input.name] = input.type === 'number' ? parseFloat(input.value) : input.value;
                });
                report.parameters = newParams;
                const displayArea = document.querySelector(`#suggested-report-${uniqueId} .report-parameters-display`);
                displayArea.innerHTML = `<p><strong>Parameters:</strong></p>${Object.entries(report.parameters).map(([key, value]) => `<p class="ml-2">${key}: <span class="font-medium">${value || 'N/A'}</span></p>`).join('')}`;
                editor.classList.add('hidden');
                showMessage(`Parameters for ${report.name} saved.`, 'success');
            }
        };
    });
    document.querySelectorAll('.cancel-params-btn').forEach(button => {
        button.onclick = (e) => {
            const uniqueId = e.target.dataset.reportUid;
            document.getElementById(`parameters-editor-${uniqueId}`).classList.add('hidden');
        };
    });
    document.getElementById('finalizeAccountBtn').onclick = () => {
        if (!currentEditedAccount) return;

        // Ensure associatedReports is initialized
        currentEditedAccount.associatedReports = currentEditedAccount.associatedReports || [];

        // If currentEditedAccount has an ID (i.e., it's an existing account being edited),
        // use put() to update it. Otherwise, use add() for a new account.
        const store = getObjectStore(STORE_NAME_ACCOUNTS, 'readwrite');
        let request;
        if (currentEditedAccount.id) {
            request = store.put(currentEditedAccount); // Update existing account
        } else {
            request = store.add(currentEditedAccount); // Add new account
        }

        request.onsuccess = () => {
            showMessage('Account and reports saved!', 'success');
            resetUIForNewAccount();
            loadAllAccounts();
            populateFilterOptions();
        };
        request.onerror = (e) => {
            console.error('Error saving account:', e.target.error);
            showMessage('Error saving account.', 'error');
        };
    };
    document.getElementById('cancelSuggestionsBtn').onclick = () => {
        showMessage('Account creation cancelled.', 'info');
        resetUIForNewAccount();
    };
}

function resetUIForNewAccount() {
    currentEditedAccount = null;
    document.getElementById('suggestedReportsSection').classList.add('hidden');
    document.querySelector('.container > div:nth-child(4)').classList.remove('hidden');
    document.querySelector('.container > div:nth-child(5)').classList.remove('hidden');
    document.getElementById('searchBar').closest('.mb-6').classList.remove('hidden');
    document.getElementById('toggleFilters').closest('.bg-gray-50').classList.remove('hidden');
    document.getElementById('exportCsvBtn').classList.remove('hidden');
    document.getElementById('viewAccountsBtn').classList.remove('hidden');
    document.getElementById('viewReportsBtn').classList.remove('hidden');
    ['newAccountName', 'newAccountRegion', 'newAccountWMS', 'newAccountType', 'newCustomerSolutionType', 'newAccountBuilding', 'newNumberOfShifts', 'newPickingMethods', 'newCustomerSLAsText', 'newTransportationConfig'].forEach(id => document.getElementById(id).value = '');
    ['newFoodGrade', 'newHazardousMaterials', 'newInternationalShipping', 'newProcessesReturns', 'newTemperatureControlled', 'newUsesAutomation'].forEach(id => document.getElementById(id).checked = false);
}

// --- Core App Logic ---
function setupEventListeners() {
    document.getElementById('addNewAccountBtn').addEventListener('click', addAccountManually);
    document.getElementById('toggleAddAccounts').addEventListener('click', toggleSection('addAccountsContent'));
    document.getElementById('toggleAddReports').addEventListener('click', toggleSection('addReportsContent'));
    document.getElementById('toggleFilters').addEventListener('click', toggleSection('filtersContent'));
    document.getElementById('viewAccountsBtn').addEventListener('click', () => { currentView = 'accounts'; updateView(); });
    document.getElementById('viewReportsBtn').addEventListener('click', () => { currentView = 'reports'; updateView(); });
    document.getElementById('searchBar').addEventListener('input', applyFilters);
    ['filterRegion', 'filterWMS', 'filterAccountType', 'filterCustomerSolutionType', 'filterReportMinFitScore', 'filterReportTagSearch', 'filterReportType', 'groupBy', 'reportSortOrder'].forEach(id => {
        document.getElementById(id).addEventListener('change', applyFilters);
    });
    document.getElementById('exportCsvBtn').addEventListener('click', exportAccountsToCsv);
    document.querySelectorAll('[data-filter-name]').forEach(button => {
        button.addEventListener('click', (e) => {
            const filterName = e.target.dataset.filterName;
            document.querySelectorAll(`[data-filter-name="${filterName}"]`).forEach(btn => btn.classList.remove('active-filter'));
            e.target.classList.add('active-filter');
            applyFilters();
        });
    });
    document.getElementById('addNewReportBtn').addEventListener('click', addNewReport);
    document.getElementById('submitAccountCsvBtn').addEventListener('click', handleAccountCsvUpload);
    document.getElementById('submitReportCsvBtn').addEventListener('click', handleReportCsvUpload);
}

function toggleSection(contentId) {
    return function() {
        const content = document.getElementById(contentId);
        const svg = this.querySelector('svg');
        content.classList.toggle('hidden');
        svg.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
    };
}

function showMessage(message, type = 'info') {
    const displayArea = document.getElementById('messageDisplay');
    displayArea.textContent = message;
    displayArea.className = 'text-center p-3 rounded-md mb-4';
    displayArea.classList.remove('hidden');
    const typeClasses = {
        success: ['bg-green-100', 'text-green-800'],
        error: ['bg-red-100', 'text-red-800'],
        info: ['bg-blue-100', 'text-blue-800']
    };
    displayArea.classList.add(...(typeClasses[type] || typeClasses.info));
    if (type !== 'info') {
        setTimeout(() => displayArea.classList.add('hidden'), 5000);
    }
}

function addAccountManually() {
    const newAccount = {
        accountName: document.getElementById('newAccountName').value.trim(),
        region: document.getElementById('newAccountRegion').value.trim(),
        wms: document.getElementById('newAccountWMS').value.trim(),
        accountType: document.getElementById('newAccountType').value.trim(),
        customerSolutionType: document.getElementById('newCustomerSolutionType').value.split(',').map(s => s.trim()).filter(Boolean),
        building: document.getElementById('newAccountBuilding').value.trim(),
        numberOfShifts: parseInt(document.getElementById('newNumberOfShifts').value, 10) || 0,
        pickingMethods: document.getElementById('newPickingMethods').value.split(',').map(s => s.trim()).filter(Boolean),
        customerSLAsText: document.getElementById('newCustomerSLAsText').value.trim(),
        transportationConfig: document.getElementById('newTransportationConfig').value.split(',').map(s => s.trim()).filter(Boolean),
        foodGrade: document.getElementById('newFoodGrade').checked,
        hazardousMaterials: document.getElementById('newHazardousMaterials').checked,
        internationalShipping: document.getElementById('newInternationalShipping').checked,
        processesReturns: document.getElementById('newProcessesReturns').checked,
        temperatureControlled: document.getElementById('newTemperatureControlled').checked,
        usesAutomation: document.getElementById('newUsesAutomation').checked,
        associatedReports: []
    };
    if (!newAccount.accountName || !newAccount.region || !newAccount.wms) {
        showMessage('Please fill in Account Name, Region, and WMS.', 'error');
        return;
    }
    const suggestedReports = suggestReportsForAccount(newAccount);
    displaySuggestedReportsUI(suggestedReports, newAccount);
    showMessage(`Reviewing new account "${newAccount.accountName}". Please check suggested reports.`, 'info');
}

function addNewReport() {
    const accountId = parseInt(document.getElementById('selectAccountForReport').value, 10);
    const reportName = document.getElementById('newReportName').value.trim();
    const reportType = document.getElementById('newReportType').value.trim();
    if (isNaN(accountId) || !reportName || !reportType) {
        showMessage('Please select an account and fill in Report Name and Type.', 'error');
        return;
    }
    const newReport = {
        name: reportName,
        reportPath: document.getElementById('newReportPath').value.trim(),
        type: reportType,
        tags: document.getElementById('newReportTags').value.split(',').map(s => s.trim()).filter(Boolean),
        parameters: {}
    };
    const store = getObjectStore(STORE_NAME_ACCOUNTS, 'readwrite');
    const request = store.get(accountId);
    request.onsuccess = function() {
        const account = request.result;
        if (account) {
            if (!account.associatedReports) account.associatedReports = [];
            if (account.associatedReports.some(r => r.name === newReport.name && r.type === newReport.type)) {
                showMessage(`Report "${newReport.name}" already exists for this account.`, 'error');
                return;
            }
            account.associatedReports.push(newReport);
            const updateRequest = store.put(account);
            updateRequest.onsuccess = () => {
                showMessage(`Report "${reportName}" added to "${account.accountName}".`, 'success');
                ['newReportName', 'newReportPath', 'newReportType', 'newReportTags', 'selectAccountForReport'].forEach(id => document.getElementById(id).value = '');
                loadAllAccounts();
            };
            updateRequest.onerror = () => showMessage('Error adding report.', 'error');
        } else {
            showMessage('Account not found.', 'error');
        }
    };
    request.onerror = () => showMessage('Error fetching account.', 'error');
}

function robustCsvParser(csvText) {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let inQuotedField = false;
    csvText = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        if (inQuotedField) {
            if (char === '"' && (i + 1 < csvText.length && csvText[i + 1] === '"')) {
                currentField += '"';
                i++;
            } else if (char === '"') {
                inQuotedField = false;
            } else {
                currentField += char;
            }
        } else {
            if (char === ',') {
                currentRow.push(currentField);
                currentField = '';
            } else if (char === '"') {
                inQuotedField = true;
            } else if (char === '\n') {
                currentRow.push(currentField);
                rows.push(currentRow);
                currentRow = [];
                currentField = '';
            } else {
                currentField += char;
            }
        }
    }
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
    }
    return rows.filter(row => row.length > 1 || (row.length === 1 && row[0] !== ''));
}

function processCsvFile(file, parserFunc) {
    if (!file) {
        showMessage('Please select a file first.', 'error');
        return;
    }
    showMessage('Processing CSV file...', 'info');
    const reader = new FileReader();
    reader.onload = (e) => parserFunc(e.target.result);
    reader.onerror = () => showMessage('Error reading file.', 'error');
    reader.readAsText(file);
}

function handleAccountCsvUpload() {
    const file = document.getElementById('accountCsvUpload').files[0];
    processCsvFile(file, parseAccountCsv);
}

function handleReportCsvUpload() {
    const file = document.getElementById('reportCsvUpload').files[0];
    processCsvFile(file, parseReportCsv);
}

// ** FINAL FIX: Correctly maps CSV headers to camelCase properties **
function headerToCamelCase(header) {
    // Handle special cases first
    const specialCases = {
        'what wms does this account use?': 'wms',
        'customer solution type?': 'customerSolutionType',
        'customer slas text': 'customerSLAsText',
        'number of shifts': 'numberOfShifts', // Add this for consistency
        'picking methods': 'pickingMethods', // Add this
        'transportation config': 'transportationConfig', // Add this
        'food grade': 'foodGrade',
        'hazardous materials': 'hazardousMaterials',
        'international shipping': 'internationalShipping',
        'processes returns': 'processesReturns',
        'temperature controlled': 'temperatureControlled',
        'uses automation': 'usesAutomation',
        'account name': 'accountName',
        'account type': 'accountType'
    };
    const lowerCaseHeader = header.toLowerCase();
    if (specialCases[lowerCaseHeader]) {
        return specialCases[lowerCaseHeader];
    }
    // General case: convert "Title Case" to "camelCase"
    return lowerCaseHeader.replace(/\s(.)/g, (match, group1) => group1.toUpperCase());
}

async function parseAccountCsv(csvText) {
    try {
        const parsedData = robustCsvParser(csvText);
        if (parsedData.length < 2) {
            showMessage('CSV needs a header and at least one data row.', 'error');
            return;
        }
        const headers = parsedData[0].map(h => h.trim());
        const dataRows = parsedData.slice(1);
        const accountsToImport = [];

        dataRows.forEach(values => {
            if (values.every(v => v.trim() === '')) return;
            if (values.length !== headers.length) {
                console.warn('Skipping row with mismatched column count:', values);
                return;
            }
            const account = { associatedReports: [] };
            headers.forEach((header, index) => {
                const propName = headerToCamelCase(header);
                let value = values[index] ? values[index].trim() : '';
                
                if (['customerSolutionType', 'pickingMethods', 'transportationConfig'].includes(propName)) {
                    account[propName] = value ? value.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean) : []; // Added ; as a separator
                } else if (['foodGrade', 'hazardousMaterials', 'internationalShipping', 'processesReturns', 'temperatureControlled', 'usesAutomation'].includes(propName)) {
                    account[propName] = ['true', 'yes', '1'].includes(value.toLowerCase());
                } else if (propName === 'numberOfShifts') {
                    account[propName] = parseInt(value, 10) || 0;
                } else {
                    account[propName] = value;
                }
            });
            // Auto-generate ID if not present in CSV (for new accounts)
            if (!account.id) {
                account.id = Date.now() + Math.floor(Math.random() * 1000); // Simple unique ID
            }
            if (account.accountName) accountsToImport.push(account);
        });

        if (accountsToImport.length > 0) {
            const store = getObjectStore(STORE_NAME_ACCOUNTS, 'readwrite');
            let importCount = 0, updateCount = 0, errorCount = 0;
            const promises = accountsToImport.map(accountData => new Promise(resolve => {
                // Check if account already exists by accountName to update or add
                const existingAccountRequest = store.index('accountName').get(accountData.accountName);
                existingAccountRequest.onsuccess = (e) => {
                    const existingAccount = e.target.result;
                    if (existingAccount) {
                        // Update existing account
                        const updatedAccount = { ...existingAccount, ...accountData };
                        const updateRequest = store.put(updatedAccount);
                        updateRequest.onsuccess = () => { updateCount++; resolve(); };
                        updateRequest.onerror = (err) => { console.error('DB Update Error:', err.target.error); errorCount++; resolve(); };
                    } else {
                        // Add new account and suggest reports
                        const suggestedReports = suggestReportsForAccount(accountData);
                        accountData.associatedReports = suggestedReports.map(sr => { delete sr.suggested; delete sr.uniqueId; return sr; });
                        const addRequest = store.add(accountData);
                        addRequest.onsuccess = () => { importCount++; resolve(); };
                        addRequest.onerror = (err) => { console.error('DB Add Error:', err.target.error); errorCount++; resolve(); };
                    }
                };
                existingAccountRequest.onerror = (err) => {
                    console.error('Error checking for existing account during CSV import:', err.target.error);
                    errorCount++;
                    resolve();
                };
            }));
            await Promise.all(promises);
            showMessage(`Finished! Imported ${importCount} new accounts, updated ${updateCount} accounts, with ${errorCount} errors.`, errorCount > 0 ? 'error' : 'success');
            loadAllAccounts();
            populateFilterOptions();
        } else {
            showMessage('No valid accounts found in file.', 'error');
        }
    } catch (error) {
        showMessage("Critical error during CSV parsing.", "error");
        console.error("CSV Parsing Error:", error);
    } finally {
        document.getElementById('accountCsvUpload').value = '';
    }
}

async function parseReportCsv(csvText) {
    try {
        const parsedData = robustCsvParser(csvText);
        if (parsedData.length < 2) {
            showMessage('CSV needs a header and at least one data row.', 'error');
            return;
        }
        const headers = parsedData[0].map(h => h.trim());
        const dataRows = parsedData.slice(1);
        const reportsToImport = [];
        dataRows.forEach(values => {
            if (values.every(v => v.trim() === '')) return;
            if (values.length !== headers.length) return;
            const report = { parameters: {} };
            headers.forEach((header, index) => {
                let value = values[index] ? values[index].trim() : '';
                let propName = header.toLowerCase().replace(/\s+/g, '');
                if (propName === 'tags') {
                    report[propName] = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];
                } else if (propName === 'accountid') {
                    report[propName] = parseInt(value, 10);
                } else {
                    report[propName] = value;
                }
            });
            if (report.name && !isNaN(report.accountId)) reportsToImport.push(report);
        });

        if (reportsToImport.length > 0) {
            let importCount = 0, errorCount = 0;
            const promises = reportsToImport.map(reportData => new Promise(resolve => {
                const store = getObjectStore(STORE_NAME_ACCOUNTS, 'readwrite');
                const request = store.get(reportData.accountId);
                request.onsuccess = function() {
                    const account = request.result;
                    if (account) {
                        if (!account.associatedReports) account.associatedReports = [];
                        if (!account.associatedReports.some(r => r.name === reportData.name && r.type === reportData.type)) {
                            account.associatedReports.push(reportData);
                            const updateRequest = store.put(account);
                            updateRequest.onsuccess = () => { importCount++; resolve(); };
                            updateRequest.onerror = () => { errorCount++; resolve(); };
                        } else { errorCount++; resolve(); }
                    } else { errorCount++; resolve(); }
                };
                request.onerror = () => { errorCount++; resolve(); };
            }));
            await Promise.all(promises);
            showMessage(`Finished! Imported ${importCount} reports, with ${errorCount} errors.`, errorCount > 0 ? 'error' : 'success');
            loadAllAccounts();
        } else {
            showMessage('No valid reports found in file.', 'error');
        }
    } catch (error) {
        showMessage("Critical error during report CSV parsing.", "error");
        console.error("Report CSV Parsing Error:", error);
    } finally {
        document.getElementById('reportCsvUpload').value = '';
    }
}

// --- Data Loading and Rendering ---
function loadAllAccounts() {
    if (!db) return;
    const store = getObjectStore(STORE_NAME_ACCOUNTS, 'readonly');
    store.getAll().onsuccess = function(e) {
        allAccountsData = e.target.result;
        populateAccountSelect(allAccountsData);
        applyFilters();
    };
}

function populateAccountSelect(accounts) {
    const select = document.getElementById('selectAccountForReport');
    select.innerHTML = '<option value="">-- Select an Account --</option>';
    accounts.sort((a, b) => a.accountName.localeCompare(b.accountName)).forEach(account => {
        select.innerHTML += `<option value="${account.id}">${account.accountName} (ID: ${account.id})</option>`;
    });
}

let allAccountsData = [];

function applyFilters() {
    let filteredAccounts = [...allAccountsData];
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    if (searchTerm) {
        filteredAccounts = filteredAccounts.filter(account =>
            Object.values(account).some(val => String(val).toLowerCase().includes(searchTerm))
        );
    }

    if (currentView === 'accounts') {
        const filters = {
            region: document.getElementById('filterRegion').value,
            wms: document.getElementById('filterWMS').value,
            accountType: document.getElementById('filterAccountType').value
        };
        for (const key in filters) {
            if (filters[key]) filteredAccounts = filteredAccounts.filter(acc => acc[key] === filters[key]);
        }
        const solutionTypes = Array.from(document.getElementById('filterCustomerSolutionType').selectedOptions).map(opt => opt.value);
        if (solutionTypes.length > 0) {
            filteredAccounts = filteredAccounts.filter(acc => acc.customerSolutionType && solutionTypes.every(st => acc.customerSolutionType.includes(st)));
        }
        document.querySelectorAll('[data-filter-name].active-filter').forEach(button => {
            const filterName = button.dataset.filterName;
            const filterValue = button.dataset.filterValue;
            if (filterValue !== 'any') {
                const expectedBoolean = filterValue === 'yes';
                filteredAccounts = filteredAccounts.filter(account => account[filterName] === expectedBoolean);
            }
        });
        renderContent(filteredAccounts, document.getElementById('groupBy').value);
    } else { // reports view
        let allReports = filteredAccounts.flatMap(account => account.associatedReports ? account.associatedReports.map(report => ({ ...report, accountName: account.accountName, accountId: account.id })) : []);
        const reportFilters = {
            minScore: parseInt(document.getElementById('filterReportMinFitScore').value, 10),
            type: document.getElementById('filterReportType').value,
            tags: document.getElementById('filterReportTagSearch').value.toLowerCase().split(',').map(s => s.trim()).filter(Boolean)
        };
        // NOTE: Fit score is not calculated or stored in this version.
        // The filtering by minScore will currently not yield results unless you implement fitScore calculation.
        if (reportFilters.minScore) allReports = allReports.filter(r => r.fitScore >= reportFilters.minScore);
        if (reportFilters.type) allReports = allReports.filter(r => r.type === reportFilters.type);
        if (reportFilters.tags.length > 0) allReports = allReports.filter(r => r.tags && reportFilters.tags.every(t => r.tags.map(tag => tag.toLowerCase()).includes(t)));

        const sortOrder = document.getElementById('reportSortOrder').value;
        // Sort reports by name for consistency if no fitScore exists
        if (sortOrder === 'desc') allReports.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        if (sortOrder === 'asc') allReports.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        renderContent(allReports);
    }
}

function renderContent(data, groupByField) {
    const contentDisplay = document.getElementById('contentDisplay');
    contentDisplay.innerHTML = '';
    if (data.length === 0) {
        contentDisplay.innerHTML = '<p class="text-center text-gray-500">No results found.</p>';
        return;
    }
    if (currentView === 'accounts' && groupByField && groupByField !== 'none') {
        const groupedData = data.reduce((acc, account) => {
            let keys = account[groupByField];
            if (!Array.isArray(keys)) keys = [keys || 'Uncategorized'];
            if (keys.length === 0) keys = ['Uncategorized'];
            keys.forEach(key => {
                if (!acc[key]) acc[key] = [];
                acc[key].push(account);
            });
            return acc;
        }, {});
        Object.keys(groupedData).sort().forEach(groupKey => {
            const groupContainer = document.createElement('div');
            groupContainer.className = 'mb-8';
            groupContainer.innerHTML = `<h3 class="text-xl font-bold text-gray-700 mb-4 border-b pb-2">${groupByField.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${groupKey}</h3>`;
            const groupGrid = document.createElement('div');
            groupGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
            groupedData[groupKey].forEach(account => groupGrid.appendChild(createAccountCard(account)));
            groupContainer.appendChild(groupGrid);
            contentDisplay.appendChild(groupContainer);
        });
    } else {
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
        data.forEach(item => grid.appendChild(currentView === 'accounts' ? createAccountCard(item) : createReportCard(item)));
        contentDisplay.appendChild(grid);
    }
}

function createAccountCard(account) {
    const card = document.createElement('div');
    card.className = 'account-card bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col';
    card.innerHTML = `
        <div class="flex-grow">
            <h3 class="text-xl font-bold text-primary-color mb-2">${account.accountName} <span class="text-sm font-normal text-gray-500">(ID: ${account.id})</span></h3>
            <p class="text-gray-700 mb-1"><span class="font-semibold">Region:</span> ${account.region}</p>
            <p class="text-gray-700 mb-1"><span class="font-semibold">WMS:</span> ${account.wms}</p>
            <div class="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                ${Object.entries({
                    'Food Grade': account.foodGrade, 'Hazmat': account.hazardousMaterials, 'Int\'l Ship': account.internationalShipping,
                    'Returns': account.processesReturns, 'Temp Control': account.temperatureControlled, 'Automation': account.usesAutomation
                }).map(([key, value]) => `<p><span class="font-semibold">${key}:</span> ${value ? 'Yes' : 'No'}</p>`).join('')}
            </div>
        </div>
        <div class="mt-4 pt-3 border-t">
            <h4 class="font-semibold text-subtitle-color mb-2">Reports (${account.associatedReports?.length || 0})</h4>
            <div class="max-h-48 overflow-y-auto pr-2">
                ${account.associatedReports && account.associatedReports.length > 0 ? account.associatedReports.map(report => `
                    <div class="bg-gray-50 p-2 rounded-md mb-2 border">
                        <p class="font-medium text-text-color text-sm">${report.name} <span class="text-xs text-gray-500">(${report.type})</span></p>
                        <button class="btn btn-red-outline btn-xs mt-1 float-right delete-report-btn" data-account-id="${account.id}" data-report-name="${report.name}" data-report-type="${report.type}">X</button>
                    </div>`).join('') : '<p class="text-sm text-gray-500">No reports.</p>'}
            </div>
        </div>
        <div class="mt-4 text-right">
             <button class="btn btn-red btn-sm delete-account-btn" data-id="${account.id}">Delete Account</button>
        </div>`;
    card.querySelector('.delete-account-btn').addEventListener('click', deleteAccount);
    card.querySelectorAll('.delete-report-btn').forEach(button => button.addEventListener('click', deleteReportFromAccount));
    return card;
}

function createReportCard(report) {
    const card = document.createElement('div');
    card.className = 'report-item-card bg-white p-4 rounded-lg shadow-md border';
    card.innerHTML = `
        <h3 class="text-xl font-bold text-others-color mb-2">${report.name}</h3>
        <p><span class="font-semibold">Type:</span> ${report.type || 'N/A'}</p>
        <p><span class="font-semibold">Account:</span> ${report.accountName || 'N/A'} (ID: ${report.accountId})</p>
        <p><span class="font-semibold">Tags:</span> ${report.tags?.join(', ') || 'N/A'}</p>`;
    return card;
}

function deleteAccount(event) {
    const accountId = parseInt(event.target.dataset.id, 10);
    if (!confirm(`Delete account ID ${accountId}? This cannot be undone.`)) return;
    const request = getObjectStore(STORE_NAME_ACCOUNTS, 'readwrite').delete(accountId);
    request.onsuccess = () => { showMessage('Account deleted.', 'success'); loadAllAccounts(); };
    request.onerror = () => showMessage('Error deleting account.', 'error');
}

function deleteReportFromAccount(event) {
    const { accountId, reportName, reportType } = event.target.dataset;
    if (!confirm(`Remove report "${reportName}" from this account?`)) return;
    const store = getObjectStore(STORE_NAME_ACCOUNTS, 'readwrite');
    const request = store.get(parseInt(accountId, 10));
    request.onsuccess = function() {
        const account = request.result;
        if (account && account.associatedReports) {
            const initialLength = account.associatedReports.length;
            account.associatedReports = account.associatedReports.filter(r => r.name !== reportName || r.type !== reportType);
            if (account.associatedReports.length < initialLength) {
                const updateRequest = store.put(account);
                updateRequest.onsuccess = () => { showMessage('Report removed.', 'success'); loadAllAccounts(); };
                updateRequest.onerror = () => showMessage('Error removing report.', 'error');
            }
        }
    };
}

function populateFilterOptions() {
    if (!allAccountsData) return;
    const filters = { region: new Set(), wms: new Set(), accountType: new Set(), customerSolutionType: new Set(), reportType: new Set() };
    allAccountsData.forEach(account => {
        if (account.region) filters.region.add(account.region);
        if (account.wms) filters.wms.add(account.wms);
        if (account.accountType) filters.accountType.add(account.accountType);
        account.customerSolutionType?.forEach(type => filters.customerSolutionType.add(type));
        account.associatedReports?.forEach(report => { if (report.type) filters.reportType.add(report.type); });
    });
    populateSelect('filterRegion', Array.from(filters.region).sort());
    populateSelect('filterWMS', Array.from(filters.wms).sort());
    populateSelect('filterAccountType', Array.from(filters.accountType).sort());
    populateSelect('filterCustomerSolutionType', Array.from(filters.customerSolutionType).sort(), true);
    populateSelect('filterReportType', Array.from(filters.reportType).sort());
}

function populateSelect(elementId, options, isMulti = false) {
    const select = document.getElementById(elementId);
    const selectedValues = Array.from(select.selectedOptions).map(opt => opt.value);
    if (!isMulti) select.innerHTML = '<option value="">All</option>';
    else select.innerHTML = '';
    options.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText;
        option.textContent = optionText;
        if (selectedValues.includes(optionText)) option.selected = true;
        select.appendChild(option);
    });
}

function updateView() {
    const accountsBtn = document.getElementById('viewAccountsBtn');
    const reportsBtn = document.getElementById('viewReportsBtn');
    accountsBtn.classList.toggle('btn-primary', currentView === 'accounts');
    accountsBtn.classList.toggle('btn-secondary', currentView !== 'accounts');
    reportsBtn.classList.toggle('btn-primary', currentView === 'reports');
    reportsBtn.classList.toggle('btn-secondary', currentView !== 'reports');

    document.getElementById('accountFiltersContainer').style.display = currentView === 'accounts' ? 'contents' : 'none';
    document.getElementById('groupByContainer').style.display = currentView === 'accounts' ? 'block' : 'none';
    document.getElementById('reportSortContainer').style.display = currentView === 'reports' ? 'block' : 'none';
    [
        document.getElementById('filterReportMinFitScore').parentElement,
        document.getElementById('filterReportTagSearch').parentElement,
        document.getElementById('filterReportType').parentElement
    ].forEach(el => el.style.display = currentView === 'reports' ? 'block' : 'none');
    
    applyFilters();
}

function exportAccountsToCsv() {
    if (allAccountsData.length === 0) {
        showMessage('No data to export.', 'info');
        return;
    }
    const headers = ["Account Name", "Region", "What WMS does this account use?", "Account Type", "Customer Solution Type?", "Building", "Number of Shifts", "Picking Methods", "Customer SLAs Text", "Transportation Config", "Food Grade", "Hazardous Materials", "International Shipping", "Processes Returns", "Temperature Controlled", "Uses Automation", "Reports"];
    let csvContent = headers.join(',') + '\n';
    allAccountsData.forEach(account => {
        const row = [
            account.accountName, account.region, account.wms, account.accountType,
            account.customerSolutionType?.join(';'), account.building, account.numberOfShifts,
            account.pickingMethods?.join(';'), account.customerSLAsText, account.transportationConfig?.join(';'),
            account.foodGrade, account.hazardousMaterials, account.internationalShipping,
            account.processesReturns, account.temperatureControlled, account.usesAutomation
        ].map(val => csvEscape(val));

        const reportsString = JSON.stringify(account.associatedReports?.map(r => ({ name: r.name, type: r.type, tags: r.tags, parameters: r.parameters })) || []);
        row.push(csvEscape(reportsString));
        csvContent += row.join(',') + '\n';
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'odw_accounts_reports.csv';
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showMessage('Export complete!', 'success');
}

function csvEscape(value) {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (/[",\n]/.test(str)) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}
