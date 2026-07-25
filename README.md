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
