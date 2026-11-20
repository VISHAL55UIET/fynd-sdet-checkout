# Mini Checkout and Browser Test Suite

A single-page checkout (2 products, quantity controls, required Name field,
order confirmation) with an automated browser test suite.

## Requirements
- Node.js 18+ and npm

## Run the app
```bash
npm install
npm start
```
Open http://localhost:3000

## Run the browser tests
```bash
npx playwright install chromium   # once, downloads the browser
npm test                          # starts the server automatically if it is not running
npx playwright show-report        # open the HTML report
```
Expected: 5 passed. On failure, screenshots, video and traces are saved in `test-results/`.

## What is tested
| File | Checks |
|------|--------|
| `test/checkout.spec.js` | Successful checkout shows a confirmation with a reference; missing name blocks checkout and keeps entered data; quantity change updates the exact total |
| `test/extra.spec.js` | Empty cart blocks checkout; double-clicking Place Order gives one confirmation |

Every test starts from a fresh page in a new browser context (clean state) and
asserts on visible text, using auto-waiting assertions instead of fixed waits.

## Manual browser tests
1. **Empty cart:** open http://localhost:3000, enter a name, click Place Order with nothing in the cart. A cart error should appear and no confirmation.
2. **Rapid double-click:** add a product, enter a name, click Place Order 5-6 times quickly. Exactly one confirmation and one reference should appear.

Observed results are in `RESULTS.md`.

## Project structure

```
app/            checkout page (index.html, style.css, app.js)
server.js       tiny static server (no dependencies)
test/           checkout.spec.js, extra.spec.js
playwright.config.js
TEST_PLAN.md    risks and test cases
RESULTS.md      automated + manual results, mutation sanity check
evidence/       screenshots

```