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
