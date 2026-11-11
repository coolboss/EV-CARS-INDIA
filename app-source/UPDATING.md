# How to update EV Raasta

The app is built from the files in `src/` into one page.

1. Edit data in `src/data-cars.js` (cars), `src/v-cars.js` (UPCOMING launches live in data-cars.js), `src/v-money.js` (state road tax) and `src/data-map.js` (chargers).
2. Build: `python3 build.py` (writes `dist/index.html` and `dist/artifact.html`).
3. Check: `cd qa && npm install && node data.js && node logic.js && node browser.js ../dist/index.html && node browser.js ../dist/artifact.html && node stress.js`. All must show 0 fail.
4. Copy `dist/index.html` to the repo root as `index.html` and commit.

Rules for the data (see the header comment in `src/data-cars.js`):
- Never invent a number. If a figure cannot be found, leave it out and say so on the card.
- Owner star ratings (`ur`) come from the CarWale page of each car (`uu`). Update the rating, count and review count together and change the "read on" date in `src/v-cars.js`.
- Dates for upcoming cars: write "not announced" when no source gives a date.
- Fast charging: `dc` = minutes for 10-80%; `dc:0` means AC only. If a car's AC-only status changes, update the Charging tab note in `src/v-charging.js` (the QA fails until you do).
