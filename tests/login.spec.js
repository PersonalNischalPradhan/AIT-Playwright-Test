const { test, expect } = require('@playwright/test');
const CommandPage = require('../pages/commandPage');
const LoginPage = require('../pages/loginPage');
const AdminPage = require('../pages/adminPage');
const adminPageProperties = require('../properties/adminPageProperties');

let commandPage, loginPage, adminPage;

test.describe('Admin Login Suite', () => {
  test.beforeEach(async ({ page }) => {
    commandPage = new CommandPage(page);
    loginPage = new LoginPage(page, commandPage);
    adminPage = new AdminPage(page, commandPage);
    await page.goto(adminPageProperties.urls.adminPageURL);
    await adminPage.enableHacking();
  });

  async function verifyLoginFailure(page) {
    await expect(page.locator('.navbar')).not.toContainText(adminPageProperties.logoutButton.logout);
    await expect(page.locator(commandPage.usernameInput)).toHaveCSS(adminPageProperties.borderValue.border, adminPageProperties.borderValue.redColourValue); // Matches red border
    await expect(page.locator(commandPage.passwordInput)).toHaveCSS(adminPageProperties.borderValue.border,  adminPageProperties.borderValue.redColourValue); // Matches red border
  }

  /* Test Case: Login with Valid Username and Valid Password
   * Verify that the user can log in successfully using valid credentials.
   * The test ensures the presence of the "Logout" button in the navbar after login.
   */
  test('Login with valid username and valid password', async ({ page }) => {
    await loginPage.loginAsAdmin(adminPageProperties.credentials.correctUsername, adminPageProperties.credentials.correctPassword);
    await expect(page.locator('.navbar')).toContainText('Logout'); //verify login
  });

  /* Test Case: Login with Valid Username and Invalid Password
   * Verify that login fails when using a valid username with an incorrect password.
   * Ensure error indicators (like red borders) are displayed and no "Logout" button is visible.
   */
  test('Login with valid username and invalid password', async ({ page }) => {
    await loginPage.loginAsAdmin(adminPageProperties.credentials.correctUsername, adminPageProperties.credentials.wrongPassword);
    await verifyLoginFailure(page);
  });

  /* Test Case: Login with Invalid Username and Valid Password
   * Verify that login fails when using an invalid username with a correct password.
   * Ensure error indicators (like red borders) are displayed and no "Logout" button is visible.
   */
  test('Login with invalid username and valid password', async ({ page }) => {
    await loginPage.loginAsAdmin(adminPageProperties.credentials.wrongUsername, adminPageProperties.credentials.correctPassword);
    await verifyLoginFailure(page);
  });

  /* Test Case: Login with Invalid Username and Invalid Password
   * Verify that login fails when both username and password are incorrect.
   * Ensure error indicators (like red borders) are displayed and no "Logout" button is visible.
   */
  test('Login with invalid username and invalid password', async ({ page }) => {
    await loginPage.loginAsAdmin(adminPageProperties.credentials.wrongUsername, adminPageProperties.credentials.wrongPassword);
    await verifyLoginFailure(page);
  });

  /* Test Case: Login with Blank Username and Valid Password
   * Verify that login fails when the username is left blank but the password is valid.
   * Ensure error indicators (like red borders) are displayed and no "Logout" button is visible.
   */
  test('Login with blank username and valid password', async ({ page }) => {
    await loginPage.loginAsAdmin('', adminPageProperties.credentials.correctPassword);
    await verifyLoginFailure(page);
  });

  /* Test Case: Login with Valid Username and Blank Password
   * Verify that login fails when the username is correct but the password is left blank.
   * Ensure error indicators (like red borders) are displayed and no "Logout" button is visible.
   */
  test('Login with valid username and blank password', async ({ page }) => {
    await loginPage.loginAsAdmin(adminPageProperties.credentials.correctUsername, '');
    await verifyLoginFailure(page);
  });
});
