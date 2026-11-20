# Test Plan: Mini Checkout

## Scope
Single-page checkout: 2 products, quantity controls, required Name field, order confirmation.
Out of scope: payments, backend, persistence, multi-browser, accessibility audit.

## Key risks (highest first)
| # | Risk | Impact | Priority | Covered by |
|---|------|--------|----------|------------|
| 1 | Duplicate order on double-click | Customer ordered/charged twice | High | AUTO-5, MAN-2 |
| 2 | Wrong total after quantity change | Wrong amount billed | High | AUTO-3 |
| 3 | Order goes through with blank name | Unusable order record | High | AUTO-2 |
| 4 | Order goes through with empty cart | Empty order | High | AUTO-4, MAN-1 |
| 5 | Entered data lost after validation error | Customer frustration | Medium | AUTO-2 |
| 6 | Missing or malformed confirmation reference | Customer cannot track order | Medium | AUTO-1 |
| 7 | Quantity goes below 1 or above 99 | Bad cart state | Low | Not automated (see Known gaps) |

## Test cases
| ID | Type | Steps | Expected |
|----|------|-------|----------|
| AUTO-1 | Automated | Add mouse, name "Vishal Singh", Place Order | One confirmation, name shown, reference matches `ORD-YYYYMMDD-XXXX` |
| AUTO-2 | Automated | Add mouse, name = spaces only, Place Order | "Please enter your name." shown, no confirmation, input, quantity and total preserved |
| AUTO-3 | Automated | Add mouse + cable, +1 mouse, then -1 mouse | Total ₹1048.50 -> ₹1847.50 -> ₹1048.50; mouse line total ₹1598.00 at qty 2 |
| AUTO-4 | Automated | Valid name, empty cart, Place Order | Cart error shown, no confirmation, name preserved |
| AUTO-5 | Automated | Valid cart + name, double-click Place Order | Exactly one confirmation, reference written once |
| MAN-1 | Manual | Empty cart, Place Order | Blocked with message |
| MAN-2 | Manual | Rapid repeated clicks on Place Order | One confirmation only |

Manual results and evidence: see `RESULTS.md`.

## Approach
Playwright Test (Node.js). Assertions are on visible text, located via `data-testid`,
using web-first auto-waiting assertions (no fixed waits). Each test starts from a fresh
page load in a new browser context (clean state).

Suite sanity check: the cable price and the double-click guards were temporarily broken
to confirm the tests fail when the app is wrong (see `RESULTS.md`).

## Known gaps
- Quantity limits (min 1, max 99) and the Remove button are not covered by automated tests.
- Only Chromium is tested.
- Order of the confirmation relative to the cart lock (disabled controls after order)
  is checked manually, not asserted in a test.