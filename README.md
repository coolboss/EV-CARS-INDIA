# EV Raasta

A single-file guide for first-time EV buyers in India, coming from petrol or diesel cars. It covers battery basics, 70 cars, charging (home, AC, DC), a charger map with live Google Maps search, a trip planner, ownership vs Battery-as-a-Service maths, and buying checklists.

Data as of 10 Nov 2026. Prices, ranges and BaaS quotes change often. Check with the dealer before you pay.

## Host on GitHub Pages

1. Put `index.html` at the top level of the repo.
2. Settings > Pages > Build and deployment > "Deploy from a branch", branch `main`, folder `/ (root)`.
3. Open `https://<your-user>.github.io/<repo>/` after a minute or two.

No build step and no dependencies. The only outside requests are the Google Fonts stylesheet and, if the visitor clicks to load it, a Google Maps embed. A Content-Security-Policy tag limits the page to those two.

## What was checked
- Data checks: 70 cars, prices, ranges, crash-test scores and charging figures cross-checked against each other and against the sources.
- 11,000+ calculation checks on the cost, charging-time, battery-rental and trip-planner maths.
- Browser tests at five screen widths in light and dark, random clicking of every control, accessibility scan (axe), keyboard-only walk, 200% text size, print layout, high-contrast mode, blocked storage, corrupted saved data and hostile input.
- Served from a sub-folder URL to match GitHub Pages.

## Privacy
The live map loads only after a click. When loaded, Google sees that visit. "Use my location" asks the browser for permission, and the position is only used to build the search link. Saved cars, the compare list and the theme stay in the visitor's own browser (localStorage, keys start `evr_`). No analytics, no cookies.

## Data notes
- Measured fast-charging times and test ranges come from Autocar India's 2026 tests (links inside the app). Cars without a test use labelled estimates.
- Four battery-rental quotes (Creta, BE 6, XEV 9e, XEV 9S) add up to less than the battery price. The app flags them as inconsistent.
- Launch dates in "Cars coming soon" are reports, not promises. Where sources disagree, the app says so.
- Some source links could not be re-opened at build time. If one has moved, the article title in the app is enough to find it.

## Credits
India outline from svg-maps, CC BY 4.0. Fonts: Barlow, Barlow Condensed and IBM Plex Mono via Google Fonts. Map search: Google Maps.
