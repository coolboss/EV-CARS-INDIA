# EV Raasta

A single-file guide for first-time EV buyers in India, coming from petrol/diesel cars. Covers battery basics, 70 cars, charging (home, AC, DC), a charger map with a live Google Maps search, a trip planner, ownership vs Battery-as-a-Service maths, and buying checklists.

Data as of 10 Nov 2026. Prices, ranges and BaaS quotes change often. Check with the dealer before you pay.

## Host on GitHub Pages

1. Create a repository and add `index.html` at the top level.
2. Settings > Pages > Build and deployment > Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. Open `https://<your-user>.github.io/<repo>/` after a minute or two.

No build step, no dependencies. The only outside requests are the Google Fonts stylesheet and, if the visitor clicks "Show on live map", a Google Maps embed. A Content-Security-Policy meta tag limits the page to those.

## Privacy
The live map loads only after a click. When loaded, Google sees that visit. "Use my location" asks the browser for permission and the position is used only to build the search link. Saved cars, compare list and theme are kept in the visitor's own browser (localStorage, keys start `evr_`).

## Data notes
- Measured fast-charging times and test ranges come from Autocar India's 2026 tests (links inside the app). Cars without a test use labelled estimates.
- Four BaaS quotes (Creta, BE 6, XEV 9e, XEV 9S) add up to less than the battery price. The app flags them as inconsistent.
- Operator and brand links were not all verifiable at build time.

## Credits
India outline from svg-maps, CC BY 4.0. Fonts: Inter and JetBrains Mono via Google Fonts. Map search: Google Maps.
