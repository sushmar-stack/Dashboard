# Sycamore Menu-Card Dashboard (Fullstack)

A one-page **menu-card style** customer dashboard with:
- React (Vite + Tailwind) client
- Node.js/Express server that **reads/writes an Excel (.xlsx)** file
- **Add client** and **Edit client** update the Excel
- **Global search** across all customers keeps section colors (no orange/red)

## Quick Start

### 1) Server
```bash
cd server
cp .env.example .env
# (optional) edit DATA_FILE in .env to point to your Excel on your laptop
npm install
npm run dev
```

The server runs on **http://localhost:4000**.

### 2) Client
```bash
cd ../client
npm install
npm run dev
```

The client runs on **http://localhost:5173**.

If your server runs elsewhere, create a `.env` file in `client` root with:
```
VITE_API_BASE=http://localhost:4000
```

## Excel Format

We use a single sheet with columns:
- `Customer` (e.g., PMI, Alcon)
- `Section` (e.g., info, product, server, tickets, stakeholders, compliance, docs, tools)
- `Item` (text for each bullet)

### Add Client
Adds default rows for each section. These are appended to the Excel file.

### Edit Client
Renames all rows for the selected customer to the new name.

## Notes
- To use **your** Excel, set `DATA_FILE` in `server/.env` to the absolute path on your machine.
- This repo ships with a sample `server/data/master.xlsx`. If we detected your uploaded CSV, we converted it to Excel for you.
- Colors avoid **orange** and **red**; global search preserves section colors.
