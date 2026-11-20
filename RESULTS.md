# Results

## Automated (Playwright, Chromium)
Run on 20 Nov 2026: 5 passed, 0 failed (total 5.8s).
Evidence: evidence/report.png (HTML report screenshot)

## Suite sanity check (mutation)
Purpose: confirm the tests fail when the app is wrong, not only pass when it is right.

- **Price mutation:** changed USB-C Cable price 24950 -> 24951 in `app/app.js`.
  Result: "quantity change updates the exact total" **failed**
  (expected `₹1048.50`, received `₹1048.51`); the other 4 tests passed.
  Evidence: evidence/mutation-price-fail.png
- **Double-click mutation:** removed all three guards (`if (state.orderPlaced) return;` in
  `placeOrder()`, the `state.orderPlaced` check in the click listener, and
  `$('place-order').disabled = locked;` in `render()`).
  Result: the double-click test **failed**; the other 4 tests passed.
  Evidence: evidence/mutation-doubleclick-fail.png, evidence/mutation-doubleclick-manual.png
- Both changes were reverted afterwards; `npm test` again shows 5 passed.

## Manual tests

### MAN-1 Empty cart
Steps: open a fresh page, leave the cart empty, enter name "Vishal", click Place Order.
Expected: checkout blocked, message "Your cart is empty. Add at least one item.",
no confirmation, name stays in the input.
Actual: Checkout was blocked and the cart error message was shown. No confirmation
appeared and the name "Vishal" stayed in the input. Matches expected.
Evidence: evidence/manual-empty-cart.png

### MAN-2 Rapid double-click
Steps: add Wireless Mouse, enter name "Vishal", click Place Order rapidly 5-6 times.
Expected: exactly one confirmation, one reference, button disabled afterwards.
Actual: Exactly one confirmation appeared and the reference did not change after the
first click. The Place Order button became disabled. Matches expected.
Evidence: evidence/manual-double-click.png

## Defects
None found. Both manual tests matched the expected behaviour, so no defect is reported.

## Observations (not defects)
- The "Please enter your name." error stays visible after items are added, until the next
  Place Order click (by design: errors are cleared on the next submit attempt).
- Quantity limits (min 1, max 99) are not covered by automated tests; listed as a future
  improvement in TEST_PLAN.md.