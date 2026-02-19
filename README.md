# Student Finance Tracker

GitHub Pages URL: _Add your deployed GitHub Pages URL here after publishing_.

## Chosen theme
Student Finance Tracker (budgets, transactions, regex search, persistence, settings).

## Features
- Semantic and responsive UI with sections: About, Dashboard, Records, Add/Edit Form, Settings.
- Mobile-first design with breakpoints near 360px, 768px, and 1024px.
- Record CRUD: add, edit, delete with `createdAt` and `updatedAt` timestamps.
- Sorting by date, description, and amount.
- Live regex search with safe compile and `<mark>` highlighting.
- Dashboard stats: total records, total amount, top category, and last-7-days mini chart.
- Cap/target messaging via ARIA live (`polite` vs `assertive` when exceeded).
- localStorage persistence for records and settings.
- Import/export JSON with structure validation.
- Currency settings (base + EUR/GBP manual rates).

## Regex catalog
1. Description trim guard: `^\S(?:.*\S)?$`
   - Example valid: `Coffee with friends`
   - Example invalid: ` leading space`
2. Amount format: `^(0|[1-9]\d*)(\.\d{1,2})?$`
   - Valid: `0`, `45`, `12.50`
3. Date format: `^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$`
   - Valid: `2025-09-29`
4. Category format: `^[A-Za-z]+(?:[ -][A-Za-z]+)*$`
   - Valid: `School Fees`
5. Advanced (duplicate word back-reference): `\b(\w+)\s+\1\b`
   - Match example: `coffee coffee`

## Keyboard map
- `Tab` / `Shift + Tab`: navigate all controls.
- `Enter`: submit forms / activate focused button.
- Skip link appears on focus and jumps to main content.

## Accessibility notes
- Semantic landmarks: header/nav/main/section/footer.
- Label-input binding and visible focus styles.
- ARIA live regions for status messages and cap alerts.
- Color contrast designed with dark text on light background and high-contrast focus ring.

## How to run
1. Open `index.html` in a modern browser.
2. Optionally preload data by importing `seed.json` in Settings.

## How to run tests
1. Open `tests.html` in a browser.
2. Verify all assertions show ✅.

## Demo video checklist
- Keyboard-only navigation through all sections.
- Regex edge cases (valid/invalid patterns).
- Sorting, editing, deleting, and chart/cap updates.
- JSON export/import round trip.

## Individual work declaration
This repository is intended for individual work. Ensure only your GitHub account appears in contributor history before submission.
