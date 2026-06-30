# Livelihoods & Entrepreneurship Thesis Partner Assessment Tool (LPAT)

An interactive web application for assessing partner organisations against the Livelihoods & Entrepreneurship Thesis framework. Built with plain HTML, CSS, and JavaScript — no backend required.

**Live demo:** https://tanmaymukherji.github.io/LPAT/

## Features

- **Partner Form** — Add/edit partner assessments with 107 scored questions across 13 sections, evidence tracking, and priority setting
- **Score View** — Total scores, percentages, classification, section-wise breakdown, strongest/weakest sections, and gap analysis
- **Graphs** — Bar chart and radar/spider chart visualisation of section-wise scores using Chart.js
- **Compare** — Select multiple partners and compare total scores, percentages, and section-wise performance in tables and grouped charts
- **Typology** — Automatic partner classification into 10 partner types based on score patterns
- **Journey Mapping** — Stage-based recommendations and gap-based action planning
- **Data Persistence** — All data stored in browser localStorage with JSON export/import for backup

## Sections Assessed

| Section | Topic | Max Score |
|---------|-------|-----------|
| A | Place Ownership & Local Economy Orientation | 32 |
| B | Ecology Alignment | 32 |
| C | Community Ownership & Governance | 32 |
| D | Enterprise Creation Pathway | 32 |
| E | 6M Enterprise Readiness | 48 |
| F | Local Production Economy Potential | 32 |
| G | Existing Local Ecosystem & Informal Support Systems | 32 |
| H | Nine Platform Components Readiness | 36 |
| I | POESI Architecture Fit | 24 |
| J | Market, Finance & Sustainability | 32 |
| K | Platformisation & Servicification Readiness | 32 |
| L | Evidence, Learning & Replication | 32 |
| M | Collaboration Fit | 32 |
| **Total** | | **428** |

## Scoring

Each question is scored 0–4:
- **0** — Not present
- **1** — Early / informal / unclear
- **2** — Present but limited
- **3** — Strong and intentional
- **4** — Deeply embedded and repeatable

### Classification

| Range | Classification | Color |
|-------|---------------|-------|
| 0–30% | Weak alignment | 🔴 Red |
| 31–50% | Emerging alignment | 🟠 Orange |
| 51–70% | Moderate alignment | 🟡 Yellow |
| 71–85% | Strong alignment | 🟢 Green |
| 86–100% | Very high alignment | 🟢 Dark green |

## How to Open Locally

Simply open `index.html` in any modern web browser:

```
open index.html
```

Or serve locally with any static file server:

```
npx serve .
python -m http.server 8000
```

If you see "Chart.js failed to load", check your internet connection — the chart library is loaded from CDN.

## Deploy on GitHub Pages

This repository is already set up for GitHub Pages. To deploy your own fork:

1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Under **Branch**, select `master` (or `main`) and root folder `/`
4. Click **Save**
5. Your app will be available at `https://<your-username>.github.io/LPAT/`

The site is built from the root of the default branch — no build step is required since this is a plain HTML/CSS/JS app.

## Data Storage

All data is stored in your browser's **localStorage** (`lpat_partners` key). This means:
- ✅ Data persists across page refreshes
- ❌ Data does not sync across devices or browsers
- ❌ Clearing browser data will remove all assessments

### Export / Import

Use the buttons in the **sidebar** (bottom section):
- **Export All Data** — Download all partners as a JSON file for backup
- **Import All Data** — Restore previously exported data (replaces current data)
- **Reset All Data** — Clear all stored data (reload page to re-initialize demo data)

On the **Partner Form** tab:
- **Export JSON** — Download a single partner assessment
- **Import JSON** — Import a previously exported partner (appends to existing data)
- **Download CSV** — Download the current partner assessment as a CSV file for spreadsheet analysis

## Demo Data

Ten pre-filled demo partner assessments are included automatically on first load:
PRADAN, Buzz Women, Lipok Social Foundation, JECP, TRIF, Shivganga Jhabua, VAAGDHARA, Himalay Unnati Mission, Gram Vikas, Common Ground.

Demo records are marked with a "Demo / prefilled assessment" badge and can be edited or deleted. If you delete all data and refresh the page, demo data will be re-initialized.

## Partner Typology

The app classifies partners into 10 types based on score patterns:

| Type | Key Sections | Role |
|------|-------------|------|
| Place Anchor | A, B, C, F, G, I | Lead place-based planning |
| Community Mobiliser | C, G, H7, M | Community governance |
| Production Partner | E, D, H1, H3, H4, H6 | Technical production support |
| Market Partner | J, H5, F, E11, E12 | Market access |
| Skill Partner | E1, E2, H3, H7, H8 | Workforce development |
| Finance Partner | E9, E10, J, H9 | Financial access |
| Platform Partner | K, L, H2, I5 | Knowledge systems |
| Replication Partner | D, K, L, M | Scaling across geographies |
| Ecology Partner | B, A, F, I1 | Natural resource management |
| Infrastructure Partner | I5, H, K, M | Shared infrastructure |

## File Structure

```
├── index.html       Main HTML page (263 lines)
├── styles.css       Stylesheet with dashboard theme (530+ lines)
├── app.js           Application logic (920+ lines)
├── data/
│   └── schema.js    Assessment schema, partner types, demo data
├── README.md        This file
```

## Tech Stack

- Plain HTML, CSS, JavaScript
- [Chart.js](https://www.chartjs.org/) v4.4.7 via CDN for bar and radar charts
- Browser localStorage for data persistence
- No build tools, no bundlers, no backend
- Works offline after first load (except Chart.js CDN)
