import { test, expect } from '../../fixtures';
import { users } from '../../fixtures/users';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user logs in @smoke', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectLoaded();
  });

  test('locked out user sees an error @regression', async ({ loginPage }) => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    await loginPage.expectError('locked out');
  });

  test('wrong password is rejected @regression', async ({ loginPage, page }) => {
    await loginPage.login(users.standard.username, 'not-the-password');
    await loginPage.expectError('do not match');
    await expect(page).not.toHaveURL(/inventory/);
  });

  test('empty username shows a required message @regression', async ({ loginPage }) => {
    await loginPage.login('', users.standard.password);
    await loginPage.expectError('Username is required');
  });

  test('empty password shows a required message @regression', async ({ loginPage }) => {
    await loginPage.login(users.standard.username, '');
    await loginPage.expectError('Password is required');
  });

  test('inventory is not reachable without a session @regression', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await loginPage.expectError("You can only access '/inventory.html' when you are logged in");
  });
});
