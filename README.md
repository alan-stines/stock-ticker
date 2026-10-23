# MGA

A local stock dashboard with a saved watchlist, market indices, historical line and candlestick charts, a performance heatmap, and presentation mode.

## Run

Requires Node.js 22 or later. No dependencies or API keys are required.

```sh
npm start
```

Open http://localhost:3000. Set the `PORT` environment variable to change the port. The server binds to `127.0.0.1`, so it is accessible only on the host computer.

## Check

```sh
npm test
```

## Data and storage

Quotes and history come from Yahoo Finance's public chart endpoint and may be delayed or unavailable. Responses are cached in memory for two minutes; failed refreshes can return older cached data marked stale. The chart displays a separate history timestamp and stale warning. Restarting the server clears the cache.

The default display is an unattended kiosk: it cycles through the eight symbols defined in `public/app.js` every 15 seconds, refreshes every two minutes, retries failed requests automatically, and refreshes immediately when the browser regains network connectivity. Requests time out after 20 seconds. Stale data remains labeled. No keyboard, mouse, or touch is required.

Open `/?mode=edit` for the interactive dashboard with a local browser watchlist (up to 16 symbols). Kiosk mode uses its fixed symbol list rather than browser preferences.

## Deployment status

This is a local prototype. For remote hosting, configure an appropriate listen address and a reverse proxy with HTTPS, request limits, and operational monitoring. Provider access and reliability need validation for the intended hosting environment. Google Fonts also requires an internet connection.


## Kiosk deployment

Run the server at machine startup using your deployment system or Windows Task Scheduler, with automatic restart on failure. Launch Microsoft Edge on the display account at sign-in:

```powershell
msedge.exe --kiosk http://localhost:3000 --edge-kiosk-type=fullscreen --no-first-run
```

Configure the display computer to sign in to its kiosk account and keep the screen awake. Browser kiosk launch supplies fullscreen without a user gesture; the webpage cannot enable browser fullscreen automatically. Use a landscape display, ideally 1920×1080 (the layout also adapts to 1280×720). The supplied MGA logo is served locally. An internet connection is required for fresh market data. Machine startup, browser launch, and power settings must be configured on the actual kiosk computer.

## GitHub Pages demo

The static demo uses recorded real data from `demo/snapshot.json`, displays its capture timestamp, and is explicitly labeled **Not live data**. It rotates unattended and includes one-day history for the eight default stocks and three indices. The live local application still uses the Node API. Demo assets use relative paths so repository subpaths work.

Build with `npm run build:demo`. The generated `dist/` folder is ignored by Git; the recorded snapshot is intentionally tracked. To refresh the snapshot, run the local server, then `npm run capture:demo` (defaults to port 3000). Set `SNAPSHOT_API` to use a different local API address. Capture fails rather than saving incomplete or stale quotes.

To publish, push the source to GitHub, choose **Settings → Pages → Source → GitHub Actions**, then run **Actions → Deploy Pages demo → Run workflow**. Deployment is manual; the workflow does not fetch fresh prices or require market API credentials. The published URL appears in the workflow deployment result.

Do not commit credentials, `.env` files, logs, generated output, or machine-specific kiosk settings. `.gitignore` excludes these common local files; `.env.example` may be tracked with placeholders only.
