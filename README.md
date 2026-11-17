# playwright-ts-e2e-sample

[![CI](https://github.com/Maverlix777/playwright-ts-e2e-sample/actions/workflows/ci.yml/badge.svg)](https://github.com/Maverlix777/playwright-ts-e2e-sample/actions/workflows/ci.yml)

Demo project against public practice sites.

A small Playwright Test + TypeScript suite: 12 UI tests against [saucedemo.com](https://www.saucedemo.com) and 6 API tests against [jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com). I wrote it as a sample of how I structure test automation. It is not code from an employer.

## What it shows

- Page objects for login, inventory and checkout
- Custom fixtures, including a `loggedInInventory` fixture that logs in before the test starts
- Positive, negative and edge cases (wrong password, empty fields, locked user, direct URL without a session)
- API tests with Playwright's request context: status codes, response schema checks, a 404 case, query filters, a POST
- Tags for filtering in CI
- Strict TypeScript and ESLint
- GitHub Actions: lint, typecheck, tests on chromium, HTML report uploaded as an artifact

## Structure

```
pages/       page objects (locators and actions, no assertions about business rules)
fixtures/    test data and the extended `test` object
tests/ui/    UI specs
tests/api/   API specs
.github/     CI workflow
```

## Run it

```
npm install
npx playwright install chromium
npm test
npm run report
```

Other scripts:

| Script | What it does |
| --- | --- |
| `npm run test:smoke` | only tests tagged `@smoke` |
| `npm run test:regression` | only tests tagged `@regression` |
| `npm run test:ui` / `test:api` | one Playwright project |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Tags

A tag is part of the test title, for example `test('standard user logs in @smoke', ...)`. The scripts use `--grep`, so `npm run test:smoke` runs the short list that must pass on every change, and `npm run test:regression` runs the wider set. Each test carries exactly one tag.

## Design choices

- **Page objects** keep locators in one place. When the site changes a selector, I fix one file, not ten specs. Assertions stay in the specs, except small helpers like `expectLoaded`.
- **Fixtures** replace repeated setup. A test that needs a logged-in user asks for `loggedInInventory` and gets it. This is more readable than `beforeEach` copies and only runs when needed.
- **Locators** use `data-test` ids and roles, not CSS paths.
- **API schema checks** are small type guards instead of a schema library, to keep the sample without extra dependencies. In a larger project I would use a schema library or generated types from OpenAPI.
- **Retries** are on in CI only (2), with a trace on the first retry. Locally a failure should fail at once.

## Out of scope on purpose

- Cross-browser runs (CI uses chromium only to stay fast)
- Visual regression, accessibility and performance checks
- Auth state reuse through `storageState`, because the login flow is itself under test here
- Test data cleanup: the practice sites keep no state between sessions
- Mocking. The tests call the real public sites, so a site outage can fail a run.

## License

MIT, see `LICENSE`.
