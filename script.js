// IndexedDB setup
const DB_NAME = 'odwReportDB';
const DB_VERSION = 1;
const STORE_NAME_ACCOUNTS = 'accounts';
const STORE_NAME_REPORTS = 'reports'; // New store for standardized reports if needed separately, but we'll embed for simplicity.

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
            // Accounts that have more than 1 shift and process returns are good candidates
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
            // All accounts need inventory accuracy
            // No specific criteria, apply to all or broad WMS types
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
            // Accounts with defined customer SLAs are good candidates
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
            // Apply to all operational accounts
            accountType: ['Dedicated', 'Multi-Client', 'Cross-Dock']
        },
        description: 'Tracks the daily volume of incoming and outgoing shipments, providing a high-level view of facility throughput.'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initDb();
    setupEventListeners();
    updateView(); // Initial view update based on currentView
});

function initDb() {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME_ACCOUNTS)) {
            const accountStore = db.createObjectStore(STORE_NAME_ACCOUNTS, { keyPath: 'id', autoIncrement: true });
            accountStore.createIndex('name', 'accountName', { unique: false });
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
            // No need for a separate store for standardReports; they are hardcoded.
            // Reports associated with accounts will be stored within the account object itself.
        }
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        console.log('IndexedDB opened successfully');
        loadAllAccounts(); // Load accounts after DB is ready
        populateFilterOptions();
    };

    request.onerror = function(event) {
        console.error('IndexedDB error:', event.target.errorCode);
        showMessage('Error opening database. Some features may not work.', 'error');
    };
}

function getObjectStore(storeName, mode) {
    const transaction = db.transaction([storeName], mode);
    return transaction.objectStore(storeName);
}

// --- Report Suggestion Logic ---

/**
 * Checks if an account's properties match the criteria of a standard report.
 * @param {Object} account - The account object.
 * @param {Object} criteria - The matching criteria from a standard report.
 * @returns {boolean} True if the account matches, false otherwise.
 */
function doesAccountMatchCriteria(account, criteria) {
    for (const key in criteria) {
        if (!criteria.hasOwnProperty(key)) continue;

        const criterionValue = criteria[key];
        const accountValue = account[key];

        if (typeof criterionValue === 'boolean') {
            if (accountValue !== criterionValue) {
                return false;
            }
        } else if (Array.isArray(criterionValue)) {
            // Check if accountValue (or any part of it if comma-separated) is in the criterion array
            if (typeof accountValue === 'string') {
                const accountValuesArray = accountValue.split(',').map(s => s.trim());
                if (!criterionValue.some(c => accountValuesArray.includes(c))) {
                    return false;
                }
            } else if (!criterionValue.includes(accountValue)) {
                return false;
            }
        } else if (typeof criterionValue === 'object' && criterionValue !== null) {
            // Handle specific object criteria like { min: X }, { exists: true }
            if (criterionValue.min !== undefined) {
                if (typeof accountValue !== 'number' || accountValue < criterionValue.min) {
                    return false;
                }
            }
            if (criterionValue.max !== undefined) {
                if (typeof accountValue !== 'number' || accountValue > criterionValue.max) {
                    return false;
                }
            }
            if (criterionValue.exists !== undefined) {
                if (criterionValue.exists && (!accountValue || accountValue === '' || (Array.isArray(accountValue) && accountValue.length === 0))) {
                    return false;
                }
                if (!criterionValue.exists && accountValue && accountValue !== '' && !(Array.isArray(accountValue) && accountValue.length === 0)) {
                    return false;
                }
            }
        } else {
            // Simple direct match for strings
            if (accountValue !== criterionValue) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Suggests reports for a given account based on predefined criteria.
 * @param {Object} account - The account object for which to suggest reports.
 * @returns {Array} An array of suggested report objects (copies of standard reports with default parameters).
 */
function suggestReportsForAccount(account) {
    const suggestions = [];
    standardReports.forEach(stdReport => {
        if (doesAccountMatchCriteria(account, stdReport.matchingCriteria)) {
            const suggestedReport = {
                id: stdReport.id, // Keep the standard ID for reference
                name: stdReport.name,
                type: stdReport.type,
                tags: [...stdReport.tags], // Clone array
                reportPath: '', // Default empty path
                parameters: { ...stdReport.defaultParameters }, // Clone default parameters
                suggested: true, // Flag to indicate it's a suggestion
                uniqueId: `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}` // Unique ID for temporary UI management
            };
            suggestions.push(suggestedReport);
        }
    });
    return suggestions;
}

// --- UI Functions for Suggested Reports ---

/**
 * Displays the suggested reports to the user.
 * @param {Array} suggestedReports - Reports suggested for the new account.
 * @param {Object} accountData - The temporary account data.
 */
function displaySuggestedReportsUI(suggestedReports, accountData) {
    const suggestedReportsSection = document.getElementById('suggestedReportsSection');
    const suggestedReportsList = document.getElementById('suggestedReportsList');
    suggestedReportsList.innerHTML = ''; // Clear previous suggestions

    currentEditedAccount = { ...accountData, associatedReports: [] }; // Initialize with an empty array for accepted reports
    currentEditedAccount.tempSuggestedReports = suggestedReports.map(r => ({ ...r })); // Store a mutable copy of suggestions

    if (suggestedReports.length === 0) {
        suggestedReportsList.innerHTML = '<p class="text-gray-600 col-span-full">No standard reports were automatically suggested based on this account\'s characteristics.</p>';
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
                <button class="btn btn-blue btn-sm accept-suggestion-btn" data-report-uid="${report.uniqueId}" ${report.accepted ? 'disabled' : ''}>${report.accepted ? 'Accepted' : 'Add Report'}</button>
                <button class="btn btn-orange btn-sm customize-params-btn" data-report-uid="${report.uniqueId}">Customize</button>
                <button class="btn btn-red btn-sm remove-suggestion-btn" data-report-uid="${report.uniqueId}">Remove</button>
            </div>
        `;
        suggestedReportsList.appendChild(reportCard);
    });

    suggestedReportsSection.classList.remove('hidden'); // Show the section
    document.querySelector('.container > div:nth-child(4)').classList.add('hidden'); // Hide Add New Account
    document.querySelector('.container > div:nth-child(5)').classList.add('hidden'); // Hide Add New Report
    document.getElementById('searchBar').closest('.mb-6').classList.add('hidden'); // Hide search bar
    document.getElementById('toggleFilters').closest('.bg-gray-50').classList.add('hidden'); // Hide filters
    document.getElementById('exportCsvBtn').classList.add('hidden'); // Hide export button
    document.getElementById('viewAccountsBtn').classList.add('hidden'); // Hide view toggles
    document.getElementById('viewReportsBtn').classList.add('hidden'); // Hide view toggles

    addSuggestedReportListeners();
}

/**
 * Generates HTML input fields for report parameters.
 * @param {Object} parameters - The parameters object for a report.
 * @param {string} uniqueId - The unique ID of the report for element IDs.
 * @returns {string} HTML string for parameter inputs.
 */
function renderParameterInputs(parameters, uniqueId) {
    let html = '';
    for (const key in parameters) {
        if (parameters.hasOwnProperty(key)) {
            const value = parameters[key];
            let inputType = 'text';
            if (typeof value === 'number') inputType = 'number';
            // Add more type checks if needed (e.g., date, dropdowns for frequency)

            html += `
                <div class="mb-2">
                    <label for="param-${uniqueId}-${key}" class="block text-xs font-medium text-gray-700">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</label>
                    <input type="${inputType}" id="param-${uniqueId}-${key}" name="${key}" value="${value !== null ? value : ''}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-1 text-sm" />
                </div>
            `;
        }
    }
    return html;
}

/**
 * Adds event listeners to the dynamically created suggested report elements.
 */
function addSuggestedReportListeners() {
    document.querySelectorAll('.accept-suggestion-btn').forEach(button => {
        button.onclick = (e) => {
            const uniqueId = e.target.dataset.reportUid;
            const reportIndex = currentEditedAccount.tempSuggestedReports.findIndex(r => r.uniqueId === uniqueId);
            if (reportIndex > -1) {
                const reportToAccept = { ...currentEditedAccount.tempSuggestedReports[reportIndex] };
                delete reportToAccept.suggested; // Remove the suggestion flag
                delete reportToAccept.uniqueId; // Remove temporary UI ID
                
                // Check if this report (by name and type) is already in associatedReports
                const isAlreadyAdded = currentEditedAccount.associatedReports.some(
                    ar => ar.name === reportToAccept.name && ar.type === reportToAccept.type
                );

                if (!isAlreadyAdded) {
                    currentEditedAccount.associatedReports.push(reportToAccept);
                    e.target.textContent = 'Accepted';
                    e.target.disabled = true;
                    showMessage(`${reportToAccept.name} added to account.`, 'success');
                } else {
                    showMessage(`${reportToAccept.name} is already added to this account.`, 'info');
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
            const editor = document.getElementById(`parameters-editor-${uniqueId}`);
            editor.classList.toggle('hidden');
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
                report.parameters = newParams; // Update parameters

                // Update the displayed parameters
                const displayArea = document.querySelector(`#suggested-report-${uniqueId} .report-parameters-display`);
                displayArea.innerHTML = `<p><strong>Parameters:</strong></p>${Object.entries(report.parameters).map(([key, value]) => `<p class="ml-2">${key}: <span class="font-medium">${value || 'N/A'}</span></p>`).join('')}`;

                editor.classList.add('hidden'); // Hide editor
                showMessage(`Parameters for ${report.name} saved.`, 'success');
            }
        };
    });

    document.querySelectorAll('.cancel-params-btn').forEach(button => {
        button.onclick = (e) => {
            const uniqueId = e.target.dataset.reportUid;
            const editor = document.getElementById(`parameters-editor-${uniqueId}`);
            editor.classList.add('hidden'); // Hide editor without saving
        };
    });

    document.getElementById('finalizeAccountBtn').onclick = () => {
        if (!currentEditedAccount) return;

        // Ensure associatedReports is an array
        currentEditedAccount.associatedReports = currentEditedAccount.associatedReports || [];

        // Add any remaining un-accepted suggestions if desired (optional, prompt says "accept")
        // For now, only explicitly accepted reports are added.

        const accountStore = getObjectStore(STORE_NAME_ACCOUNTS, 'readwrite');
        const request = accountStore.add(currentEditedAccount);

        request.onsuccess = () => {
            showMessage('Account and selected reports saved successfully!', 'success');
            resetUIForNewAccount();
            loadAllAccounts();
            populateFilterOptions();
        };
        request.onerror = (e) => {
            console.error('Error saving finalized account:', e.target.error);
            showMessage('Error saving account and reports.', 'error');
        };
    };

    document.getElementById('cancelSuggestionsBtn').onclick = () => {
        showMessage('Account creation cancelled. No data saved.', 'info');
        resetUIForNewAccount();
    };
}

/**
 * Resets the UI after account creation or cancellation.
 */
function resetUIForNewAccount() {
    currentEditedAccount = null;
    document.getElementById('suggestedReportsSection').classList.add('hidden'); // Hide suggestions
    document.querySelector('.container > div:nth-child(4)').classList.remove('hidden'); // Show Add New Account
    document.querySelector('.container > div:nth-child(5)').classList.remove('hidden'); // Show Add New Report
    document.getElementById('searchBar').closest('.mb-6').classList.remove('hidden'); // Show search bar
    document.getElementById('toggleFilters').closest('.bg-gray-50').classList.remove('hidden'); // Show filters
    document.getElementById('exportCsvBtn').classList.remove('hidden'); // Show export button
    document.getElementById('viewAccountsBtn').classList.remove('hidden'); // Show view toggles
    document.getElementById('viewReportsBtn').classList.remove('hidden'); // Show view toggles

    // Clear manual input form
    document.getElementById('newAccountName').value = '';
    document.getElementById('newAccountRegion').value = '';
    document.getElementById('newAccountWMS').value = '';
    document.getElementById('newAccountType').value = '';
    document.getElementById('newCustomerSolutionType').value = '';
    document.getElementById('newAccountBuilding').value = '';
    document.getElementById('newNumberOfShifts').value = '';
    document.getElementById('newPickingMethods').value = '';
    document.getElementById('newCustomerSLAsText').value = '';
    document.getElementById('newTransportationConfig').value = '';
    document.getElementById('newFoodGrade').checked = false;
    document.getElementById('newHazardousMaterials').checked = false;
    document.getElementById('newInternationalShipping').checked = false;
    document.getElementById('newProcessesReturns').checked = false;
    document.getElementById('newTemperatureControlled').checked = false;
    document.getElementById('newUsesAutomation').checked = false;
}


// --- Existing Functions Modified/Integrated ---

function setupEventListeners() {
    document.getElementById('addNewAccountBtn').addEventListener('click', addAccountManually);
    document.getElementById('toggleAddAccounts').addEventListener('click', toggleSection('addAccountsContent'));
    document.getElementById('toggleAddReports').addEventListener('click', toggleSection('addReportsContent'));
    document.getElementById('toggleFilters').addEventListener('click', toggleSection('filtersContent'));
    document.getElementById('viewAccountsBtn').addEventListener('click', () => { currentView = 'accounts'; updateView(); });
    document.getElementById('viewReportsBtn').addEventListener('click', () => { currentView = 'reports'; updateView(); });
    document.getElementById('searchBar').addEventListener('input', applyFilters);
    document.getElementById('filterRegion').addEventListener('change', applyFilters);
    document.getElementById('filterWMS').addEventListener('change', applyFilters);
    document.getElementById('filterAccountType').addEventListener('change', applyFilters);
    document.getElementById('filterCustomerSolutionType').addEventListener('change', applyFilters);
    document.getElementById('filterReportMinFitScore').addEventListener('input', applyFilters);
    document.getElementById('filterReportTagSearch').addEventListener('input', applyFilters);
    document.getElementById('filterReportType').addEventListener('change', applyFilters);
    document.getElementById('groupBy').addEventListener('change', applyFilters);
    document.getElementById('reportSortOrder').addEventListener('change', applyFilters);
    document.getElementById('exportCsvBtn').addEventListener('click', exportAccountsToCsv);

    // Boolean filter buttons
    document.querySelectorAll('[data-filter-name]').forEach(button => {
        button.addEventListener('click', (e) => {
            const filterName = e.target.dataset.filterName;
            const filterValue = e.target.dataset.filterValue;

            // Remove 'active-filter' from siblings
            document.querySelectorAll(`[data-filter-name="${filterName}"]`).forEach(btn => {
                btn.classList.remove('active-filter');
                btn.classList.add('btn-secondary');
                btn.classList.remove('btn-primary');
            });
            // Add 'active-filter' to clicked button
            e.target.classList.add('active-filter', 'btn-primary');
            e.target.classList.remove('btn-secondary');
            applyFilters();
        });
    });

    document.getElementById('addNewReportBtn').addEventListener('click', addNewReport);
    document.getElementById('accountCsvUpload').addEventListener('change', handleAccountCsvUpload);
    document.getElementById('reportCsvUpload').addEventListener('change', handleReportCsvUpload);
}


function toggleSection(contentId) {
    return function() {
        const content = document.getElementById(contentId);
        const button = this;
        const svg = button.querySelector('svg');

        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            svg.style.transform = 'rotate(180deg)';
            button.classList.add('expanded');
            button.classList.remove('collapsed');
        } else {
            content.classList.add('hidden');
            svg.style.transform = 'rotate(0deg)';
            button.classList.add('collapsed');
            button.classList.remove('expanded');
        }
    };
}

function showMessage(message, type = 'info') {
    const displayArea = document.getElementById('messageDisplay');
    displayArea.textContent = message;
    displayArea.className = 'text-center p-3 rounded-md mb-4 '; // Reset classes
    displayArea.classList.remove('hidden');

    if (type === 'success') {
        displayArea.classList.add('bg-green-100', 'text-green-800');
    } else if (type === 'error') {
        displayArea.classList.add('bg-red-100', 'text-red-800');
    } else { // info
        displayArea.classList.add('bg-blue-100', 'text-blue-800');
    }

    // Don't auto-hide info messages for processing
    if (type !== 'info') {
        setTimeout(() => {
            displayArea.classList.add('hidden');
        }, 5000); // Hide after 5 seconds
    }
}


function addAccountManually() {
    const accountName = document.getElementById('newAccountName').value.trim();
    const region = document.getElementById('newAccountRegion').value.trim();
    const wms = document.getElementById('newAccountWMS').value.trim();
    const accountType = document.getElementById('newAccountType').value.trim();
    const customerSolutionType = document.getElementById('newCustomerSolutionType').value.split(',').map(s => s.trim()).filter(s => s !== '');
    const building = document.getElementById('newAccountBuilding').value.trim();
    const numberOfShifts = parseInt(document.getElementById('newNumberOfShifts').value, 10) || 0;
    const pickingMethods = document.getElementById('newPickingMethods').value.split(',').map(s => s.trim()).filter(s => s !== '');
    const customerSLAsText = document.getElementById('newCustomerSLAsText').value.trim();
    const transportationConfig = document.getElementById('newTransportationConfig').value.split(',').map(s => s.trim()).filter(s => s !== '');
    const foodGrade = document.getElementById('newFoodGrade').checked;
    const hazardousMaterials = document.getElementById('newHazardousMaterials').checked;
    const internationalShipping = document.getElementById('newInternationalShipping').checked;
    const processesReturns = document.getElementById('newProcessesReturns').checked;
    const temperatureControlled = document.getElementById('newTemperatureControlled').checked;
    const usesAutomation = document.getElementById('newUsesAutomation').checked;

    if (!accountName || !region || !wms) {
        showMessage('Please fill in Account Name, Region, and WMS for the new account.', 'error');
        return;
    }

    const newAccount = {
        accountName,
        region,
        wms,
        accountType,
        customerSolutionType,
        building,
        numberOfShifts,
        pickingMethods,
        customerSLAsText,
        transportationConfig,
        foodGrade,
        hazardousMaterials,
        internationalShipping,
        processesReturns,
        temperatureControlled,
        usesAutomation,
        associatedReports: [] // Initialize with empty array for future reports
    };

    // Suggest reports immediately after account data is collected
    const suggestedReports = suggestReportsForAccount(newAccount);
    displaySuggestedReportsUI(suggestedReports, newAccount); // Display UI for user to accept/customize
    showMessage(`Account "${accountName}" data collected. Please review suggested reports.`, 'info');
}


function addNewReport() {
    const accountSelect = document.getElementById('selectAccountForReport');
    const accountId = parseInt(accountSelect.value, 10);
    const reportName = document.getElementById('newReportName').value.trim();
    const reportPath = document.getElementById('newReportPath').value.trim();
    const reportType = document.getElementById('newReportType').value.trim();
    const reportTags = document.getElementById('newReportTags').value.split(',').map(s => s.trim()).filter(s => s !== '');

    if (isNaN(accountId) || !reportName || !reportType) {
        showMessage('Please select an account and fill in Report Name and Report Type.', 'error');
        return;
    }

    const newReport = {
        name: reportName,
        reportPath: reportPath,
        type: reportType,
        tags: reportTags,
        fitScore: Math.floor(Math.random() * 5) + 1, // Random fit score for new reports
        parameters: {} // Initialize parameters for manually added reports
    };

    const store = getObjectStore(STORE_NAME_ACCOUNTS, 'readwrite');
    const request = store.get(accountId);

    request.onsuccess = function() {
        const account = request.result;
        if (account) {
            // Ensure associatedReports array exists
            if (!account.associatedReports) {
                account.associatedReports = [];
            }
            // Check for duplicates before adding
            const isDuplicate = account.associatedReports.some(
                report => report.name === newReport.name && report.type === newReport.type
            );

            if (isDuplicate) {
                showMessage(`Report "${newReport.name}" of type "${newReport.type}" already exists for this account.`, 'error');
                return;
            }

            account.associatedReports.push(newReport);
            const updateRequest = store.put(account);

            updateRequest.onsuccess = () => {
                showMessage(`Report "${reportName}" added to account "${account.accountName}".`, 'success');
                // Clear report form
                document.getElementById('newReportName').value = '';
                document.getElementById('newReportPath').value = '';
                document.getElementById('newReportType').value = '';
                document.getElementById('newReportTags').value = '';
                document.getElementById('selectAccountForReport').value = ''; // Reset dropdown
                loadAllAccounts(); // Re-render content
            };
            updateRequest.onerror = (e) => {
                console.error('Error updating account with new report:', e.target.error);
                showMessage('Error adding report to account.', 'error');
            };
        } else {
            showMessage('Account not found.', 'error');
        }
    };
    request.onerror = (e) => {
        console.error('Error fetching account:', e.target.error);
        showMessage('Error fetching account to add report.', 'error');
    };
}

/**
 * **IMPROVED**
 * A robust CSV parser that handles quoted fields.
 * @param {string} csvText The full text of the CSV file.
 * @returns {Array<Array<string>>} An array of arrays, representing rows and their cells.
 */
function robustCsvParser(csvText) {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let inQuotedField = false;

    // Normalize line endings
    csvText = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];

        if (inQuotedField) {
            if (char === '"') {
                // Check if it's an escaped quote
                if (i + 1 < csvText.length && csvText[i + 1] === '"') {
                    currentField += '"';
                    i++; // Skip the next quote
                } else {
                    inQuotedField = false;
                }
            } else {
                currentField += char;
            }
        } else {
            switch (char) {
                case ',':
                    currentRow.push(currentField);
                    currentField = '';
                    break;
                case '"':
                    // Start of a quoted field
                    inQuotedField = true;
                    break;
                case '\n':
                    currentRow.push(currentField);
                    rows.push(currentRow);
                    currentRow = [];
                    currentField = '';
                    break;
                default:
                    currentField += char;
            }
        }
    }

    // Add the last field and row if the file doesn't end with a newline
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
    }
    
    // Filter out empty rows that might result from trailing newlines
    return rows.filter(row => row.length > 0 && (row.length > 1 || row[0] !== ''));
}


function handleAccountCsvUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    showMessage('Processing CSV file...', 'info');

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        // Use the new robust parser
        parseAccountCsv(text);
    };
    reader.onerror = function() {
        showMessage('Error reading the file. Please try again.', 'error');
    };
    reader.readAsText(file);
}

function parseAccountCsv(csvText) {
    const parsedData = robustCsvParser(csvText);

    if (parsedData.length < 2) {
        showMessage('CSV file must contain a header row and at least one data row.', 'error');
        return;
    }

    const headers = parsedData[0].map(h => h.trim());
    const dataRows = parsedData.slice(1);
    const accountsToImport = [];

    dataRows.forEach(values => {
        // Skip empty rows
        if (values.every(v => v.trim() === '')) return;

        const account = { associatedReports: [] };
        if (values.length !== headers.length) {
            console.warn('Skipping mismatched row:', values);
            return; // Skip rows that don't match the header count
        }
        
        headers.forEach((header, index) => {
            let value = values[index] ? values[index].trim() : '';
            let propName = header.toLowerCase()
                                 .replace(/what wms does this account use\?/, 'wms')
                                 .replace(/account name/, 'accountName')
                                 .replace(/account type/, 'accountType')
                                 .replace(/customer solution type\?/, 'customerSolutionType')
                                 .replace(/number of shifts/, 'numberOfShifts')
                                 .replace(/picking methods/, 'pickingMethods')
                                 .replace(/customer slas text/, 'customerSLAsText')
                                 .replace(/transportation config/, 'transportationConfig')
                                 .replace(/food grade/, 'foodGrade')
                                 .replace(/hazardous materials/, 'hazardousMaterials')
                                 .replace(/international shipping/, 'internationalShipping')
                                 .replace(/processes returns/, 'processesReturns')
                                 .replace(/temperature controlled/, 'temperatureControlled')
                                 .replace(/uses automation/, 'usesAutomation')
                                 .replace(/ /g, '');

            if (propName.includes('solutiontype') || propName.includes('pickingmethods') || propName.includes('transportationconfig')) {
                account[propName] = value ? value.split(',').map(s => s.trim()).filter(s => s !== '') : [];
            } else if (['foodGrade', 'hazardousMaterials', 'internationalShipping', 'processesReturns', 'temperatureControlled', 'usesAutomation'].includes(propName)) {
                account[propName] = value.toLowerCase() === 'true' || value.toLowerCase() === 'yes' || value === '1';
            } else if (propName === 'numberOfShifts') {
                account[propName] = parseInt(value, 10) || 0;
            } else {
                account[propName] = value;
            }
        });
        
        // Basic validation to ensure it's a real account
        if (account.accountName) {
            accountsToImport.push(account);
        }
    });

    if (accountsToImport.length > 0) {
        const store = getObjectStore(STORE_NAME_ACCOUNTS, 'readwrite');
        let importCount = 0;
        let errorCount = 0;

        accountsToImport.forEach(accountData => {
            const suggestedReports = suggestReportsForAccount(accountData);
            accountData.associatedReports = suggestedReports.map(sr => {
                delete sr.suggested;
                delete sr.uniqueId;
                return sr;
            });
            
            const request = store.add(accountData);
            request.onsuccess = () => {
                importCount++;
                if (importCount + errorCount === accountsToImport.length) {
                    showMessage(`Finished! Imported ${importCount} accounts, with ${errorCount} errors.`, 'success');
                    loadAllAccounts();
                    populateFilterOptions();
                }
            };
            request.onerror = (e) => {
                console.error('Error adding account from CSV:', e.target.error, 'Data:', accountData);
                errorCount++;
                if (importCount + errorCount === accountsToImport.length) {
                    showMessage(`Finished! Imported ${importCount} accounts, with ${errorCount} errors.`, 'error');
                    loadAllAccounts();
                    populateFilterOptions();
                }
            };
        });
        document.getElementById('accountCsvUpload').value = '';
    } else {
        showMessage('No valid accounts could be imported from the file. Please check the content and headers.', 'error');
    }
}


function handleReportCsvUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    showMessage('Processing CSV file...', 'info');

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        parseReportCsv(text);
    };
    reader.onerror = function() {
        showMessage('Error reading the file. Please try again.', 'error');
    };
    reader.readAsText(file);
}

function parseReportCsv(csvText) {
    const parsedData = robustCsvParser(csvText);
    
    if (parsedData.length < 2) {
        showMessage('CSV file must contain a header row and at least one data row.', 'error');
        return;
    }

    const headers = parsedData[0].map(h => h.trim());
    const dataRows = parsedData.slice(1);
    const reportsToImport = [];

    dataRows.forEach(values => {
        if (values.every(v => v.trim() === '')) return;

        const report = { parameters: {} };
        if (values.length !== headers.length) {
            console.warn('Skipping mismatched row:', values);
            return;
        }

        headers.forEach((header, index) => {
            let value = values[index] ? values[index].trim() : '';
            let propName = header.toLowerCase()
                                 .replace(/account id/, 'accountId')
                                 .replace(/report name/, 'name')
                                 .replace(/report path/, 'reportPath')
                                 .replace(/report type/, 'type')
                                 .replace(/tags/, 'tags')
                                 .replace(/ /g, '');

            if (propName === 'tags') {
                report[propName] = value ? value.split(',').map(s => s.trim()).filter(s => s !== '') : [];
            } else if (propName === 'accountId') {
                report[propName] = parseInt(value, 10);
            } else {
                report[propName] = value;
            }
        });

        if (report.name && !isNaN(report.accountId)) {
            reportsToImport.push(report);
        }
    });

    if (reportsToImport.length > 0) {
        const store = getObjectStore(STORE_NAME_ACCOUNTS, 'readwrite');
        let importCount = 0;
        let errorCount = 0;
        const totalReports = reportsToImport.length;

        reportsToImport.forEach(reportData => {
            const accountId = reportData.accountId;

            const request = store.get(accountId);
            request.onsuccess = function() {
                const account = request.result;
                if (account) {
                    if (!account.associatedReports) {
                        account.associatedReports = [];
                    }
                    reportData.fitScore = Math.floor(Math.random() * 5) + 1;
                    const isDuplicate = account.associatedReports.some(
                        r => r.name === reportData.name && r.type === reportData.type
                    );

                    if (!isDuplicate) {
                        account.associatedReports.push(reportData);
                        const updateRequest = store.put(account);
                        updateRequest.onsuccess = () => {
                            importCount++;
                            if (importCount + errorCount === totalReports) {
                                showMessage(`Finished! Imported ${importCount} reports, with ${errorCount} errors.`, 'success');
                                loadAllAccounts();
                            }
                        };
                        updateRequest.onerror = () => {
                            errorCount++;
                            if (importCount + errorCount === totalReports) {
                                showMessage(`Finished! Imported ${importCount} reports, with ${errorCount} errors.`, 'error');
                                loadAllAccounts();
                            }
                        };
                    } else {
                        errorCount++;
                        if (importCount + errorCount === totalReports) {
                            showMessage(`Finished! Imported ${importCount} reports, with ${errorCount} errors (some were duplicates).`, 'info');
                            loadAllAccounts();
                        }
                    }
                } else {
                    errorCount++;
                    if (importCount + errorCount === totalReports) {
                        showMessage(`Finished! Imported ${importCount} reports, with ${errorCount} errors (some accounts not found).`, 'error');
                        loadAllAccounts();
                    }
                }
            };
            request.onerror = () => {
                errorCount++;
                if (importCount + errorCount === totalReports) {
                    showMessage(`Finished! Imported ${importCount} reports, with ${errorCount} errors.`, 'error');
                    loadAllAccounts();
                }
            };
        });
        document.getElementById('reportCsvUpload').value = '';
    } else {
        showMessage('No valid reports could be imported. Please check the content and headers.', 'error');
    }
}


function loadAllAccounts() {
    const store = getObjectStore(STORE_NAME_ACCOUNTS, 'readonly');
    const request = store.getAll();

    request.onsuccess = function() {
        const accounts = request.result;
        allAccountsData = accounts; // Store all loaded data globally
        populateAccountSelect(accounts); // Populate dropdown for adding reports
        applyFilters(); // Apply filters to display content
    };

    request.onerror = function(e) {
        console.error('Error loading accounts:', e.target.error);
        showMessage('Error loading accounts from database.', 'error');
    };
}

function populateAccountSelect(accounts) {
    const select = document.getElementById('selectAccountForReport');
    select.innerHTML = '<option value="">-- Select an Account --</option>'; // Clear existing options
    accounts.forEach(account => {
        const option = document.createElement('option');
        option.value = account.id;
        option.textContent = `${account.accountName} (ID: ${account.id})`;
        select.appendChild(option);
    });
}

let allAccountsData = []; // Store all accounts here

function applyFilters() {
    let filteredAccounts = [...allAccountsData];

    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const filterRegion = document.getElementById('filterRegion').value;
    const filterWMS = document.getElementById('filterWMS').value;
    const filterAccountType = document.getElementById('filterAccountType').value;
    const filterCustomerSolutionType = Array.from(document.getElementById('filterCustomerSolutionType').selectedOptions).map(option => option.value);
    const filterReportMinFitScore = parseInt(document.getElementById('filterReportMinFitScore').value, 10);
    const filterReportTagSearch = document.getElementById('filterReportTagSearch').value.toLowerCase().split(',').map(s => s.trim()).filter(s => s !== '');
    const filterReportType = document.getElementById('filterReportType').value;

    const groupByField = document.getElementById('groupBy').value;
    const reportSortOrder = document.getElementById('reportSortOrder').value;

    const booleanFilters = {};
    document.querySelectorAll('[data-filter-name].active-filter').forEach(button => {
        const filterName = button.dataset.filterName;
        booleanFilters[filterName] = button.dataset.filterValue;
    });


    if (searchTerm) {
        filteredAccounts = filteredAccounts.filter(account =>
            (account.accountName && account.accountName.toLowerCase().includes(searchTerm)) ||
            (account.region && account.region.toLowerCase().includes(searchTerm)) ||
            (account.wms && account.wms.toLowerCase().includes(searchTerm)) ||
            (account.building && account.building.toLowerCase().includes(searchTerm))
        );
    }

    if (filterRegion) {
        filteredAccounts = filteredAccounts.filter(account => account.region === filterRegion);
    }
    if (filterWMS) {
        filteredAccounts = filteredAccounts.filter(account => account.wms === filterWMS);
    }
    if (filterAccountType) {
        filteredAccounts = filteredAccounts.filter(account => account.accountType === filterAccountType);
    }
    if (filterCustomerSolutionType.length > 0) {
        filteredAccounts = filteredAccounts.filter(account =>
            account.customerSolutionType && filterCustomerSolutionType.every(filter => account.customerSolutionType.includes(filter))
        );
    }

    // Apply boolean filters
    for (const key in booleanFilters) {
        const filterValue = booleanFilters[key];
        if (filterValue !== 'any') {
            const expectedBoolean = filterValue === 'yes';
            filteredAccounts = filteredAccounts.filter(account => account[key] === expectedBoolean);
        }
    }

    let displayData = [];
    if (currentView === 'accounts') {
        displayData = filteredAccounts;
    } else { // currentView === 'reports'
        let allReports = [];
        filteredAccounts.forEach(account => {
            if (account.associatedReports) {
                account.associatedReports.forEach(report => {
                    allReports.push({ ...report, accountName: account.accountName, accountId: account.id, accountRegion: account.region, accountWMS: account.wms });
                });
            }
        });

        if (filterReportMinFitScore) {
            allReports = allReports.filter(report => report.fitScore >= filterReportMinFitScore);
        }
        if (filterReportTagSearch.length > 0) {
            allReports = allReports.filter(report =>
                report.tags && filterReportTagSearch.every(tag => report.tags.map(t => t.toLowerCase()).includes(tag))
            );
        }
        if (filterReportType) {
            allReports = allReports.filter(report => report.type === filterReportType);
        }

        if (reportSortOrder === 'desc') {
            allReports.sort((a, b) => b.fitScore - a.fitScore);
        } else if (reportSortOrder === 'asc') {
            allReports.sort((a, b) => a.fitScore - b.fitScore);
        }
        
        displayData = allReports;
    }

    renderContent(displayData, groupByField);
}


function renderContent(data, groupByField) {
    const contentDisplay = document.getElementById('contentDisplay');
    contentDisplay.innerHTML = ''; // Clear previous content

    if (data.length === 0) {
        contentDisplay.innerHTML = '<p class="text-center text-white-500">No results found matching your filters.</p>';
        return;
    }

    if (currentView === 'accounts') {
        if (groupByField && groupByField !== 'none') {
            const groupedData = data.reduce((acc, account) => {
                let key = account[groupByField];
                if (Array.isArray(key)) {
                    if (key.length === 0) {
                        key = ['Uncategorized'];
                    }
                    key.forEach(item => {
                        if (!acc[item]) acc[item] = [];
                        acc[item].push(account);
                    });
                } else {
                    if (!key) key = 'Uncategorized';
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(account);
                }
                return acc;
            }, {});

            Object.keys(groupedData).sort().forEach(groupKey => {
                const groupContainer = document.createElement('div');
                groupContainer.className = 'mb-8';
                groupContainer.innerHTML = `<h3 class="text-xl font-bold text-gray-700 mb-4 border-b pb-2">${groupByField.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${groupKey}</h3>`;
                
                const groupGrid = document.createElement('div');
                groupGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
                groupedData[groupKey].forEach(account => {
                    groupGrid.appendChild(createAccountCard(account));
                });
                groupContainer.appendChild(groupGrid);
                contentDisplay.appendChild(groupContainer);
            });
        } else {
            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
            data.forEach(account => {
                grid.appendChild(createAccountCard(account));
            });
            contentDisplay.appendChild(grid);
        }
    } else { // currentView === 'reports'
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
        data.forEach(report => {
            grid.appendChild(createReportCard(report));
        });
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
            <p class="text-gray-700 mb-1"><span class="font-semibold">Type:</span> ${account.accountType || 'N/A'}</p>
            <p class="text-gray-700 mb-1"><span class="font-semibold">Solution:</span> ${account.customerSolutionType && account.customerSolutionType.length > 0 ? account.customerSolutionType.join(', ') : 'N/A'}</p>
            <p class="text-gray-700 mb-1"><span class="font-semibold">Building:</span> ${account.building || 'N/A'}</p>
            <p class="text-gray-700 mb-1"><span class="font-semibold">Shifts:</span> ${account.numberOfShifts || 'N/A'}</p>
            <p class="text-gray-700 mb-1"><span class="font-semibold">Picking Methods:</span> ${account.pickingMethods && account.pickingMethods.length > 0 ? account.pickingMethods.join(', ') : 'N/A'}</p>
            <p class="text-gray-700 mb-1"><span class="font-semibold">SLAs:</span> ${account.customerSLAsText || 'N/A'}</p>
            <p class="text-gray-700 mb-1"><span class="font-semibold">Transportation:</span> ${account.transportationConfig && account.transportationConfig.length > 0 ? account.transportationConfig.join(', ') : 'N/A'}</p>
            
            <div class="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <p><span class="font-semibold">Food Grade:</span> ${account.foodGrade ? 'Yes' : 'No'}</p>
                <p><span class="font-semibold">Hazmat:</span> ${account.hazardousMaterials ? 'Yes' : 'No'}</p>
                <p><span class="font-semibold">Int'l Ship:</span> ${account.internationalShipping ? 'Yes' : 'No'}</p>
                <p><span class="font-semibold">Returns:</span> ${account.processesReturns ? 'Yes' : 'No'}</p>
                <p><span class="font-semibold">Temp Control:</span> ${account.temperatureControlled ? 'Yes' : 'No'}</p>
                <p><span class="font-semibold">Automation:</span> ${account.usesAutomation ? 'Yes' : 'No'}</p>
            </div>
        </div>

        <div class="mt-4 pt-3 border-t">
            <h4 class="font-semibold text-subtitle-color mb-2">Associated Reports (${account.associatedReports ? account.associatedReports.length : 0})</h4>
            <div id="reports-for-account-${account.id}" class="max-h-48 overflow-y-auto pr-2">
                ${account.associatedReports && account.associatedReports.length > 0
                    ? account.associatedReports.map(report => `
                        <div class="report-item-card bg-gray-50 p-3 rounded-md mb-2 border border-gray-200">
                            <p class="font-medium text-text-color">${report.name} <span class="text-sm text-gray-500">(${report.type})</span></p>
                            <p class="text-xs text-gray-600">Path: ${report.reportPath || 'N/A'}</p>
                            <p class="text-xs text-gray-600">Tags: ${report.tags && report.tags.length > 0 ? report.tags.join(', ') : 'N/A'}</p>
                            <div class="text-xs text-gray-700">
                                <strong>Parameters:</strong>
                                ${Object.entries(report.parameters || {}).map(([key, value]) => `<span class="ml-1">${key}: ${value || 'N/A'}</span>`).join(', ')}
                            </div>
                            <button class="btn btn-red-outline btn-xs mt-2 delete-report-btn" data-account-id="${account.id}" data-report-name="${report.name}" data-report-type="${report.type}">Remove Report</button>
                        </div>
                    `).join('')
                    : '<p class="text-sm text-gray-500">No reports associated.</p>'}
            </div>
        </div>
        <div class="mt-4 text-right">
             <button class="btn btn-red btn-sm delete-account-btn" data-id="${account.id}">Delete Account</button>
        </div>
    `;

    card.querySelector('.delete-account-btn').addEventListener('click', deleteAccount);
    card.querySelectorAll('.delete-report-btn').forEach(button => {
        button.addEventListener('click', deleteReportFromAccount);
    });
    return card;
}

function createReportCard(report) {
    const card = document.createElement('div');
    card.className = 'report-item-card bg-white p-4 rounded-lg shadow-md border border-gray-200';
    card.innerHTML = `
        <h3 class="text-xl font-bold text-others-color mb-2">${report.name}</h3>
        <p class="text-gray-700 mb-1"><span class="font-semibold">Type:</span> ${report.type || 'N/A'}</p>
        <p class="text-gray-700 mb-1"><span class="font-semibold">Associated Account:</span> ${report.accountName || 'N/A'} (ID: ${report.accountId})</p>
        <p class="text-gray-700 mb-1"><span class="font-semibold">Path:</span> ${report.reportPath || 'N/A'}</p>
        <p class="text-gray-700 mb-1"><span class="font-semibold">Tags:</span> ${report.tags && report.tags.length > 0 ? report.tags.join(', ') : 'N/A'}</p>
        <div class="mt-2 text-sm text-gray-700">
            <strong>Parameters:</strong>
            ${Object.entries(report.parameters || {}).map(([key, value]) => `<span class="ml-1">${key}: ${value || 'N/A'}</span>`).join(', ')}
        </div>
    `;
    return card;
}


function deleteAccount(event) {
    const accountId = parseInt(event.target.dataset.id, 10);
    if (!confirm('Are you sure you want to delete this account and all its associated reports?')) {
        return;
    }

    const store = getObjectStore(STORE_NAME_ACCOUNTS, 'readwrite');
    const request = store.delete(accountId);

    request.onsuccess = () => {
        showMessage('Account deleted successfully!', 'success');
        loadAllAccounts(); // Re-render content
    };
    request.onerror = (e) => {
        console.error('Error deleting account:', e.target.error);
        showMessage('Error deleting account.', 'error');
    };
}

function deleteReportFromAccount(event) {
    const accountId = parseInt(event.target.dataset.accountId, 10);
    const reportName = event.target.dataset.reportName;
    const reportType = event.target.dataset.reportType;

    if (!confirm(`Are you sure you want to remove the report "${reportName}" from this account?`)) {
        return;
    }

    const store = getObjectStore(STORE_NAME_ACCOUNTS, 'readwrite');
    const request = store.get(accountId);

    request.onsuccess = function() {
        const account = request.result;
        if (account && account.associatedReports) {
            const initialLength = account.associatedReports.length;
            account.associatedReports = account.associatedReports.filter(
                report => !(report.name === reportName && report.type === reportType)
            );

            if (account.associatedReports.length < initialLength) {
                const updateRequest = store.put(account);
                updateRequest.onsuccess = () => {
                    showMessage(`Report "${reportName}" removed from account "${account.accountName}".`, 'success');
                    loadAllAccounts(); // Re-render content
                };
                updateRequest.onerror = (e) => {
                    console.error('Error updating account after report removal:', e.target.error);
                    showMessage('Error removing report from account.', 'error');
                };
            } else {
                showMessage('Report not found in account.', 'error');
            }
        } else {
            showMessage('Account not found or has no reports.', 'error');
        }
    };
    request.onerror = (e) => {
        console.error('Error fetching account to remove report:', e.target.error);
        showMessage('Error fetching account.', 'error');
    };
}


function populateFilterOptions() {
    const regions = new Set();
    const wmss = new Set();
    const accountTypes = new Set();
    const customerSolutionTypes = new Set();
    const reportTypes = new Set();

    allAccountsData.forEach(account => {
        if (account.region) regions.add(account.region);
        if (account.wms) wmss.add(account.wms);
        if (account.accountType) accountTypes.add(account.accountType);
        if (account.customerSolutionType) {
            account.customerSolutionType.forEach(type => customerSolutionTypes.add(type));
        }
        if (account.associatedReports) {
            account.associatedReports.forEach(report => {
                if (report.type) reportTypes.add(report.type);
            });
        }
    });

    populateSelect('filterRegion', Array.from(regions).sort());
    populateSelect('filterWMS', Array.from(wmss).sort());
    populateSelect('filterAccountType', Array.from(accountTypes).sort());
    populateSelect('filterCustomerSolutionType', Array.from(customerSolutionTypes).sort(), true); // Multi-select
    populateSelect('filterReportType', Array.from(reportTypes).sort());
}

function populateSelect(elementId, options, isMulti = false) {
    const select = document.getElementById(elementId);
    const currentValue = select.value;
    
    if (!isMulti) {
        select.innerHTML = '<option value="">All</option>'; // Default for single select
    } else {
        select.innerHTML = ''; // Clear for multi-select, no "All" option
    }

    options.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText;
        option.textContent = optionText;
        select.appendChild(option);
    });

    select.value = currentValue; // Preserve selection
}

function updateView() {
    const accountsBtn = document.getElementById('viewAccountsBtn');
    const reportsBtn = document.getElementById('viewReportsBtn');
    
    accountsBtn.classList.remove('btn-primary', 'btn-secondary');
    reportsBtn.classList.remove('btn-primary', 'btn-secondary');

    const accountFilters = document.getElementById('accountFiltersContainer');
    const reportFilters = document.getElementById('reportFiltersContainer');
    const groupBy = document.getElementById('groupByContainer');


    if (currentView === 'accounts') {
        accountsBtn.classList.add('btn-primary');
        reportsBtn.classList.add('btn-secondary');
        accountFilters.classList.remove('hidden');
        reportFilters.classList.add('hidden');
        groupBy.classList.remove('hidden');

    } else { // reports view
        accountsBtn.classList.add('btn-secondary');
        reportsBtn.classList.add('btn-primary');
        accountFilters.classList.add('hidden');
        reportFilters.classList.remove('hidden');
        groupBy.classList.add('hidden');
    }
    applyFilters();
}

function exportAccountsToCsv() {
    if (allAccountsData.length === 0) {
        showMessage('No data to export.', 'info');
        return;
    }

    const headers = [
        "Account Name", "Region", "What WMS does this account use?", "Account Type",
        "Customer Solution Type?", "Building", "Number of Shifts", "Picking Methods",
        "Customer SLAs Text", "Transportation Config", "Food Grade", "Hazardous Materials",
        "International Shipping", "Processes Returns", "Temperature Controlled", "Uses Automation",
        "Reports" // Combined reports for CSV simplicity
    ];

    let csvContent = headers.join(',') + '\n';

    allAccountsData.forEach(account => {
        const row = [];
        row.push(csvEscape(account.accountName || ''));
        row.push(csvEscape(account.region || ''));
        row.push(csvEscape(account.wms || ''));
        row.push(csvEscape(account.accountType || ''));
        row.push(csvEscape(Array.isArray(account.customerSolutionType) ? account.customerSolutionType.join(';') : '')); // Use ; for multi-value
        row.push(csvEscape(account.building || ''));
        row.push(account.numberOfShifts !== undefined ? account.numberOfShifts.toString() : '');
        row.push(csvEscape(Array.isArray(account.pickingMethods) ? account.pickingMethods.join(';') : ''));
        row.push(csvEscape(account.customerSLAsText || ''));
        row.push(csvEscape(Array.isArray(account.transportationConfig) ? account.transportationConfig.join(';') : ''));
        row.push(account.foodGrade ? 'TRUE' : 'FALSE');
        row.push(account.hazardousMaterials ? 'TRUE' : 'FALSE');
        row.push(account.internationalShipping ? 'TRUE' : 'FALSE');
        row.push(account.processesReturns ? 'TRUE' : 'FALSE');
        row.push(account.temperatureControlled ? 'TRUE' : 'FALSE');
        row.push(account.usesAutomation ? 'TRUE' : 'FALSE');

        const reportsString = account.associatedReports && account.associatedReports.length > 0
            ? JSON.stringify(account.associatedReports.map(r => ({
                name: r.name, type: r.type, path: r.reportPath,
                tags: r.tags ? r.tags.join('|') : '',
                parameters: r.parameters ? JSON.stringify(r.parameters) : '{}'
              })))
            : '[]';
        row.push(csvEscape(reportsString));

        csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'odw_accounts_reports.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showMessage('Accounts and reports exported to CSV!', 'success');
    }
}

function csvEscape(value) {
    if (value === null || value === undefined) {
        return '';
    }
    value = String(value);
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return '"' + value.replace(/"/g, '""') + '"';
    }
    return value;
}
