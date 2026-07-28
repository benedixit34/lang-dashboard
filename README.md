# City Language — Admin Dashboard

A modular React + Tailwind admin dashboard, styled after Vercel's console.

## Structure

```
src/
├── App.jsx                     # Composes layout + routes between sections
├── main.jsx                    # Entry point (Vite/CRA style)
├── index.css                   # Tailwind directives
├── data/
│   └── mockData.js             # Cities, vocabulary, media, users, activity
├── lib/
│   ├── nav.js                  # Sidebar nav config (label + icon per section)
│   └── csv.js                  # parseCSV, buildTemplateCSV, downloadCSV
├── components/
│   ├── ui/                     # Reusable, presentation-only primitives
│   │   ├── Card.jsx
│   │   ├── Badges.jsx          # Dot (status), Pill (tag)
│   │   ├── StatCard.jsx
│   │   ├── SectionHeader.jsx   # SectionHeader, PrimaryButton, SecondaryButton
│   │   ├── Table.jsx           # Th, Td, Row, RowMenu
│   │   ├── Drawer.jsx          # Field, Drawer (slide-over form)
│   │   ├── BulkImportModal.jsx # CSV paste/upload, preview, validate — used by Cities & Vocabulary
│   │   └── MediaUploadModal.jsx # Multi-file / whole-folder image picker — used by Media library
│   ├── layout/
│   │   ├── TopBar.jsx          # Workspace switcher + search + avatar
│   │   └── Sidebar.jsx         # Nav + content coverage widget
│   └── sections/               # One file per dashboard page
│       ├── Overview.jsx
│       ├── Cities.jsx
│       ├── Vocabulary.jsx
│       ├── MediaLibrary.jsx
│       ├── Users.jsx
│       └── Settings.jsx
```

## Why it's split this way

- **`data/`** — mock data is isolated so it's trivial to swap for real API calls later; nothing outside this folder needs to change shape.
- **`components/ui/`** — dumb, reusable primitives with no knowledge of the domain (cities, vocabulary, etc). These are the pieces you'd keep if you rebuilt the app for a different product.
- **`components/layout/`** — the chrome around the page content (top bar, sidebar) that stays constant across sections.
- **`components/sections/`** — one component per nav item. Each owns its own table columns and copy, and imports only the primitives it needs.
- **`App.jsx`** — the only file that knows about routing between sections and wiring the create-drawer to the right section.

## Bulk import

**Cities** and **Vocabulary** use `BulkImportModal` — paste or upload CSV text, matched by header name, previewed row by row, invalid rows skipped.

**Media library** is different: it only accepts images, so it uses `MediaUploadModal` instead of CSV. It exposes two native pickers:
- **Choose images** — a standard multi-file input (`accept="image/*" multiple`)
- **Choose folder** — the same input with `webkitdirectory` set, so the browser's native folder picker opens and every image inside (including subfolders) is picked up

Non-image files are filtered out automatically either way. Selected images preview as thumbnails before import; each can be removed individually. On import they're added to the media table with an object URL so the thumbnail renders immediately — swap that for a real upload endpoint when you wire up a backend.

The column rules for the CSV-based sections live at the top of each section file (`IMPORT_COLUMNS` in `Cities.jsx` and `Vocabulary.jsx`) — add or rename a column there and the modal, template, and validation all pick it up automatically.

This is in-memory only (no backend), so imported rows persist for the session — swap the `useState(...)` seed and the `onImport` handler in each section for real API calls when you're ready to wire it up.

## Running it

This is plain React + Tailwind (no shadcn CLI dependency — the primitives in `components/ui/` are hand-built to match shadcn's look and behavior). To run it locally:

```bash
npm create vite@latest city-language-dashboard -- --template react
cd city-language-dashboard
npm install lucide-react recharts
npx tailwindcss init -p
# copy the src/ folder from this project over the generated one
npm run dev
```

Make sure Tailwind is scanning `./src/**/*.{js,jsx}` in `tailwind.config.js`.
