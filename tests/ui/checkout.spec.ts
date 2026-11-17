import { test, expect } from '../../fixtures';
import { customer, products } from '../../fixtures/users';

test.describe('Checkout', () => {
  test.beforeEach(async ({ loggedInInventory }) => {
    await loggedInInventory.addToCart(products.backpack);
    await loggedInInventory.openCart();
  });

  test('user completes an order @smoke', async ({ checkoutPage, page }) => {
    await expect(checkoutPage.cartItems).toHaveCount(1);
    await checkoutPage.start();
    await checkoutPage.fillInfo(customer);
    await expect(page).toHaveURL(/checkout-step-two/);
    await checkoutPage.finishButton.click();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('missing first name blocks the form @regression', async ({ checkoutPage }) => {
    await checkoutPage.start();
    await checkoutPage.fillInfo({ lastName: customer.lastName, postalCode: customer.postalCode });
    await expect(checkoutPage.error).toContainText('First Name is required');
  });
});
