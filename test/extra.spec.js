const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('empty cart blocks checkout even with a valid name', async ({ page }) => {
  await page.getByTestId('name-input').fill('Vishal Singh');
  await page.getByTestId('place-order').click();

  await expect(page.getByTestId('cart-error')).toHaveText('Your cart is empty. Add at least one item.');
  await expect(page.getByTestId('confirmation')).toBeHidden();
  await expect(page.getByTestId('name-input')).toHaveValue('Vishal Singh');
});

test('double-clicking Place Order produces only one confirmation', async ({ page }) => {
  await page.getByTestId('add-mouse').click();
  await page.getByTestId('name-input').fill('Vishal Singh');

  // reference element me kitni baar change hua, ye gino
  await page.evaluate(() => {
    window.__refChanges = 0;
    const el = document.querySelector('[data-testid="order-reference"]');
    new MutationObserver(() => { window.__refChanges++; })
      .observe(el, { childList: true, characterData: true, subtree: true });
  });

  await page.getByTestId('place-order').dblclick();

  await expect(page.getByTestId('confirmation')).toBeVisible();
  await expect(page.getByTestId('confirmation')).toHaveCount(1);
  await expect.poll(() => page.evaluate(() => window.__refChanges)).toBe(1);
});