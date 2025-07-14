// --- Data from previous React app, adapted for vanilla JS ---
let accounts = [
    {
        "id": "account-0", "submissionDate": "Jul 11, 2025", "region": "Great Lakes", "wms": "Symmetry", "accountType": "Fixed Variable",
        "customerSolutionType": ["Retail"], "pickingMethods": ["Case Pick", "Each Pick", "Pallet Pick"], "numberOfShifts": "2",
        "foodGrade": true, "hazardousMaterials": false, "internationalShipping": true, "processesReturns": true, "temperatureControlled": false, "usesAutomation": true,
        "customerSLAsText": "Goal\t\nDock to Stock\t98.0%\t\nOn Time Shipping\t98.0%\t\nOrder Accuracy\t99.0%\t\nNet Inventory Accuracy\t99.0%\t\nLocation Inventory Accuracy\t95.0%",
        "transportationConfig": ["LTL Truck Load", "Customer Pickups", "Transportation Management", "Customer Broker"],
        "accountName": "HARIBO OF AMERICA INC.", "building": "Bristol 3",
        "associatedReports": [
            { name: "Target PO Report", path: "", type: "Adjunct", tags: ["Daily", "Critical"] },
            { name: "Employee Performance #", path: "", type: "Excel Refreshable", tags: ["Weekly"] }
        ]
    },
    {
        "id": "account-1", "submissionDate": "Jul 11, 2025", "region": "East", "wms": "Symmetry", "accountType": "Transactional",
        "customerSolutionType": ["Retail", "Dropship"], "pickingMethods": ["Case Pick", "Pallet Pick"], "numberOfShifts": "1",
        "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": true, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "Monday through Friday\nShips Within: Designated pick up date and time pre-scheduled and noted in order ship by date information on the order",
        "transportationConfig": ["LTL Truck Load"],
        "accountName": "Servus Boots", "building": "Englewood 1",
        "associatedReports": []
    },
    {
        "id": "account-2", "submissionDate": "Jul 11, 2025", "region": "Great Lakes", "wms": "Symmetry", "accountType": "Transactional",
        "customerSolutionType": ["ECOMM", "Retail", "DTC"], "pickingMethods": ["Case Pick", "Each Pick", "Pallet Pick", "Layer Pick", "Vas Pick"], "numberOfShifts": "1",
        "foodGrade": true, "hazardousMaterials": false, "internationalShipping": true, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "Dock to Stock\t99.00%\nOn Time Shipping\t95.00%\nOrder Accuracy\t99.50%\nNet Inventory Accuracy\t99.50%\nLocation Inventory Accuracy\t95.00%\nOrder Availability Scheduled Ship Time\t98.00%",
        "transportationConfig": ["LTL Truck Load", "Customer Pickups", "Single Freight Broker", "Transportation Management", "Customer Broker"],
        "accountName": "E&C'S SNACKS, LLC", "building": "Romeoville 2",
        "associatedReports": []
    },
    {
        "id": "account-3", "submissionDate": "Jul 11, 2025", "region": "Great Lakes", "wms": "Symmetry", "accountType": "Transactional",
        "customerSolutionType": ["DTC"], "pickingMethods": ["Case Pick", "Each Pick", "Pallet Pick"], "numberOfShifts": "1",
        "foodGrade": false, "hazardousMaterials": false, "internationalShipping": true, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "Dock to Stock\t99.00%\nOn Time Shipping\t98.00%\nOrder Accuracy\t99.90%\nNet Inventory Accuracy\t99.00%\nLocation Inventory Accuracy\t95.00%",
        "transportationConfig": ["LTL Truck Load", "Customer Pickups", "Single Freight Broker", "Customer Broker"],
        "accountName": "ANDEN -RESEARCH PRODUCTS CORP.", "building": "Romeoville 2",
        "associatedReports": []
    },
    {
        "id": "account-4", "submissionDate": "Jul 11, 2025", "region": "Great Lakes", "wms": "Symmetry", "accountType": "Transactional",
        "customerSolutionType": ["ECOMM", "Retail", "DTC"], "pickingMethods": ["Case Pick", "Each Pick", "Pallet Pick", "Vas Pick"], "numberOfShifts": "1",
        "foodGrade": true, "hazardousMaterials": false, "internationalShipping": true, "processesReturns": true, "temperatureControlled": false, "usesAutomation": true,
        "customerSLAsText": "Dock to Stock\t99.0%\nOn Time Shipping\t98.0%\nOrder Accuracy\t99.9%\nNet Inventory Accuracy\t99.0%\nOrder Availability Scheduled Ship Time\t98.0%",
        "transportationConfig": ["LTL Truck Load", "Customer Pickups", "Single Freight Broker", "Customer Broker"],
        "accountName": "BULLETPROOF 360", "building": "Romeoville 2",
        "associatedReports": []
    },
    {
        "id": "account-5", "submissionDate": "Jul 9, 2025", "region": "West", "wms": "Symmetry", "accountType": "Fixed Variable",
        "customerSolutionType": ["ECOMM", "Retail"], "pickingMethods": ["Case Pick", "Each Pick"], "numberOfShifts": "1",
        "foodGrade": true, "hazardousMaterials": false, "internationalShipping": true, "processesReturns": true, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "On time receiving\nOn time shipping\nOUtbound fill rate\nNet inventory\nAbs Inventory",
        "transportationConfig": ["LTL Truck Load", "Customer Pickups", "Transportation Management"],
        "accountName": "KA'CHAVA", "building": "Redlands 2",
        "associatedReports": []
    },
    {
        "id": "account-6", "submissionDate": "Jul 9, 2025", "region": "West", "wms": "Symmetry", "accountType": "Transactional",
        "customerSolutionType": ["ECOMM", "Retail", "DTC"], "pickingMethods": ["Case Pick", "Each Pick", "Pallet Pick"], "numberOfShifts": "1",
        "foodGrade": false, "hazardousMaterials": false, "internationalShipping": true, "processesReturns": true, "temperatureControlled": false, "usesAutomation": true,
        "customerSLAsText": "Dock2Stock...within 48 hours\nOn time shipping... Within 48 hours\nNet Inventory",
        "transportationConfig": ["LTL Truck Load", "Customer Pickups"],
        "accountName": "ALPHATHETA MUSIC AMERICAS INC.", "building": "Redlands 2",
        "associatedReports": []
    },
    {
        "id": "account-7", "submissionDate": "Jul 9, 2025", "region": "West", "wms": "Korber", "accountType": "Transactional",
        "customerSolutionType": ["Retail"], "pickingMethods": ["Case Pick", "Each Pick"], "numberOfShifts": "3",
        "foodGrade": false, "hazardousMaterials": false, "internationalShipping": true, "processesReturns": true, "temperatureControlled": false, "usesAutomation": true,
        "customerSLAsText": "Dock to Stock- 24 Hours\nOn Time Shipping- 5 Days\nOrder Accuracy- 99.0%\nNet Inventory Accuracy- 99.5%\nAbs Inventory Accuracy-99.0%",
        "transportationConfig": ["LTL Truck Load", "Customer Broker"],
        "accountName": "Elf CA", "building": "Ontario",
        "associatedReports": []
    },
    {
        "id": "account-8", "submissionDate": "Jul 9, 2025", "region": "East", "wms": "Korber", "accountType": "Cost Plus",
        "customerSolutionType": ["ECOMM"], "pickingMethods": ["Each Pick"], "numberOfShifts": "1",
        "foodGrade": true, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": true, "temperatureControlled": false, "usesAutomation": true,
        "customerSLAsText": "Dispatch On-Time / goal 99.5%\nLoad On-Time (Dock to Trailer) / goal 95.0%\nInventory Accuracy / goal 99.5%\nUnload On-Time (Trailer to Dock) / goal 95.0%\nReceiving On-Time (Dock to Stock) / goal 98.5%\nPacking Accuracy / goal 99.0%",
        "transportationConfig": ["LTL Truck Load"],
        "accountName": "Lionstone", "building": "DC11",
        "associatedReports": []
    },
    {
        "id": "account-9", "submissionDate": "Jul 8, 2025", "region": "East", "wms": "Symmetry", "accountType": "Transactional",
        "customerSolutionType": ["Retail"], "pickingMethods": ["Case Pick", "Pallet Pick", "Layer Pick"], "numberOfShifts": "2",
        "foodGrade": true, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": true, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "48 hours dock to stock",
        "transportationConfig": ["LTL Truck Load", "Customer Pickups", "Transportation Management"],
        "accountName": "Beech-Nut", "building": "DC08",
        "associatedReports": []
    },
    {
        "id": "account-10", "submissionDate": "Jul 8, 2025", "region": "Great Lakes", "wms": "Symmetry", "accountType": "Cost Plus",
        "customerSolutionType": ["Retail"], "pickingMethods": ["Case Pick", "Pallet Pick", "Layer Pick"], "numberOfShifts": "1",
        "foodGrade": true, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": true, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "KPI\tMeasurement\tGoal\nDock to Stock\t24 hrs. from truck check in to put away: {(1-(the sum of the number of Pos that didn't make the 24 hr. goal/total number of Pos received in a month}]\t99.5%\nInventory Accuracy\t[{1-(the sum of the absolute variance in dollars/the sum of the total inventory in dollars}] * 100%\t99.0%\nOn-Time Shipment\t[1-sum(the sum of the number of shipments that didn't not ship by ship by date/total number of shipments)] *1005\t99.5%\nOrder Accuracy at Case level\tShipped the correct item and quantity: [{1-(the sum of the number ofcases that were not correct/total number of cases shipped in a month}] * 100%}\t99.5%",
        "transportationConfig": ["LTL Truck Load", "Customer Pickups", "Transportation Management", "Customer Broker"],
        "accountName": "MORTON SALT INC.", "building": "Melrose Park",
        "associatedReports": []
    },
    {
        "id": "account-11", "submissionDate": "Jul 7, 2025", "region": "East", "wms": "Korber", "accountType": "Transactional",
        "customerSolutionType": ["ECOMM", "Retail", "Dropship"], "pickingMethods": ["Case Pick", "Each Pick"], "numberOfShifts": "1",
        "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": true, "temperatureControlled": false, "usesAutomation": true,
        "customerSLAsText": "Ecom/Drop Ships: Same Day prior to noon cutoff\nWholesale: Prior to cancel\nIndependents: 48 hours",
        "transportationConfig": ["LTL Truck Load"],
        "accountName": "Vida", "building": "Englewood 1",
        "associatedReports": []
    },
    {
        "id": "account-12", "submissionDate": "Jul 2, 2025", "region": "East", "wms": "Korber", "accountType": "Cost Plus",
        "customerSolutionType": ["Retail"], "pickingMethods": ["Case Pick", "Each Pick", "Pallet Pick"], "numberOfShifts": "2",
        "foodGrade": true, "hazardousMaterials": false, "internationalShipping": true, "processesReturns": true, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "48 hours.  On Time Shipping 99.85%, Order Accuracy (cases shipped vs cases shipped in error) 99.65%.\n\nInbound 100% Ocean Containers from Asia:  Dock to Stock 99.50% within 48 hours.",
        "transportationConfig": ["LTL Truck Load", "Customer Pickups", "Customer Broker"],
        "accountName": "HANDGARDS INC", "building": "DC07",
        "associatedReports": []
    },
    {
        "id": "account-13", "submissionDate": "Jul 1, 2025", "region": "East", "wms": "Hormel's WMS", "accountType": "Fixed Variable",
        "customerSolutionType": ["Retail"], "pickingMethods": ["Case Pick", "Pallet Pick"], "numberOfShifts": "2",
        "foodGrade": true, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": true, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "Dock to Stock - 97%\nOn Time Shipping - 98%\nInventory Shrinkage Allowance - .0000825 of throughput (cs in + cs out /2)",
        "transportationConfig": ["LTL Truck Load"],
        "accountName": "Hormel", "building": "DC13",
        "associatedReports": []
    },
    {
        "id": "account-14", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "Abbott", "building": "N/A",
        "associatedReports": [
            { name: "Adjustments by Store/Date with cc:S:Accounts\\Abbott Finished Goods\\", path: "", type: "Excel Refreshable", tags: [] },
            { name: "Cycle count Dashboard", path: "", type: "Refreshable", tags: ["Daily"] },
            { name: "Hours by Hour Report", path: "", type: "Refreshable", tags: [] },
            { name: "UB By Location Report", path: "S:\\Accounts. If you can download this", type: "Refreshable", tags: [] },
            { name: "Employee Performance #", path: "", type: "Refreshable", tags: ["Weekly"] },
            { name: "Financial Reporting in the Portal", path: "", type: "Refreshable", tags: ["Monthly"] },
            { name: "Case Headroom for Item Locations", path: "S:\\Accounts\\Abbott Finished Goods\\", type: "Refreshable", tags: [] },
            { name: "Historical by Item_Lot", path: "S:\\Accounts\\Abbott Finished Goods\\", type: "Refreshable", tags: [] },
            { name: "1B3 Productivity", path: "", type: "Refreshable", tags: [] },
            { name: "Health Check", path: "", type: "Refreshable", tags: ["Daily"] },
            { name: "Historical by Locations by Item", path: "S:\\Accounts\\Abbott Finished Goods\\", type: "Refreshable", tags: [] },
            { name: "Symmetry Amazon Orders", path: "", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-15", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "Riceland", "building": "N/A",
        "associatedReports": [
            { name: "Dock to Stock", path: "S:\\Accounts\\Riceland\\Reporting", type: "Refreshable", tags: ["Daily"] },
            { name: "Back to Dock Report", path: "S:\\Accounts\\Riceland\\Reporting", type: "Refreshable", tags: [] },
            { name: "Order Flow Dashboard", path: "S:\\Accounts\\Riceland\\Reporting", type: "Refreshable", tags: ["Critical"] },
            { name: "Abbott Countbacks and 'Query C:S:\\Accounts\\Abbott Finished Goods\\", path: "", type: "Refreshable", tags: [] },
            { name: "1P8 Productivity Report", path: "", type: "Refreshable", tags: [] },
            { name: "Item Master Weight for Pack Weight", path: "", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-16", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "ODW", "building": "N/A",
        "associatedReports": [
            { name: "Packing List Manifest", path: "S:\\Accounts\\Orveon\\Inventory folder", type: "Refreshable", tags: [] },
            { name: "Historical Locations Report", path: "S:\\Accounts\\Orveon\\Inventory folder", type: "Refreshable", tags: [] },
            { name: "Outbound Availability Report", path: "", type: "Refreshable", tags: [] },
            { name: "Inventory Accuracy Report", path: "", type: "Refreshable", tags: ["Critical"] },
            { name: "Variance Reporting - Detailed and Summarized by Item CR", path: "", type: "Refreshable", tags: [] },
            { name: "Bucket to Bucket Moves", path: "", type: "Refreshable", tags: [] },
            { name: "Bucket to Bucket Moves", path: "", type: "Refreshable", tags: [] },
            { name: "Cycle Count Dashboard", path: "", type: "Refreshable", tags: ["Daily"] },
            { name: "Dock Schedule", path: "", type: "Refreshable", tags: [] },
            { name: "Contract Logistics - Transportation Management Dashboard", path: "", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-17", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "Luxury Brands", "building": "N/A",
        "associatedReports": [
            { name: "Packing List Manifest", path: "S:\\Accounts\\Orveon\\Inventory folder", type: "Refreshable", tags: ["Weekly"] }
        ]
    },
    {
        "id": "account-18", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "Orveon", "building": "Romeoville 1 - All Clients in DC",
        "associatedReports": [
            { name: "Export to Bucket Moves", path: "", type: "Refreshable", tags: [] },
            { name: "Bucket to Bucket Moves", path: "", type: "Refreshable", tags: [] },
            { name: "Dock Schedule", path: "", type: "Refreshable", tags: [] },
            { name: "Inventory Reconciliation", path: "", type: "Refreshable", tags: [] },
            { name: "Forward Pick Moves Needed", path: "", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-19", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "Haribo", "building": "N/A",
        "associatedReports": [
            { name: "Target PO Report", path: "", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-20", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "E&C Snacks", "building": "N/A",
        "associatedReports": [
            { name: "Financial Reporting in the Portal", path: "", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-21", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "Great Lakes", "building": "N/A",
        "associatedReports": [
            { name: "Case Headroom for Item Locations", path: "S:\\Accounts\\Abbott Finished Goods\\", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-22", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "Symmetry", "building": "N/A",
        "associatedReports": [
            { name: "Symmetry Amazon Orders", path: "", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-23", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "Korber", "building": "N/A",
        "associatedReports": [
            { name: "OMS Pick Report", path: "", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-24", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "Smart", "building": "N/A",
        "associatedReports": [
            { name: "Item Master Weight for Pack Weight", path: "", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-25", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "3PL Clients", "building": "N/A",
        "associatedReports": [
            { name: "Freight Consolidation", path: "S:\\Accounts\\3PL Clients\\Order Flow DB", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-26", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "Ka'Chava", "building": "N/A",
        "associatedReports": [
            { name: "Cancelled Orders Portal Report", path: "", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-27", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "Hilco", "building": "N/A",
        "associatedReports": [
            { name: "Hilco Open Orders.xlsx", path: "S:\\Accounts\\Hilco Open Orders.xlsx", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-28", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "Premier Nutrition", "building": "N/A",
        "associatedReports": [
            { name: "Abbott schedule 05.17.24.xlsm", path: "S:\\Accounts\\Abbott schedule", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-29", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "Branch Basics", "building": "N/A",
        "associatedReports": [
            { name: "2024 Cycle count Dashboard", path: "", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-30", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "Elf", "building": "N/A",
        "associatedReports": [
            { name: "Flow Dashboard V9", path: "", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-31", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "Premier Nutrition", "building": "N/A",
        "associatedReports": [
            { name: "D920_Snapshot_Aging.xlsx", path: "2020_Snapshot_Aging.xlsx", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-32", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "Dr. Scholls", "building": "N/A",
        "associatedReports": [
            { name: "DOD0101 Inventory Adjustments", path: "", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-33", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "T3 Home", "building": "N/A",
        "associatedReports": [
            { name: "T3 Micro Inventory", path: "", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-34", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "Suave", "building": "N/A",
        "associatedReports": [
            { name: "Cycle Count Dashboard", path: "S:\\Accounts\\Suave\\Reporting\\Inventory", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-35", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "Great Kitchens", "building": "N/A",
        "associatedReports": [
            { name: "Fill rate report", path: "", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-36", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "Hippeas", "building": "N/A",
        "associatedReports": [
            { name: "Order Flow Dashboard", path: "", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-37", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "ODW Logistics", "building": "N/A",
        "associatedReports": [
            { name: "Order Accuracy", path: "", type: "Refreshable", tags: [] }
        ]
    },
    {
        "id": "account-38", "submissionDate": "N/A", "region": "N/A", "wms": "N/A", "accountType": "N/A", "customerSolutionType": [], "pickingMethods": [],
        "numberOfShifts": "N/A", "foodGrade": false, "hazardousMaterials": false, "internationalShipping": false, "processesReturns": false, "temperatureControlled": false, "usesAutomation": false,
        "customerSLAsText": "", "transportationConfig": [], "accountName": "Clipt", "building": "N/A",
        "associatedReports": [
            { name: "WMS Report", path: "", type: "Refreshable", tags: [] }
        ]
    }
];

// --- Global State and Utility Functions ---
let currentFilters = {
    reportMinFitScore: '',
    reportTagSearch: '',
    reportTypeFilter: '',
    reportSortOrder: 'none',
    wms: '',
    accountType: '',
    region: '',
    customerSolutionType: [],
    foodGrade: 'any',
    hazardousMaterials: 'any',
    internationalShipping: 'any',
    processesReturns: 'any',
    temperatureControlled: 'any',
    usesAutomation: 'any',
    groupBy: '',
};
let viewMode = 'accounts'; // 'accounts' or 'reports'

const predefinedSolutionTypes = ['DTC', 'ECOMM', 'Retail', 'Dropship', 'Pallet In/Out', 'B2B', 'B2C'].sort();

// Helper to get unique options for filters dynamically
function getUniqueOptions() {
    const wmsOptions = new Set();
    const accountTypeOptions = new Set();
    const regionOptions = new Set();
    const reportTypeOptions = new Set();

    accounts.forEach(account => {
        if (account.wms) wmsOptions.add(account.wms);
        if (account.accountType) accountTypeOptions.add(account.accountType);
        if (account.region) regionOptions.add(account.region);
        account.associatedReports?.forEach(report => {
            if (report.type) reportTypeOptions.add(report.type);
        });
    });

    return {
        wms: [...wmsOptions].sort(),
        accountType: [...accountTypeOptions].sort(),
        region: [...regionOptions].sort(),
        customerSolutionType: predefinedSolutionTypes, // Use predefined list
        reportType: [...reportTypeOptions].sort(),
    };
}

// --- Helper function to calculate report fit score ---
function calculateReportFitScore(reportName, currentAccountId, allAccounts) {
    let score = 0;
    const currentAccount = allAccounts.find(acc => acc.id === currentAccountId);
    if (!currentAccount) return 0;

    allAccounts.forEach(otherAccount => {
        if (otherAccount.id === currentAccountId) return; // Don't compare with self

        // Check if this other account uses the same report
        const usesSameReport = otherAccount.associatedReports?.some(
            r => r.name === reportName
        );

        if (usesSameReport) {
            let hasSimilarCharacteristic = false;

            // Check for matching region
            if (currentAccount.region && currentAccount.region === otherAccount.region) {
                hasSimilarCharacteristic = true;
            }
            // Check for matching WMS
            if (!hasSimilarCharacteristic && currentAccount.wms && currentAccount.wms === otherAccount.wms) {
                hasSimilarCharacteristic = true;
            }
            // Check for matching accountType
            if (!hasSimilarCharacteristic && currentAccount.accountType && currentAccount.accountType === otherAccount.accountType) {
                hasSimilarCharacteristic = true;
            }
            // Check for overlapping customerSolutionType
            if (!hasSimilarCharacteristic && currentAccount.customerSolutionType && otherAccount.customerSolutionType) {
                if (currentAccount.customerSolutionType.some(type1 =>
                    otherAccount.customerSolutionType.includes(type1)
                )) {
                    hasSimilarCharacteristic = true;
                }
            }
            // Check for overlapping pickingMethods
            if (!hasSimilarCharacteristic && currentAccount.pickingMethods && otherAccount.pickingMethods) {
                if (currentAccount.pickingMethods.some(method1 =>
                    otherAccount.pickingMethods.includes(method1)
                )) {
                    hasSimilarCharacteristic = true;
                }
            }
            // Check for overlapping transportationConfig
            if (!hasSimilarCharacteristic && currentAccount.transportationConfig && otherAccount.transportationConfig) {
                if (currentAccount.transportationConfig.some(config1 =>
                    otherAccount.transportationConfig.includes(config1)
                )) {
                    hasSimilarCharacteristic = true;
                }
            }
            // Check for matching foodGrade
            if (!hasSimilarCharacteristic && currentAccount.foodGrade === true && otherAccount.foodGrade === true) {
                hasSimilarCharacteristic = true;
            }
            // Check for matching hazardousMaterials
            if (!hasSimilarCharacteristic && currentAccount.hazardousMaterials === true && otherAccount.hazardousMaterials === true) {
                hasSimilarCharacteristic = true;
            }
            // Check for matching internationalShipping
            if (!hasSimilarCharacteristic && currentAccount.internationalShipping === true && otherAccount.internationalShipping === true) {
                hasSimilarCharacteristic = true;
            }
            // Check for matching processesReturns
            if (!hasSimilarCharacteristic && currentAccount.processesReturns === true && otherAccount.processesReturns === true) {
                hasSimilarCharacteristic = true;
            }
            // Check for matching temperatureControlled
            if (!hasSimilarCharacteristic && currentAccount.temperatureControlled === true && otherAccount.temperatureControlled === true) {
                hasSimilarCharacteristic = true;
            }
            // Check for matching usesAutomation
            if (!hasSimilarCharacteristic && currentAccount.usesAutomation === true && otherAccount.usesAutomation === true) {
                hasSimilarCharacteristic = true;
            }


            if (hasSimilarCharacteristic) {
                score++;
            }
        }
    });
    return Math.min(5, score); // Cap the score at 5
}

// --- Utility functions for populating select elements ---
function populateSelectOptions(selectId, options, selectedValue) {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) return;
    selectElement.innerHTML = `<option value="">All</option>`;
    options.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        if (selectedValue === optionValue) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    });
}

function populateMultiSelectOptions(selectId, options, selectedValues) {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) return;
    selectElement.innerHTML = ''; // Clear existing options

    options.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        if (selectedValues.includes(optionValue)) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    });
}

// Function to update the active state of boolean filter buttons
function updateBooleanFilterButtons() {
    document.querySelectorAll('[data-filter-name]').forEach(button => {
        const filterName = button.dataset.filterName;
        const filterValue = button.dataset.filterValue;
        if (currentFilters[filterName] === filterValue) {
            button.classList.add('btn-blue');
            button.classList.remove('btn-secondary');
        } else {
            button.classList.remove('btn-blue');
            button.classList.add('btn-secondary');
        }
    });
}

// --- Rendering Functions ---

function renderBoolean(value) {
    return value ? `<span class="text-orange-600 font-bold">✓</span>` : `<span class="text-red-600 font-bold">✗</span>`;
}

function renderReportItem(report, accountId, reportIndex, showAccountName, calculatedFitScore, onRemoveReportCallback, onUpdateReportCallback) {
    const reportHtml = `
        <li class="bg-gray-50 p-3 rounded-md mb-2 border border-gray-200 report-item-card">
            <div class="flex items-center justify-between mb-1">
                <span class="font-medium text-gray-800">${report.name}</span>
                ${onRemoveReportCallback ? `<button class="ml-2 btn-red-outline text-xs font-semibold px-2 py-1" data-action="removeReport" data-account-id="${accountId}" data-report-index="${reportIndex}">Remove</button>` : ''}
            </div>
            ${showAccountName && report.accountName ? `<p class="text-xs text-gray-600 mb-1"><span class="font-semibold">Account:</span> ${report.accountName}</p>` : ''}
            ${report.path ? `<p class="text-xs text-gray-500 italic">Path: ${report.path}</p>` : ''}

            <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                <div>
                    <label for="report-type-${accountId}-${reportIndex}" class="block text-xs font-medium text-gray-600">Type:</label>
                    <input type="text" id="report-type-${accountId}-${reportIndex}" value="${report.type || ''}"
                        class="w-full p-1 border border-gray-300 rounded-md text-xs" placeholder="e.g., Adjunct, Refreshable"
                        data-account-id="${accountId}" data-report-index="${reportIndex}" data-field="type" data-type="text" />
                </div>
                <div>
                    <label for="report-fitscore-${accountId}-${reportIndex}" class="block text-xs font-medium text-gray-600">Fit Score (1-5):</label>
                    <input type="number" id="report-fitscore-${accountId}-${reportIndex}" value="${calculatedFitScore !== undefined ? calculatedFitScore : ''}"
                        class="w-full p-1 border border-gray-300 rounded-md text-xs bg-gray-100 cursor-not-allowed" readonly />
                </div>
                <div>
                    <label for="report-tags-${accountId}-${reportIndex}" class="block text-xs font-medium text-gray-600">Tags (comma-sep):</label>
                    <input type="text" id="report-tags-${accountId}-${reportIndex}" value="${report.tags.join(', ') || ''}"
                        class="w-full p-1 border border-gray-300 rounded-md text-xs" placeholder="e.g., Critical, Daily"
                        data-account-id="${accountId}" data-report-index="${reportIndex}" data-field="tags" data-type="text" />
                </div>
            </div>
        </li>
    `;
    const div = document.createElement('div');
    div.innerHTML = reportHtml;
    return div.firstElementChild;
}


function renderAccountCard(account, onUpdateAccountCallback, onRemoveReportCallback, onUpdateReportCallback, allAccounts) {
    const uniqueOptions = getUniqueOptions(); // Get unique options for select fields

    // Calculate fit scores for all reports in this account
    const reportsWithCalculatedFitScores = (account.associatedReports || []).map(report => ({
        ...report,
        fitScore: calculateReportFitScore(report.name, account.id, allAccounts)
    }));

    // Sort reports based on selected order
    const sortedReports = [...reportsWithCalculatedFitScores].sort((a, b) => {
        const sortOrder = document.querySelector(`select[data-account-id="${account.id}"][data-action="sortReports"]`)?.value || 'none';
        const scoreA = a.fitScore || 0;
        const scoreB = b.fitScore || 0;
        if (sortOrder === 'asc') return scoreA - scoreB;
        if (sortOrder === 'desc') return scoreB - scoreA;
        return 0; // Default order
    });


    const accountHtml = `
        <div class="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200 account-card">
            <h3 class="text-xl font-bold text-gray-900 mb-2">
                <input type="text" name="accountName" value="${account.accountName || ''}" class="font-bold text-gray-900 w-full p-1 border rounded-md" data-account-id="${account.id}" data-field="accountName" data-type="text" />
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                <p>
                    <span class="font-semibold">Region:</span>
                    <input type="text" name="region" value="${account.region || ''}" class="w-full p-1 border rounded-md" data-account-id="${account.id}" data-field="region" data-type="text" />
                </p>
                <p>
                    <span class="font-semibold">Building:</span>
                    <input type="text" name="building" value="${account.building || ''}" class="w-full p-1 border rounded-md" data-account-id="${account.id}" data-field="building" data-type="text" />
                </p>
                <p>
                    <span class="font-semibold">WMS:</span>
                    <input type="text" name="wms" value="${account.wms || ''}" class="w-full p-1 border rounded-md" data-account-id="${account.id}" data-field="wms" data-type="text" />
                </p>
                <p>
                    <span class="font-semibold">Account Type:</span>
                    <input type="text" name="accountType" value="${account.accountType || ''}" class="w-full p-1 border rounded-md" data-account-id="${account.id}" data-field="accountType" data-type="text" />
                </p>
                <p>
                    <span class="font-semibold">Solution Type:</span>
                    <select name="customerSolutionType" multiple class="w-full p-1 border rounded-md h-20" data-account-id="${account.id}" data-field="customerSolutionType" data-type="multiselect">
                        ${uniqueOptions.customerSolutionType.map(option => `<option value="${option}" ${account.customerSolutionType?.includes(option) ? 'selected' : ''}>${option}</option>`).join('')}
                    </select>
                </p>
                <p>
                    <span class="font-semibold">Picking Methods:</span> ${account.pickingMethods?.join(', ') || 'N/A'}
                </p>
                <p>
                    <span class="font-semibold">Shifts:</span>
                    <input type="number" name="numberOfShifts" value="${account.numberOfShifts || ''}" class="w-full p-1 border rounded-md" data-account-id="${account.id}" data-field="numberOfShifts" data-type="number" />
                </p>

                <div class="col-span-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-2">
                    <label class="flex items-center space-x-2 text-sm text-gray-700">
                        <input type="checkbox" name="foodGrade" ${account.foodGrade ? 'checked' : ''} class="rounded text-indigo-600 focus:ring-indigo-500" data-account-id="${account.id}" data-field="foodGrade" data-type="checkbox" />
                        <span>Food Grade</span>
                    </label>
                    <label class="flex items-center space-x-2 text-sm text-gray-700">
                        <input type="checkbox" name="hazardousMaterials" ${account.hazardousMaterials ? 'checked' : ''} class="rounded text-indigo-600 focus:ring-indigo-500" data-account-id="${account.id}" data-field="hazardousMaterials" data-type="checkbox" />
                        <span>Hazardous Materials</span>
                    </label>
                    <label class="flex items-center space-x-2 text-sm text-gray-700">
                        <input type="checkbox" name="internationalShipping" ${account.internationalShipping ? 'checked' : ''} class="rounded text-indigo-600 focus:ring-indigo-500" data-account-id="${account.id}" data-field="internationalShipping" data-type="checkbox" />
                        <span>International Shipping</span>
                    </label>
                    <label class="flex items-center space-x-2 text-sm text-gray-700">
                        <input type="checkbox" name="processesReturns" ${account.processesReturns ? 'checked' : ''} class="rounded text-indigo-600 focus:ring-indigo-500" data-account-id="${account.id}" data-field="processesReturns" data-type="checkbox" />
                        <span>Processes Returns</span>
                    </label>
                    <label class="flex items-center space-x-2 text-sm text-gray-700">
                        <input type="checkbox" name="temperatureControlled" ${account.temperatureControlled ? 'checked' : ''} class="rounded text-indigo-600 focus:ring-indigo-500" data-account-id="${account.id}" data-field="temperatureControlled" data-type="checkbox" />
                        <span>Temp. Controlled</span>
                    </label>
                    <label class="flex items-center space-x-2 text-sm text-gray-700">
                        <input type="checkbox" name="usesAutomation" ${account.usesAutomation ? 'checked' : ''} class="rounded text-indigo-600 focus:ring-indigo-500" data-account-id="${account.id}" data-field="usesAutomation" data-type="checkbox" />
                        <span>Uses Automation</span>
                    </label>
                </div>
            </div>

            <div class="mt-3 text-sm text-gray-600">
                <p class="font-semibold">Customer SLAs:</p>
                <textarea name="customerSLAsText" class="w-full p-1 border rounded-md resize-y" rows="3" data-account-id="${account.id}" data-field="customerSLAsText" data-type="textarea">${account.customerSLAsText || ''}</textarea>
            </div>
            <div class="mt-3 text-sm text-gray-600">
                <p class="font-semibold">Transportation Config (comma-sep):</p>
                <textarea name="transportationConfig" class="w-full p-1 border rounded-md resize-y" rows="2" data-account-id="${account.id}" data-field="transportationConfig" data-type="textarea-csv">${account.transportationConfig?.join(', ') || ''}</textarea>
            </div>

            <div class="mt-4">
                <div class="flex justify-between items-center mb-2">
                    <p class="font-semibold text-gray-700">Associated Reports:</p>
                    <select class="text-xs p-1 border rounded-md" data-account-id="${account.id}" data-action="sortReports">
                        <option value="none">Sort by: Default</option>
                        <option value="desc">Sort by: Fit Score (High to Low)</option>
                        <option value="asc">Sort by: Fit Score (Low to High)</option>
                    </select>
                </div>
                <ul class="list-none pl-0" data-reports-list="${account.id}">
                    </ul>
            </div>
        </div>
    `;
    const div = document.createElement('div');
    div.innerHTML = accountHtml;
    return div.firstElementChild;
}

function renderContent() {
    const contentDisplay = document.getElementById('contentDisplay');
    contentDisplay.innerHTML = ''; // Clear previous content

    const uniqueOptions = getUniqueOptions(); // Refresh options for filters

    // Update filter dropdowns
    populateSelectOptions('filterRegion', uniqueOptions.region, currentFilters.region);
    populateSelectOptions('filterWMS', uniqueOptions.wms, currentFilters.wms);
    populateSelectOptions('filterAccountType', uniqueOptions.accountType, currentFilters.accountType);
    populateMultiSelectOptions('filterCustomerSolutionType', uniqueOptions.customerSolutionType, currentFilters.customerSolutionType);
    populateSelectOptions('filterReportType', uniqueOptions.reportType, currentFilters.reportTypeFilter);

    // Update Add New Report Account dropdown
    const selectAccountForReport = document.getElementById('selectAccountForReport');
    selectAccountForReport.innerHTML = '<option value="">-- Select an Account --</option>';
    accounts.forEach(account => {
        const option = document.createElement('option');
        option.value = account.id;
        option.textContent = account.accountName;
        selectAccountForReport.appendChild(option);
    });


    let filteredAccounts = accounts.filter(account => {
        // Account-level filters
        if (currentFilters.wms && account.wms && account.wms !== currentFilters.wms) return false;
        if (currentFilters.accountType && account.accountType && account.accountType !== currentFilters.accountType) return false;
        if (currentFilters.region && account.region && account.region !== currentFilters.region) return false;

        // Customer Solution Type Filter (multi-select)
        if (currentFilters.customerSolutionType.length > 0) {
            const selectedSolutionTypes = currentFilters.customerSolutionType;
            if (!account.customerSolutionType || !selectedSolutionTypes.some(s => account.customerSolutionType.includes(s))) {
                return false;
            }
        }

        // Boolean Filters
        const booleanFields = [
            "foodGrade", "hazardousMaterials", "internationalShipping",
            "processesReturns", "temperatureControlled", "usesAutomation"
        ];
        for (const field of booleanFields) {
            if (currentFilters[field] !== 'any') {
                const filterValue = currentFilters[field] === 'yes';
                if (account[field] !== filterValue) {
                    return false;
                }
            }
        }

        // Report-level filters applied to accounts: An account passes if *any* of its reports match the report filters
        const isReportFilterActive = currentFilters.reportMinFitScore !== '' || currentFilters.reportTagSearch !== '' || currentFilters.reportTypeFilter !== '';
        if (isReportFilterActive) {
            const hasMatchingReport = account.associatedReports?.some(report => {
                const calculatedFitScore = calculateReportFitScore(report.name, account.id, accounts);

                if (currentFilters.reportMinFitScore !== '' && (calculatedFitScore === null || calculatedFitScore < parseInt(currentFilters.reportMinFitScore, 10))) {
                    return false;
                }
                if (currentFilters.reportTagSearch) {
                    const searchTags = currentFilters.reportTagSearch.toLowerCase().split(',').map(tag => tag.trim()).filter(tag => tag !== '');
                    const reportTags = report.tags?.map(tag => tag.toLowerCase()) || [];
                    if (!searchTags.some(sTag => reportTags.includes(sTag))) {
                        return false;
                    }
                }
                if (currentFilters.reportTypeFilter && report.type !== currentFilters.reportTypeFilter) {
                    return false;
                }
                return true;
            });
            if (!hasMatchingReport) {
                return false;
            }
        }
        return true;
    });

    if (viewMode === 'accounts') {
        document.getElementById('accountFiltersContainer').style.display = 'contents';
        document.getElementById('groupByContainer').style.display = 'block';
        document.getElementById('reportSortContainer').style.display = 'none';

        let groupedAccounts = {};
        if (!currentFilters.groupBy) {
            groupedAccounts['All Accounts'] = filteredAccounts;
        } else {
            filteredAccounts.forEach(account => {
                let groupKey = account[currentFilters.groupBy];
                if (Array.isArray(groupKey)) {
                    groupKey = groupKey.join(', ') || 'Uncategorized';
                } else if (!groupKey) {
                    groupKey = 'Uncategorized';
                }
                if (!groupedAccounts[groupKey]) {
                    groupedAccounts[groupKey] = [];
                }
                groupedAccounts[groupKey].push(account);
            });
        }

        if (Object.keys(groupedAccounts).length > 0) {
            for (const groupName in groupedAccounts) {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'mb-8';
                groupDiv.innerHTML = `
                    <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                        ${currentFilters.groupBy ? `${currentFilters.groupBy}: ` : ''}${groupName} (${groupedAccounts[groupName].length} Accounts)
                    </h2>
                    <div class="grid grid-cols-1 gap-6" data-group-content></div>
                `;
                const groupContent = groupDiv.querySelector('[data-group-content]');
                groupedAccounts[groupName].forEach(account => {
                    groupContent.appendChild(renderAccountCard(account, updateAccount, removeReport, updateReport, accounts));
                });
                contentDisplay.appendChild(groupDiv);
            }
        } else {
            contentDisplay.innerHTML = `<p class="text-center text-gray-600 text-lg">No accounts match your current filters.</p>`;
        }

    } else { // viewMode === 'reports'
        document.getElementById('accountFiltersContainer').style.display = 'none';
        document.getElementById('groupByContainer').style.display = 'none';
        document.getElementById('reportSortContainer').style.display = 'block';

        let allReportsFlat = [];
        accounts.forEach(account => {
            account.associatedReports?.forEach((report, index) => {
                allReportsFlat.push({
                    ...report,
                    accountId: account.id,
                    reportIndex: index,
                    accountName: account.accountName,
                    fitScore: calculateReportFitScore(report.name, account.id, accounts)
                });
            });
        });

        let filteredReportsForView = allReportsFlat.filter(report => {
            if (currentFilters.reportMinFitScore !== '' && (report.fitScore === null || report.fitScore < parseInt(currentFilters.reportMinFitScore, 10))) {
                return false;
            }
            if (currentFilters.reportTagSearch) {
                const searchTags = currentFilters.reportTagSearch.toLowerCase().split(',').map(tag => tag.trim()).filter(tag => tag !== '');
                const reportTags = report.tags?.map(tag => tag.toLowerCase()) || [];
                if (!searchTags.some(sTag => reportTags.includes(sTag))) {
                    return false;
                }
            }
            if (currentFilters.reportTypeFilter && report.type !== currentFilters.reportTypeFilter) {
                return false;
            }
            return true;
        });

        if (currentFilters.reportSortOrder === 'asc') {
            filteredReportsForView.sort((a, b) => (a.fitScore || 0) - (b.fitScore || 0));
        } else if (currentFilters.reportSortOrder === 'desc') {
            filteredReportsForView.sort((a, b) => (b.fitScore || 0) - (a.fitScore || 0));
        }

        if (filteredReportsForView.length > 0) {
            const reportsViewDiv = document.createElement('div');
            reportsViewDiv.className = 'mb-8';
            reportsViewDiv.innerHTML = `
                <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                    All Reports (${filteredReportsForView.length})
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="allReportsList"></div>
            `;
            const allReportsList = reportsViewDiv.querySelector('#allReportsList');
            filteredReportsForView.forEach(report => {
                allReportsList.appendChild(renderReportItem(report, report.accountId, report.reportIndex, true, report.fitScore, removeReport, updateReport));
            });
            contentDisplay.appendChild(reportsViewDiv);
        } else {
            contentDisplay.innerHTML = `<p class="text-center text-gray-600 text-lg">No reports match your current filters.</p>`;
        }
    }
    updateBooleanFilterButtons(); // Ensure boolean filter buttons reflect current state
}

// --- State Update Handlers (mimicking React state updates) ---
function updateAccounts(newAccounts) {
    accounts = newAccounts;
    renderContent();
}

function updateAccount(id, updatedFields) {
    const newAccounts = accounts.map(account =>
        account.id === id ? { ...account, ...updatedFields } : account
    );
    updateAccounts(newAccounts);
}

function updateReport(accountId, reportIndex, updatedFields) {
    const newAccounts = accounts.map(account => {
        if (account.id === accountId) {
            const updatedReports = account.associatedReports.map((report, idx) =>
                idx === reportIndex ? { ...report, ...updatedFields } : report
            );
            return { ...account, associatedReports: updatedReports };
        }
        return account;
    });
    updateAccounts(newAccounts);
}

function removeReport(accountId, reportIndex) {
    const newAccounts = accounts.map(account => {
        if (account.id === accountId) {
            const updatedReports = account.associatedReports.filter(
                (_, idx) => idx !== reportIndex
            );
            return { ...account, associatedReports: updatedReports };
        }
        return account;
    });
    updateAccounts(newAccounts);
}

// --- Event Listeners and Initial Render ---
// Global state for section visibility
let showAddAccountsSection = true;
let showAddReportsSection = true;
let showFiltersSection = true;

document.addEventListener('DOMContentLoaded', () => {
    // Initial render
    renderContent();

    // View Mode Toggles
    document.getElementById('viewAccountsBtn').addEventListener('click', () => {
        viewMode = 'accounts';
        document.getElementById('viewAccountsBtn').classList.add('btn-primary');
        document.getElementById('viewAccountsBtn').classList.remove('btn-secondary');
        document.getElementById('viewReportsBtn').classList.add('btn-secondary');
        document.getElementById('viewReportsBtn').classList.remove('btn-primary');
        renderContent();
    });
    document.getElementById('viewReportsBtn').addEventListener('click', () => {
        viewMode = 'reports';
        document.getElementById('viewReportsBtn').classList.add('btn-primary');
        document.getElementById('viewReportsBtn').classList.remove('btn-secondary');
        document.getElementById('viewAccountsBtn').classList.add('btn-secondary');
        document.getElementById('viewAccountsBtn').classList.remove('btn-primary');
        renderContent();
    });

    // Section Toggles
    document.getElementById('toggleAddAccounts').addEventListener('click', () => {
        const content = document.getElementById('addAccountsContent');
        showAddAccountsSection = !showAddAccountsSection;
        content.style.display = showAddAccountsSection ? 'block' : 'none';
        document.getElementById('toggleAddAccounts').classList.toggle('expanded', showAddAccountsSection);
    });
    document.getElementById('toggleAddReports').addEventListener('click', () => {
        const content = document.getElementById('addReportsContent');
        showAddReportsSection = !showAddReportsSection;
        content.style.display = showAddReportsSection ? 'block' : 'none';
        document.getElementById('toggleAddReports').classList.toggle('expanded', showAddReportsSection);
    });
    document.getElementById('toggleFilters').addEventListener('click', () => {
        const content = document.getElementById('filtersContent');
        showFiltersSection = !showFiltersSection;
        content.style.display = showFiltersSection ? 'block' : 'none';
        document.getElementById('toggleFilters').classList.toggle('expanded', showFiltersSection);
    });

    // Manual Add Account
    document.getElementById('addNewAccountBtn').addEventListener('click', () => {
        const newId = `account-${accounts.length + 1}`;
        const newAccount = {
            id: newId,
            submissionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            accountName: document.getElementById('newAccountName').value,
            region: document.getElementById('newAccountRegion').value,
            wms: document.getElementById('newAccountWMS').value,
            accountType: document.getElementById('newAccountType').value,
            customerSolutionType: document.getElementById('newCustomerSolutionType').value.split(',').map(s => s.trim()).filter(s => s),
            building: document.getElementById('newAccountBuilding').value,
            numberOfShifts: document.getElementById('newNumberOfShifts').value,
            foodGrade: document.getElementById('newFoodGrade').checked,
            hazardousMaterials: document.getElementById('newHazardousMaterials').checked,
            internationalShipping: document.getElementById('newInternationalShipping').checked,
            processesReturns: document.getElementById('newProcessesReturns').checked,
            temperatureControlled: document.getElementById('newTemperatureControlled').checked,
            usesAutomation: document.getElementById('newUsesAutomation').checked,
            customerSLAsText: document.getElementById('newCustomerSLAsText').value,
            transportationConfig: document.getElementById('newTransportationConfig').value.split(',').map(s => s.trim()).filter(s => s),
            pickingMethods: [],
            associatedReports: [],
        };
        accounts.push(newAccount);
        renderContent();
        // Clear form
        document.getElementById('newAccountName').value = '';
        document.getElementById('newAccountRegion').value = '';
        document.getElementById('newAccountWMS').value = '';
        document.getElementById('newAccountType').value = '';
        document.getElementById('newCustomerSolutionType').value = '';
        document.getElementById('newAccountBuilding').value = '';
        document.getElementById('newNumberOfShifts').value = '';
        document.getElementById('newFoodGrade').checked = false;
        document.getElementById('newHazardousMaterials').checked = false;
        document.getElementById('newInternationalShipping').checked = false;
        document.getElementById('newProcessesReturns').checked = false;
        document.getElementById('newTemperatureControlled').checked = false;
        document.getElementById('newUsesAutomation').checked = false;
        document.getElementById('newCustomerSLAsText').value = '';
        document.getElementById('newTransportationConfig').value = '';
    });

    // Manual Add Report
    document.getElementById('addNewReportBtn').addEventListener('click', () => {
        const accountId = document.getElementById('selectAccountForReport').value;
        const reportName = document.getElementById('newReportName').value;
        const reportPath = document.getElementById('newReportPath').value;
        const reportType = document.getElementById('newReportType').value;
        const reportTags = document.getElementById('newReportTags').value;

        if (accountId && reportName.trim()) {
            const newReport = {
                name: reportName.trim(),
                path: reportPath.trim(),
                type: reportType.trim(),
                tags: reportTags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
            };
            const account = accounts.find(acc => acc.id === accountId);
            if (account) {
                account.associatedReports.push(newReport);
                renderContent();
                // Clear form
                document.getElementById('selectAccountForReport').value = '';
                document.getElementById('newReportName').value = '';
                document.getElementById('newReportPath').value = '';
                document.getElementById('newReportType').value = '';
                document.getElementById('newReportTags').value = '';
            } else {
                console.warn("Selected account not found.");
            }
        } else {
            console.warn("Please select an account and enter a report name.");
        }
    });

    // CSV Upload for Accounts
    document.getElementById('accountCsvUpload').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const lines = text.split('\n').filter(line => line.trim() !== '');
            if (lines.length < 2) {
                console.error("CSV file is empty or malformed.");
                return;
            }

            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            const newAccounts = [];

            const csvHeaderMap = {
                "Submission Date": "submissionDate",
                "Select the Region of the Account:": "region",
                "What WMS does this account use?": "wms",
                "Account Type?": "accountType",
                "Customer Solution Type?": "customerSolutionType",
                "Picking Methods?": "pickingMethods",
                "Number of Shifts": "numberOfShifts",
                "Does this account handle food-grade products or require food-grade compliance (e.g., sanitation standards, temperature control, FDA regulations)?": "foodGrade",
                "Does this account store hazardous materials?": "hazardousMaterials",
                "Does this account ship or receive internationally?": "internationalShipping",
                "Does this account process returns?": "processesReturns",
                "Does this account use temperature-controlled space?": "temperatureControlled",
                "Does this account use automation (e.g. conveyor system, robotics)?": "usesAutomation",
                "Please enter your customer SLAs and their required metric": "customerSLAsText",
                "Transportation Configuration": "transportationConfig",
            };

            const buildingAccountColumns = [
                "Select the Account in the Building Ontario", "Select the Account in the Building Ontario 2",
                "Select the Account in the Building Redlands 1", "Select the Account in the Building Redlands 1 Overflow",
                "Select the Account in the Building Redlands 2", "Select the Account in the Building Bristol 3",
                "Select the Account in the Building Bristol Buffer", "Select the Account in the Building Melrose Park",
                "Select the Account in the Building Romeoville 1", "Select the Account in the Building Romeoville 2",
                "Select the Account in the Building Waukesha", "Select the Account in the Building DC01:",
                "Select the Account in the Building DC02:", "Select the Account in the Building DC03:",
                "Select the Account in the Building DC04:", "Select the Account in the Building DC05:",
                "Select the Account in the Building DC06:", "Select the Account in the Building DC07:",
                "Select the Account in the Building DC08:", "Select the Account in the Building DC10:",
                "Select the Account in the Building DC11:", "Select the Account in the Building DC12:",
                "Select the Account in the Building DC13:", "Select the Account in the Building DC14:",
                "Select the Account in the Building DC15:", "Select the Account in the Building Dist-Trans:",
                "Select the Account in the Building Englewood 1:", "Select the Account in the Building Hamilton:",
                "Select the Account in the Building Jackson:", "Select the Account in the Building Lockbourne 1:",
                "Select the Account in the Building Lockbourne 3:", "Select the Account in the Building McDonough:",
                "Select the Account in the Building Memphis:", "Select the Account in the Building Rickenbacker:",
                "Select the Account in the Building Rickenbacker 1:",
            ];

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/"/g, ''));
                const account = { id: `account-${accounts.length + newAccounts.length + i}`, associatedReports: [] };

                let foundAccountName = '';
                let foundBuilding = '';

                headers.forEach((header, index) => {
                    const key = csvHeaderMap[header];
                    const value = values[index] || '';

                    if (buildingAccountColumns.includes(header) && value) {
                        foundAccountName = value;
                        const match = header.match(/Building (.+):?$/);
                        if (match && match[1]) {
                            foundBuilding = match[1].replace('Select the Account in the ', '').trim();
                        } else {
                            foundBuilding = value;
                        }
                    } else if (key) {
                        if (['customerSolutionType', 'pickingMethods', 'transportationConfig'].includes(key)) {
                            account[key] = value.split(/[\n,]/).map(s => s.trim()).filter(s => s);
                        } else if (['foodGrade', 'hazardousMaterials', 'internationalShipping', 'processesReturns', 'temperatureControlled', 'usesAutomation'].includes(key)) {
                            account[key] = value.toLowerCase() === 'yes';
                        } else {
                            account[key] = value;
                        }
                    }
                });
                account.accountName = foundAccountName;
                account.building = foundBuilding;
                newAccounts.push(account);
            }
            accounts.push(...newAccounts);
            renderContent();
            event.target.value = null; // Clear the file input
        };
        reader.readAsText(file);
    });

    // CSV Upload for Reports
    document.getElementById('reportCsvUpload').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const lines = text.split('\n').filter(line => line.trim() !== '');
            if (lines.length < 2) {
                console.error("Report CSV file is empty or malformed.");
                return;
            }

            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            const reportsToAdd = [];

            const reportCsvHeaderMap = {
                "Account ID": "accountId",
                "Report Name": "name",
                "Report Path": "path",
                "Report Type": "type",
                "Tags": "tags",
            };

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/"/g, ''));
                const reportData = {};

                headers.forEach((header, index) => {
                    const key = reportCsvHeaderMap[header];
                    if (key) {
                        let value = values[index] || '';
                        if (key === 'tags') {
                            reportData[key] = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
                        } else {
                            reportData[key] = value;
                        }
                    }
                });

                if (reportData.accountId && reportData.name) {
                    reportsToAdd.push(reportData);
                } else {
                    console.warn(`Skipping report row ${i + 1} due to missing Account ID or Report Name:`, values);
                }
            }

            const updatedAccounts = accounts.map(account => {
                const newReportsForAccount = reportsToAdd.filter(
                    report => report.accountId === account.id
                );
                if (newReportsForAccount.length > 0) {
                    return {
                        ...account,
                        associatedReports: [...(account.associatedReports || []), ...newReportsForAccount],
                    };
                }
                return account;
            });

            reportsToAdd.forEach(report => {
                if (!updatedAccounts.some(acc => acc.id === report.accountId)) {
                    console.warn(`Report for unknown Account ID '${report.accountId}' was skipped:`, report);
                }
            });
            accounts = updatedAccounts; // Update global accounts array
            renderContent();
            event.target.value = null; // Clear the file input
        };
        reader.readAsText(file);
    });

    // Filter controls event listeners
    document.getElementById('filterReportMinFitScore').addEventListener('input', (e) => { currentFilters.reportMinFitScore = e.target.value; renderContent(); });
    document.getElementById('filterReportTagSearch').addEventListener('input', (e) => { currentFilters.reportTagSearch = e.target.value; renderContent(); });
    document.getElementById('filterReportType').addEventListener('change', (e) => { currentFilters.reportTypeFilter = e.target.value; renderContent(); });
    document.getElementById('filterRegion').addEventListener('change', (e) => { currentFilters.region = e.target.value; renderContent(); });
    document.getElementById('filterWMS').addEventListener('change', (e) => { currentFilters.wms = e.target.value; renderContent(); });
    document.getElementById('filterAccountType').addEventListener('change', (e) => { currentFilters.accountType = e.target.value; renderContent(); });
    document.getElementById('filterCustomerSolutionType').addEventListener('change', (e) => {
        currentFilters.customerSolutionType = Array.from(e.target.selectedOptions).map(option => option.value);
        renderContent();
    });
    document.getElementById('groupBy').addEventListener('change', (e) => { currentFilters.groupBy = e.target.value; renderContent(); });
    document.getElementById('reportSortOrder').addEventListener('change', (e) => { currentFilters.reportSortOrder = e.target.value; renderContent(); });

    // Boolean filter buttons
    document.querySelectorAll('[data-filter-name]').forEach(button => {
        button.addEventListener('click', (e) => {
            const filterName = e.target.dataset.filterName;
            const filterValue = e.target.dataset.filterValue;
            currentFilters[filterName] = filterValue;
            renderContent();
        });
    });
});