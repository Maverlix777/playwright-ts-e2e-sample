import { test, expect } from '../../fixtures';
import { products } from '../../fixtures/users';

test.describe('Inventory', () => {
  test('shows six products @smoke', async ({ loggedInInventory }) => {
    await expect(loggedInInventory.items).toHaveCount(6);
  });

  test('sorting by price low to high orders the list @regression', async ({ loggedInInventory }) => {
    await loggedInInventory.sortBy('lohi');
    await expect(loggedInInventory.prices.first()).toHaveText('$7.99');
    const prices = await loggedInInventory.priceValues();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('adding and removing items updates the cart badge @regression', async ({ loggedInInventory }) => {
    await loggedInInventory.addToCart(products.backpack);
    await expect(loggedInInventory.cartBadge).toHaveText('1');
    await loggedInInventory.addToCart(products.bikeLight);
    await expect(loggedInInventory.cartBadge).toHaveText('2');
    await loggedInInventory.removeFromCart(products.backpack);
    await expect(loggedInInventory.cartBadge).toHaveText('1');
    await loggedInInventory.removeFromCart(products.bikeLight);
    await expect(loggedInInventory.cartBadge).toBeHidden();
  });

  test('logout returns to the login page @regression', async ({ loggedInInventory, loginPage, page }) => {
    await loggedInInventory.logout();
    await expect(page).toHaveURL('/');
    await expect(loginPage.submit).toBeVisible();
  });
});
