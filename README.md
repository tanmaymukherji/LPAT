# Livelihoods & Entrepreneurship Thesis Partner Assessment Tool (LPAT)

An interactive web application for assessing partner organisations against the Livelihoods & Entrepreneurship Thesis framework. Built with plain HTML, CSS, and JavaScript.

## Features

- **Partner Form** — Add/edit partner assessments with 107 scored questions across 13 sections, evidence tracking, and priority setting
- **Score View** — Total scores, percentages, classification, section-wise breakdown, strongest/weakest sections, and gap analysis
- **Graphs** — Bar chart and radar/spider chart visualisation of section-wise scores using Chart.js
- **Compare** — Select multiple partners and compare total scores, percentages, and section-wise performance in tables and grouped charts
- **Typology** — Automatic partner classification into 10 partner types based on score patterns
- **Journey Mapping** — Stage-based recommendations and gap-based action planning

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

| Range | Classification |
|-------|---------------|
| 0–30% | Weak alignment; mostly project-mode or activity-led |
| 31–50% | Emerging alignment; some place or enterprise thinking |
| 51–70% | Moderate alignment; good base for local economy work |
| 71–85% | Strong alignment; ready for pilot or collaboration |
| 86–100% | Very high alignment; potential anchor/ecosystem partner |

## How to Open Locally

Simply open `index.html` in any modern web browser. No server or build step required.

```
open index.html
```

Or serve locally with any static file server:

```
npx serve .
```

## Deploy on GitHub Pages

1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Under "Branch", select `main` (or your default branch) and root folder `/`
4. Click **Save**
5. Your app will be available at `https://<username>.github.io/LPAT/`

## Data Storage

All data is stored in your browser's **localStorage**. This means:
- Data persists across page refreshes
- Data does not sync across devices or browsers
- Clearing browser data will remove all assessments

### Export / Import

Use the buttons in the sidebar to:
- **Export All Data** — Download all partners as a JSON file for backup
- **Import All Data** — Restore previously exported data
- **Reset All Data** — Clear all stored data

On the Partner Form tab:
- **Export JSON** — Download a single partner assessment
- **Import JSON** — Import a previously exported partner
- **Download CSV** — Download the current partner assessment as a CSV file

## Demo Data

Ten pre-filled demo partner assessments are included:
PRADAN, Buzz Women, Lipok Social Foundation, JECP, TRIF, Shivganga Jhabua, VAAGDHARA, Himalay Unnati Mission, Gram Vikas, Common Ground.

Demo records are marked with a "Demo" badge and can be edited or deleted.

## File Structure

```
├── index.html       Main HTML page
├── styles.css       Stylesheet
├── app.js           Application logic
├── data/
│   └── schema.js    Assessment schema, partner types, demo data
└── README.md        This file
```

## Tech Stack

- Plain HTML, CSS, JavaScript
- [Chart.js](https://www.chartjs.org/) via CDN for charts
- localStorage for data persistence
- No backend required
- Works offline after first load (except Chart.js CDN)
