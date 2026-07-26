# Bakula laminati

React rebuild of [bakula-laminati.hr](https://bakula-laminati.hr/) — a catalog site for a laminate/vinyl flooring and trim retailer in Osijek, Croatia. Catalog only, no cart/checkout/prices; customers browse products then contact the business directly.

## Running the app

```bash
npm install
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173). Stop it with `Ctrl+C` in that terminal (or see "Killing a stray dev server" below).

Other scripts:

```bash
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build locally
npm run lint     # oxlint
```

## Contact form setup

The contact form sends via [EmailJS](https://www.emailjs.com) so it works without a backend. Copy `.env.example` to `.env` and fill in the three `VITE_EMAILJS_*` values (see the comments in that file for how to set up the EmailJS service/template). Until `.env` is configured, submitting the form falls back to opening the visitor's own email client with the message pre-filled — so it still works, just not automatically.

## Product data

`src/data/products.json` and `src/data/categories.json` are scraped from the live WordPress/WooCommerce site by `scripts/scrape.mjs`, with images downloaded into `public/images/products/`. Re-run it any time the live catalog changes:

```bash
node scripts/scrape.mjs
```

## End-to-end tests

Playwright drives the app through a Page Object Model in `e2e/`, covering navigation, catalog filtering/search/pagination, product detail, contact form (validation + submission, with the EmailJS network call mocked so no real email is sent), and responsive layout.

```bash
npm run test:e2e            # full suite (headless), builds + serves the app itself
npm run test:e2e:ui         # interactive UI mode
npm run test:e2e:headed     # headed browser
npm run test:e2e:report     # open the HTML report from the last run
npm run test:e2e:typecheck  # type-check e2e/ without running tests
```

Tests run against a production preview build (`npm run build && npm run preview`), started automatically. To target a different environment instead (e.g. the live Vercel deployment):

```bash
PLAYWRIGHT_BASE_URL=https://bakula-laminati-react.vercel.app npm run test:e2e
```

Runs across Google Chrome (the installed browser, via Playwright's `channel: "chrome"`), Firefox, WebKit, and mobile/tablet viewports (`playwright.config.ts`); Firefox/WebKit only run the `@smoke`-tagged subset. CI runs the suite on every push/PR via `.github/workflows/playwright.yml`.

## Killing a stray dev server

If `npm run dev` is running in a background/detached process and you don't have its terminal handy, find and kill whatever's on port 5173:

**PowerShell:**
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process
```

**Git Bash:**
```bash
netstat -ano | grep :5173
taskkill //PID <the_pid_from_above> //F
```
