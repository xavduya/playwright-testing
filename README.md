# Separate authentication and workflows

Place playwright.config.ts in your project root and the tests directory beside it.
Merge config and .gitignore into existing files rather than discarding existing settings.


Install dependencies if missing:

```sh
npm install -D @playwright/test dotenv @types/node
npx playwright install chromium
```

Keep your real .env at the project root. .env.example contains placeholders only.
requiredEnv checks values at runtime; TypeScript's ! does not do that.
The saved auth state contains sensitive session data and is ignored along with .env.
Run commands from the project root so .env and auth paths resolve correctly.

## Required app-specific adjustments

1. SUCCESS_LOGIN must be the URL your browser actually reaches after password
   submission. The second main-login-button click is retained from the original.
   If the app goes straight to DASHBOARD, remove that second click and set
   SUCCESS_LOGIN accordingly. For URLs with variable queries, use an appropriate
   waitForURL predicate instead of an exact URL. Do not force navigation before
   sign-in has completed.
2. Set PROJECT_SETTINGS_READY_TEST_ID to an existing test ID visible only when
   the list has fully rendered, even if empty, and absent during refresh. If no
   such signal exists, add it to the app or replace waitForSettingsLoaded with
   the app's real loading/response signal AND a rendered-list assertion.
   Waiting for a missing Test cell does not distinguish loading from an empty list.
3. The confirmation locator assumes an accessible dialog containing a Delete
   button. Adapt it to your actual modal. Scope it further if multiple dialogs exist.
4. /Test/i preserves your original substring rule; it also matches words like
   'Latest'. Use your intended naming rule and ideally target the project-name
   column. This currently processes rendered matching cells only: pagination or
   virtualized lists require additional page/scroll handling.
5. No creation interactions were supplied. The create test is explicitly skipped,
   with TODOs; provide the real create workflow to finish it. It contains no deletion.

## Run

```sh
npx playwright test --project=chromium --headed
npx playwright test tests/CLI_delete_PS.spec.ts --project=chromium --headed
```

Both commands run the setup dependency before workflows. Setup signs in once per
invocation and rewrites the saved session; each workflow gets a fresh context using
that state. In Playwright UI mode, enable and run setup explicitly before workflows.
Do not use --no-deps when you need fresh authentication.

workers: 1 prevents simultaneous create/delete operations within this run but does
not impose create-before-delete ordering. These workflows should own distinct test
data if expanded later. Separate runs or other users can still interfere with data.

storageState saves cookies/localStorage and (with indexedDB: true) IndexedDB.
If the app authenticates using sessionStorage, extra persistence is needed; this
bundle does not assume that mechanism. indexedDB requires Playwright 1.51+.

The overall setup timeout is 240 seconds and deletion timeout is 300 seconds.
Increase only if a measured login or larger cleanup needs it. An assertion timeout
alone never extends the test timeout. Failures are reported instead of caught as
successful cleanup.

Source reference: https://playwright.dev/docs/auth

These files have not been run against your app: no real credentials, URLs, loading
marker, modal markup or create interactions were supplied.
