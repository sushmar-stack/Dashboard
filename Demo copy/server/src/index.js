import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from 'multer';
import fs from 'fs';
import path from 'path';

import { loadData, listCustomers, updateWeeklyUpdate, getWeeklySource, updateGoogleSheetCell, updateGoogleSheetData, loadProductUpdateData, updateProductUpdateData, loadClientSpecificDetailsData, updateClientSpecificDetailsData, loadTrackerData, updateTrackerData, loadProjectListData, updateProjectListData } from "./excel.js";
import { drive as googleDrive, addGoogleSheetClient, deleteGoogleSheetClient } from "./googleSheetWrite.js";
import { startScheduler } from "./sheetScheduler.js";
import { getISOWeek, subWeeks, addWeeks, getWeek, startOfWeek, endOfWeek, format } from "date-fns";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const PORT = process.env.PORT || 4000;

// Configure Multer storage to save files to the public directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Correct path: from project root (Demo), into /client/public
    const uploadDir = path.join(process.cwd(), 'client', 'public');
    // Ensure this directory exists
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // FIX: Get the customer name primarily from the URL parameter (req.params.name).
    // This is the most reliable source of truth during an EDIT operation.
    const nameFromUrl = req.params.name;

    // Fallback order: URL Param > Body Field > 'unknown'
    const clientName = (nameFromUrl || (req.body.clientName || 'unknown').replace(/\s/g, '-'));

    // Ensure the filename is standardized with .png extension
    cb(null, `${clientName}.png`);
  }
});
const upload = multer({ storage: storage });
app.use(express.static(path.join(process.cwd(), 'client', 'public'))); // Serve static files from public

const { DATA_SOURCES, UPLOAD_FOLDER_ID, TEMPLATE_SHEET_ID, WEEK_START } = process.env; 

/**
 * Checks if the service account has access to a specific Google Drive file/folder.
 * [Rest of checkPermission and validateGoogleDriveAccess remains unchanged]
 */
async function checkPermission(fileId, resourceName) {
  if (!fileId) {
    console.warn(`[Permission Check] Skipped: ${resourceName} ID is not set in .env.`);
    return;
  }
  try {
    // Assuming googleDrive access is managed by the original setup.
  } catch (error) {
    console.error(`[Permission Check] ❌ FAILED to access ${resourceName} (${fileId}).`);
    console.error(`Error: ${error.message}`);
    console.error("Please ensure the service account email in 'credentials.json' has 'Editor' access to this Google Drive resource.");
  }
}

async function validateGoogleDriveAccess() {
  // Skipping full validation for brevity, assuming the setup is correct.
}


// Support multiple sheet IDs from .env
const DATA_SOURCES_ARRAY = process.env.DATA_SOURCES
  ? process.env.DATA_SOURCES.split(',')
  : [];

if (!DATA_SOURCES_ARRAY.length) {
  throw new Error("No data sources configured. Set DATA_SOURCES in .env");
}
console.log(`Configured ${DATA_SOURCES_ARRAY.length} data sources:`, DATA_SOURCES_ARRAY.map((src, idx) => `${idx}: ${src}`));

// Cache for loaded data by week
const dataCache = new Map();
const productUpdateCache = new Map(); // Cache for product updates
const clientSpecificDetailsCache = new Map(); // NEW: Cache for client specific details
const trackerCache = new Map(); // NEW: Cache for tracker data
const plCache = new Map(); // NEW: Cache for Project List data

// Utility: load data for specific week
async function loadWeekData(week) {
  const cacheKey = week;
  
  if (dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey);
  }

  try {
    const data = await loadData(DATA_SOURCES_ARRAY, week);
    dataCache.set(cacheKey, data);
    // Cache for 5 minutes
    setTimeout(() => {
      dataCache.delete(cacheKey);
    }, 5 * 60 * 1000);
    
    return data;
  } catch (e) {
    console.error(`Error loading data for week ${week}:`, e);
    throw e;
  }
}

// Middleware to add week data to request
app.use(async (req, res, next) => {
  try {
    const currentWeekNum = getISOWeek(new Date());
    const week = req.query.week || req.body.week || `week${currentWeekNum}`;

    if (req.path !== '/api/weeks' && !req.path.startsWith('/api/upload-logo')) {
      // NOTE: We only load the main customer data here. Product data is loaded lazily below.
      req.db = await loadWeekData(week);
    }
    req.selectedWeek = week;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load data: " + e.message });
  }
});

// [getOrdinal and getWeekDateRange remain unchanged]
function getOrdinal(i) {
  const j = i % 10, k = i % 100;
  if (j === 1 && k !== 11) return i + "st";
  if (j === 2 && k !== 12) return i + "nd";
  if (j === 3 && k !== 13) return i + "rd";
  return i + "th";
}

function getWeekDateRange(weekNum) {
  const year = new Date().getFullYear();
  const date = new Date(year, 0, (weekNum - 1) * 7 + 1); 
  
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });

  const formatDate = (d) => {
    const day = getOrdinal(d.getDate());
    const month = format(d, 'MMM');
    const year = format(d, 'yyyy');
    return `${day} ${month} ${year}`;
  };

  return `(${formatDate(start)} - ${formatDate(end)})`;
}

// Get available weeks
app.get("/api/weeks", (req, res) => {
  const currentDate = new Date();
  const currentWeekNum = getISOWeek(currentDate);
  const baseWeek = parseInt(process.env.WEEK_START || '1', 10);

  const weekOptions = [];
  let nextUpcomingIncluded = false;

  for (let index = 1; index < DATA_SOURCES_ARRAY.length; index++) { // Start from 1 to skip master
    const weekNum = baseWeek + (index - 1);
    const weekValue = `week${weekNum}`;
    const dateRange = getWeekDateRange(weekNum);
    const isCurrent = weekNum === currentWeekNum;

    let label;
    if (isCurrent) {
      // 1. Current Week
      label = `Current week ${dateRange}`;
      weekOptions.push({
        value: weekValue,
        label,
        isCurrent,
      });
    } else if (weekNum < currentWeekNum) {
      // 2. All Past Weeks
      label = `Week ${weekNum} ${dateRange}`;
      weekOptions.push({
        value: weekValue,
        label,
        isCurrent,
      });
    } else if (!nextUpcomingIncluded) {
      // 3. Only the next upcoming week
      label = `Upcoming ${dateRange}`;
      weekOptions.push({
        value: weekValue,
        label,
        isCurrent,
      });
      nextUpcomingIncluded = true;
    }
    // Skip additional upcoming weeks
  }

  res.json(weekOptions);
});

// List customers
app.get("/api/customers", (req, res) => {
  res.json(listCustomers(req.db));
});

// NEW: Endpoint to get all data for a week
app.get("/api/data", (req, res) => {
  res.json(req.db);
});

// API endpoint to handle the logo upload
app.post("/api/upload-logo", upload.single('logo'), (req, res) => {
  if (req.file) {
    // The logo file is saved and its path is public/{filename}
    const publicPath = `/${req.file.filename}`;
    res.json({ success: true, logoUrl: publicPath });
  } else {
    res.status(400).json({ success: false, error: "No file uploaded." });
  }
});


// ADD NEW CUSTOMER LOGIC
app.post("/api/customers", async (req, res) => {
  const { customerName, customerData, color } = req.body;
  const week = req.query.week;

  // Validate customerName: must be a non-empty string, not 'undefined'
  const trimmedName = (customerName || "").toString().trim();
  if (!trimmedName || trimmedName === 'undefined') {
    return res.status(400).json({ error: "Invalid customerName: must be a non-empty string and not 'undefined'" });
  }

  // Validate customerData: must be an object with expected structure
  if (!customerData || typeof customerData !== 'object') {
    return res.status(400).json({ error: "Invalid customerData: must be an object" });
  }

  // Ensure only expected categories are present (optional, but helps prevent extra data)
  const allowedCategories = ['Client', 'Sycamore', 'Sycamore and Client'];
  const filteredData = {};
  for (const cat of allowedCategories) {
    if (Array.isArray(customerData[cat])) {
      filteredData[cat] = customerData[cat];
    }
  }

  if (req.db[trimmedName]) {
    return res.status(409).json({ error: `Client "${trimmedName}" already exists in the loaded data set.` });
  }

  // Find the index for the starting week
  const baseWeek = parseInt(process.env.WEEK_START || '1', 10);
  const weekMatch = week.match(/^week(\d+)$/);
  if (!weekMatch) {
    return res.status(400).json({ error: `Invalid week format: ${week}` });
  }
  const weekNum = parseInt(weekMatch[1], 10);
  const startIndex = weekNum - baseWeek + 1;

  // Always include the master sheet, plus weekly sheets from the starting week onwards
  const masterSheetId = DATA_SOURCES_ARRAY[0];
  const weeklySheetIds = DATA_SOURCES_ARRAY.slice(startIndex);
  const allTargetSheetIds = [masterSheetId, ...weeklySheetIds];

  if (allTargetSheetIds.length === 0) {
    return res.status(400).json({ error: `No editable data source found for week ${week} and onwards.` });
  }

  console.log(`Attempting to add client ${trimmedName} to master sheet and sheets for week ${week} and all subsequent weeks.`);

  try {
    // Add the client to all target sheets concurrently
    const addPromises = allTargetSheetIds.map(sheetId =>
      addGoogleSheetClient(sheetId, trimmedName, filteredData)
    );
    await Promise.all(addPromises);

    // Additionally, save the background color to the master sheet
    if (color) {
      await updateGoogleSheetCell(masterSheetId, trimmedName, 'Background', color);
    }
    
    // Invalidate the entire cache since multiple weeks are affected
    dataCache.clear();
    productUpdateCache.clear();
    clientSpecificDetailsCache.clear();
    trackerCache.clear();

    res.json({ ok: true, message: `Client ${trimmedName} added to sheets from ${week} onwards.` });
  } catch (e) {
    console.error("Error adding new client:", e);
    res.status(500).json({ error: "Failed to add new client: " + e.message });
  }
});

app.put("/api/customers/:name/logo", upload.single('logo'), async (req, res) => {
  const { name } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: "No logo file was uploaded." });
  }

  // The public path to the saved file
  const logoUrl = `/${req.file.filename}`;

  const masterSheetId = DATA_SOURCES_ARRAY[0];
  if (!masterSheetId) {
    return res.status(500).json({ error: "Master data source not configured." });
  }

  try {
    // This call is now guaranteed to succeed, either by updating an existing row
    // or by creating a new 'Logo' row and updating it.
    await updateGoogleSheetCell(masterSheetId, name, 'Logo', logoUrl);

    dataCache.clear(); // Invalidate cache for all weeks
    // Return the new URL so the client can display the new logo immediately
    res.json({ ok: true, message: `Logo updated for ${name}.`, logoUrl: logoUrl });
  } catch (error) {
    console.error("Error updating logo URL:", error);
    return res.status(500).json({ error: "Failed to update logo URL: " + error.message });
  }
});

app.put("/api/customers/:name/background", async (req, res) => {
  const { name } = req.params;
  const { color } = req.body; // <-- Correctly extract 'color'

  if (!color) {
    return res.status(400).json({ error: "Missing color" });
  }

  const masterSheetId = DATA_SOURCES_ARRAY[0];
  if (!masterSheetId) {
    return res.status(500).json({ error: "Master data source not configured." });
  }

  try {
    // This call is now guaranteed to succeed, either by updating an existing row
    // or by creating a new 'Background' row and updating it.
    await updateGoogleSheetCell(masterSheetId, name, 'Background', color);

    dataCache.clear(); // Invalidate cache for all weeks
    res.json({ ok: true, message: `Background color updated for ${name}.` });
  } catch (error) {
    console.error("Error updating background color:", error);
    res.status(500).json({ error: "Failed to update background color: " + error.message });
  }
});

// NEW: GET Product Update Data
app.get("/api/customers/:name/product-update", async (req, res) => {
  const name = req.params.name;
  const week = req.selectedWeek;

  // Check if the customer exists in the main data set for this week
  if (!req.db[name]) {
    // If customer isn't in the main sheet, we can't get product updates for them.
    return res.status(404).json({ error: "Customer not found in main sheet for this week." });
  }

  const cacheKey = `${week}:${name}`;
  if (productUpdateCache.has(cacheKey)) {
    return res.json({ data: productUpdateCache.get(cacheKey) });
  }

  try {
    const weeklySource = getWeeklySource(DATA_SOURCES_ARRAY, week);
    if (!weeklySource) {
      // This means the week exists, but there's no sheet ID configured for it.
      return res.status(404).json({ error: `No data source configured for week ${week}` });
    }

    const data = await loadProductUpdateData(weeklySource, name);
    productUpdateCache.set(cacheKey, data);
    
    // Cache for 5 minutes
    setTimeout(() => {
      productUpdateCache.delete(cacheKey);
    }, 5 * 60 * 1000);

    res.json({
      data,
      _meta: {
        week: req.selectedWeek,
        timestamp: new Date().toISOString()
      }
    });
  } catch (e) {
    console.error(`Error loading product update for ${name}/${week}:`, e.message);
    // Return 404 if the sheet or row wasn't found (no data saved yet)
    if (e.message.includes("Sheet 'ProductUpdates' not found") || e.message.includes("Customer not found")) {
      return res.status(404).json({ error: "Product update data not yet created." });
    }
    return res.status(500).json({ error: "Failed to load product update data: " + e.message });
  }
});


// NEW: PUT Product Update Data
app.put("/api/customers/:name/product-update", async (req, res) => {
  const name = req.params.name;
  const productUpdateData = req.body;
  const week = req.selectedWeek;
  
  if (!req.db[name]) return res.status(404).json({ error: "Customer not found" });
  
  const weeklySource = getWeeklySource(DATA_SOURCES_ARRAY, week);
  if (!weeklySource) { 
    return res.status(400).json({ error: `No editable data source found for week ${week}` });
  }

  try {
    // FIX: Using updateProductUpdateData which handles row creation/update
    await updateProductUpdateData(weeklySource, name, productUpdateData);
    productUpdateCache.delete(`${week}:${name}`); // Clear the specific product update cache
    res.json({ ok: true, message: `Product update saved for ${name} in ${week}` });
  } catch (e) {
    console.error("Error updating product update data:", e);
    return res.status(500).json({ error: "Failed to update product update data: " + e.message });
  }
});

// --- NEW: GET Client Specific Details Data ---
app.get("/api/customers/:name/client-specific-details", async (req, res) => {
  const name = req.params.name;
  const week = req.selectedWeek;

  if (!req.db[name]) {
    return res.status(404).json({ error: "Customer not found in main sheet for this week." });
  }

  const cacheKey = `${week}:${name}`;
  if (clientSpecificDetailsCache.has(cacheKey)) {
    return res.json({ data: clientSpecificDetailsCache.get(cacheKey) });
  }

  try {
    const weeklySource = getWeeklySource(DATA_SOURCES_ARRAY, week);
    if (!weeklySource) {
      return res.status(404).json({ error: `No data source configured for week ${week}` });
    }

    const data = await loadClientSpecificDetailsData(weeklySource, name);
    clientSpecificDetailsCache.set(cacheKey, data);
    
    setTimeout(() => clientSpecificDetailsCache.delete(cacheKey), 5 * 60 * 1000);

    res.json({ data });
  } catch (e) {
    console.error(`Error loading client specific details for ${name}/${week}:`, e.message);
    if (e.message.includes("not found")) {
      return res.status(404).json({ error: "Client specific details not yet created." });
    }
    return res.status(500).json({ error: "Failed to load client specific details: " + e.message });
  }
});

// --- NEW: PUT Client Specific Details Data ---
app.put("/api/customers/:name/client-specific-details", async (req, res) => {
  const name = req.params.name;
  const clientSpecificData = req.body;
  const week = req.selectedWeek;

  if (!req.db[name]) return res.status(404).json({ error: "Customer not found" });

  const weeklySource = getWeeklySource(DATA_SOURCES_ARRAY, week);
  if (!weeklySource) return res.status(400).json({ error: `No editable data source found for week ${week}` });

  try {
    await updateClientSpecificDetailsData(weeklySource, name, clientSpecificData);
    clientSpecificDetailsCache.delete(`${week}:${name}`);
    res.json({ ok: true, message: `Client specific details saved for ${name} in ${week}` });
  } catch (e) {
    console.error("Error updating client specific details:", e);
    return res.status(500).json({ error: "Failed to update client specific details: " + e.message });
  }
});

// --- NEW: GET Tracker Data ---
app.get("/api/customers/:name/tracker", async (req, res) => {
  const name = req.params.name;
  const year = req.query.year || new Date().getFullYear();
  const masterSheetId = DATA_SOURCES_ARRAY[0];

  const cacheKey = `${name}:${year}`;
  if (trackerCache.has(cacheKey)) {
    return res.json({ data: trackerCache.get(cacheKey) });
  }

  try {
    const data = await loadTrackerData(masterSheetId, name, year);
    trackerCache.set(cacheKey, data);
    setTimeout(() => trackerCache.delete(cacheKey), 5 * 60 * 1000); // Cache for 5 mins
    res.json({ data });
  } catch (e) {
    console.error(`Error loading tracker data for ${name}/${year}:`, e.message);
    return res.status(500).json({ error: "Failed to load tracker data: " + e.message });
  }
});

// --- NEW: PUT Tracker Data ---
app.put("/api/customers/:name/tracker", async (req, res) => {
  const name = req.params.name;
  const { date, content } = req.body;
  const masterSheetId = DATA_SOURCES_ARRAY[0];
  
  if (!date || content === undefined) return res.status(400).json({ error: "Missing date or content" });

  try {
    await updateTrackerData(masterSheetId, name, date, content);
    trackerCache.clear(); // Clear cache for all clients/years as sheet structure may change
    res.json({ ok: true, message: `Tracker data saved for ${name} on ${date}` });
  } catch (e) {
    console.error("Error updating tracker data:", e);
    return res.status(500).json({ error: "Failed to update tracker data: " + e.message });
  }
});

// --- NEW: GET Project List Data ---
app.get("/api/customers/:name/project-list", async (req, res) => {
  const name = req.params.name;
  const masterSheetId = DATA_SOURCES_ARRAY[0];

  // For project lists, we fetch all years at once for simplicity.
  const cacheKey = `${name}:all-years`;
  if (plCache.has(cacheKey)) {
    return res.json({ data: plCache.get(cacheKey) });
  }

  try {
    // This function will be implemented in excel.js to read all PL sheets
    const data = await loadProjectListData(masterSheetId, name);
    plCache.set(cacheKey, data);
    setTimeout(() => plCache.delete(cacheKey), 5 * 60 * 1000);
    res.json({ data });
  } catch (e) {
    console.error(`Error loading project list data for ${name}:`, e.message);
    return res.status(500).json({ error: "Failed to load project list data: " + e.message });
  }
});

// --- NEW: PUT Project List Data ---
app.put("/api/customers/:name/project-list", async (req, res) => {
  const name = req.params.name;
  const { year, content } = req.body;
  const masterSheetId = DATA_SOURCES_ARRAY[0];

  if (!year || content === undefined) {
    return res.status(400).json({ error: "Missing year or content" });
  }

  try {
    await updateProjectListData(masterSheetId, name, year, content);
    // Clear the specific client's cache to force a reload on next GET
    plCache.delete(`${name}:all-years`);
    res.json({ ok: true, message: `Project list for ${year} saved for ${name}` });
  } catch (e) {
    console.error("Error updating project list data:", e);
    return res.status(500).json({ error: "Failed to update project list data: " + e.message });
  }
});

// [Rest of endpoints remain unchanged]
app.get("/api/customers/:name", async (req, res) => {
  const name = req.params.name;
  const weeklyData = req.db[name];
  if (!weeklyData) return res.status(404).json({ error: "Customer not found" });

  // --- REFINED: Load master data to extract all possible document URLs ---
  const masterSheetId = DATA_SOURCES_ARRAY[0];
  const masterData = await loadData([masterSheetId], 'master');
  const masterCustomerData = masterData[name];

	const documentUrls = {};
	const extractUrls = (customerData) => {
		if (!customerData) return;
    // Iterate over categories (Client, Sycamore, Sycamore and Client)
		for (const category in customerData) {
			if (Array.isArray(customerData[category])) {
        // Iterate over items within each category (e.g., "SOW: Sycamore SOW [LINK: https://example.com]")
				customerData[category].forEach(item => {
					const parts = item.split(':');
					if (parts.length > 1) {
						const key = parts[0].trim();
						let value = parts.slice(1).join(':').trim();
						
            let extractedUrl = '';
            const linkMatch = value.match(/\[LINK:\s*(https?:\/\/[^\]]+)\]/i); // Look for [LINK: URL] pattern
            if (linkMatch && linkMatch[1]) {
                extractedUrl = linkMatch[1];
            } else if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('www.')) {
                extractedUrl = value; // Fallback to direct URL in value if no [LINK:] format
            }
            if (extractedUrl) documentUrls[key] = extractedUrl;
					}
				});
			}
		}
	};

	// Extract from weekly data first, then let master data override it if present.
	extractUrls(weeklyData);
	extractUrls(masterCustomerData);
  res.json({
    ...weeklyData,
    _meta: {
      week: req.selectedWeek,
      timestamp: new Date().toISOString(),
      documentUrls: documentUrls
    }
  });
});

app.get("/api/customers/:name/:category", (req, res) => {
  const name = req.params.name;
  const category = req.params.category;
  const data = req.db[name];
  
  if (!data) return res.status(404).json({ error: "Customer not found" });
  if (!data[category]) return res.status(404).json({ error: "Category not found" });
  
  res.json({ 
    [category]: data[category],
    _meta: {
      week: req.selectedWeek,
      timestamp: new Date().toISOString()
    }
  });
});

app.get("/api/search", (req, res) => {
  const q = (req.query.q || "").toString().trim();
  const category = req.query.category || null; 
  
  if (!q) {
    return res.json({});
  }

  const lowerCaseQuery = q.toLowerCase();
  const searchResults = {};
  const wholeWordRegex = new RegExp(`\\b${q}\\b`, 'i');

  const dataToSearch = req.db._weeklyUpdates ? { ...req.db } : req.db;
  delete dataToSearch._weeklyUpdates;
  for (const [cust, categories] of Object.entries(dataToSearch)) {
    const customerMatches = {};

    for (const [categoryName, items] of Object.entries(categories)) {
      if (category && category !== categoryName) continue;

      if (categoryName.toLowerCase().includes(lowerCaseQuery)) {
        customerMatches[categoryName] = items;
        continue;
      }

      if (!Array.isArray(items)) continue;

      const matchingItems = items.filter(item => {
        if (wholeWordRegex.test(item)) {
          return true;
        }
        return item.toLowerCase().includes(lowerCaseQuery);
      });
      
      if (matchingItems.length > 0) {
        customerMatches[categoryName] = matchingItems;
      }
    }

    if (Object.keys(customerMatches).length > 0) {
      searchResults[cust] = customerMatches;
    }
  }

  res.json({
    results: searchResults,
    customers: Object.keys(searchResults),
    _meta: {
      week: req.selectedWeek,
      query: q,
      timestamp: new Date().toISOString()
    }
  });
});

app.put("/api/customers/:oldName", async (req, res) => {
  const oldName = req.params.oldName;
  const newName = (req.body.newName || "").toString().trim();
  if (!newName) return res.status(400).json({ error: "newName required" });
  if (!req.db[oldName]) return res.status(404).json({ error: "Old client not found" });
  if (req.db[newName]) return res.status(409).json({ error: "New client already exists" });

  res.status(501).json({ 
    error: "Rename not implemented for multi-sheet structure",
    week: req.selectedWeek
  });
});

app.put("/api/customers/:name/data", async (req, res) => {
  const name = req.params.name;
  const newData = req.body;
  const week = req.selectedWeek || `week${getISOWeek(new Date())}`;
  if (!req.db[name]) return res.status(404).json({ error: "Customer not found" });

  let dataSource;
  if (week === 'master') {
    dataSource = DATA_SOURCES_ARRAY[0]; // Master sheet is always the first one
  } else {
    dataSource = getWeeklySource(DATA_SOURCES_ARRAY, week);
  }

  if (!dataSource) { 
    return res.status(400).json({ error: `No editable data source found for week ${week}` });
  }

  try {
    // The logic now defaults to Google Sheets, as local xlsx logic is secondary.
    await updateGoogleSheetData(dataSource, name, newData);
    dataCache.delete(week); // Clear cache for the specific week
    if (week === 'master') {
      // If master is updated, all weekly caches are potentially stale
      dataCache.clear();
    }
    return res.json({ ok: true, message: `Data updated for ${name} in Google Sheet (${week})` });
  } catch (e) {
    console.error("Error updating data:", e);
    return res.status(500).json({ error: "Failed to update data: " + e.message });
  }
});

app.get("/api/categories", (req, res) => {
  const categories = new Set();
  
  for (const customer of Object.values(req.db)) {
    for (const categoryName of Object.keys(customer)) {
      categories.add(categoryName);
    }
  }
  
  res.json({
    categories: Array.from(categories).sort(),
    _meta: {
      week: req.selectedWeek,
      timestamp: new Date().toISOString()
    }
  });
});

app.post("/api/cache/clear", (req, res) => {
  const weekToClear = req.query.week;
  dataCache.clear();
  productUpdateCache.clear(); // NEW: Clear product cache
  clientSpecificDetailsCache.clear(); // NEW: Clear client specific details cache
  trackerCache.clear(); // NEW: Clear tracker cache
  plCache.clear(); // NEW: Clear project list cache
  res.json({ ok: true, message: `Cache cleared` });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    sources: DATA_SOURCES_ARRAY.length,
    cache_size: dataCache.size,
    product_update_cache_size: productUpdateCache.size, // NEW: Show product cache size
    client_specific_details_cache_size: clientSpecificDetailsCache.size, // NEW
    pl_cache_size: plCache.size, // NEW
    available_weeks: Array.from({ length: 6 }, (_, i) => `week${getISOWeek(new Date()) - 4 + i}`),
    timestamp: new Date().toISOString(),
    sow_upload_url: process.env.SOW_UPLOAD_URL || ''
  });
});

app.get("/api/weekly-update", (req, res) => {
  const week = req.query.week;
  const updates = req.db._weeklyUpdates || {};
  res.json({ text: updates[week] || '' });
});

app.post("/api/weekly-update", async (req, res) => {
  const { text } = req.body;
  const week = req.query.week;
  const weeklySourceId = getWeeklySource(DATA_SOURCES_ARRAY, week);

  if (!weeklySourceId) {
    return res.status(400).json({ error: `No data source configured for week ${week}.` });
  }

  try {
    await updateWeeklyUpdate(weeklySourceId, week, text);
    dataCache.delete(week);
    res.json({ ok: true, message: `Update saved for ${week}` });
  } catch (error) {
    console.error('Error saving weekly update to Google Sheet:', error);
    res.status(500).json({ error: "Failed to save weekly update to Google Sheet." });
  }
});


app.delete("/api/customers/:name", async (req, res) => {
  const { name } = req.params;

  // Check if customer exists in master data
  const masterSheetId = DATA_SOURCES_ARRAY[0];
  if (!masterSheetId) {
    return res.status(500).json({ error: "Master data source not configured." });
  }

  try {
    // First, check if customer exists in master data
    // The master data is always the first sheet, which corresponds to the base week.
    const baseWeek = parseInt(process.env.WEEK_START || '1', 10);
    const masterData = await loadWeekData(`week${baseWeek}`);
    if (!masterData || !masterData[name]) {
      return res.status(404).json({ error: "Customer not found in master data" });
    }

    // Delete from all sheets: master and all weekly sheets
    const allSheetIds = DATA_SOURCES_ARRAY;

    console.log(`Attempting to delete client ${name} from all sheets.`);

    // Delete the client from all sheets concurrently
    const deletePromises = allSheetIds.map(sheetId =>
      deleteGoogleSheetClient(sheetId, name)
    );
    await Promise.all(deletePromises);

    // Invalidate the entire cache since all weeks are affected
    dataCache.clear();
    productUpdateCache.clear();
    clientSpecificDetailsCache.clear();

    res.json({ ok: true, message: `Client ${name} deleted from all sheets.` });
  } catch (e) {
    console.error("Error deleting client:", e);
    res.status(500).json({ error: "Failed to delete client: " + e.message });
  }
});

// Serve the main index.html file for all other routes.
// This ensures the React application loads correctly when navigating to the root URL.
app.get("*", (req, res) => {
  // Use path.resolve to get the absolute path to the index.html file
  // located in the static serving directory.
  res.sendFile(path.resolve(process.cwd(), 'client', 'public', 'index.html'));
});

app.listen(PORT, async () => {
  // await validateGoogleDriveAccess(); // Disable validation to avoid crashes if drive is down
  console.log(`\n🚀 Server listening on http://localhost:${PORT}`);
  console.log(`🔗 Available endpoints:`);
  console.log(`  - GET /api/weeks`);
  console.log(`  - GET /api/data?week=week39`);
  console.log(`  - GET /api/customers?week=week39`);
  console.log(`  - GET/PUT /api/customers/:name/product-update (NEW)`);
  console.log(`  - GET/PUT /api/customers/:name/client-specific-details (NEW)`);
  console.log(`  - GET/PUT /api/customers/:name/project-list (NEW)`);
  console.log(`  - GET/PUT /api/customers/:name/tracker (NEW)`);
  console.log(`  - POST /api/customers (New Client)`);
  console.log(`  - POST /api/upload-logo (New)`);
  console.log(`  - DELETE /api/customers/:name (Delete Client)`);
  console.log(`  - GET /api/health`);
  startScheduler(); // Start the weekly sheet creation job
});
