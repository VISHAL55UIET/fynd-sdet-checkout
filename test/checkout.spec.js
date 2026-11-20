const { test, expect } = require('@playwright/test');

// Playwright gives every test a fresh browser context, and beforeEach
// reloads the page, so every check starts from a clean state.
test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('successful checkout shows one confirmation with a reference', async ({ page }) => {
  await page.getByTestId('add-mouse').click();
  await page.getByTestId('name-input').fill('Vishal Singh');
  await page.getByTestId('place-order').click();

  await expect(page.getByTestId('confirmation')).toBeVisible();
  await expect(page.getByTestId('confirmation')).toHaveCount(1);
  await expect(page.getByTestId('confirm-name')).toHaveText('Vishal Singh');
  await expect(page.getByTestId('order-reference')).toHaveText(/^ORD-\d{8}-[A-Z0-9]{4}$/);
});

test('missing name blocks checkout and keeps what the customer entered', async ({ page }) => {
  await page.getByTestId('add-mouse').click();
  await page.getByTestId('name-input').fill('   '); // whitespace-only counts as blank
  await page.getByTestId('place-order').click();

  await expect(page.getByTestId('name-error')).toBeVisible();
  await expect(page.getByTestId('name-error')).toHaveText('Please enter your name.');
  await expect(page.getByTestId('confirmation')).toBeHidden();
  // entered data preserved
  await expect(page.getByTestId('name-input')).toHaveValue('   ');
  await expect(page.getByTestId('qty-mouse')).toHaveText('1');
  await expect(page.getByTestId('order-total')).toHaveText('₹799.00');
});

test('quantity change updates the exact total', async ({ page }) => {
  await page.getByTestId('add-mouse').click();
  await page.getByTestId('add-cable').click();
  await expect(page.getByTestId('order-total')).toHaveText('₹1048.50');

  await page.getByTestId('inc-mouse').click();
  await expect(page.getByTestId('qty-mouse')).toHaveText('2');
  await expect(page.getByTestId('line-total-mouse')).toHaveText('₹1598.00');
  await expect(page.getByTestId('order-total')).toHaveText('₹1847.50');

  await page.getByTestId('dec-mouse').click();
  await expect(page.getByTestId('order-total')).toHaveText('₹1048.50');
});