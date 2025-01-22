const { test, expect } = require('@playwright/test');
const CommandPage = require('../pages/commandPage');
const adminPageProperties = require('../properties/adminPageProperties');

// Helper Functions
async function loginWithCredentials(page, username, password) {
  const commandPage = new CommandPage(page);  // Move this inside the helper function
  await commandPage.adminPage.enableHacking();
  await commandPage.loginPage.login(username, password);
}

async function checkLoginFailure(page) {
  const commandPage = new CommandPage(page);  // Move this inside the helper function
  await expect(page.locator('.navbar')).not.toContainText('Logout');
  await expect(page.locator(commandPage.usernameInput)).toHaveCSS('border', /rgb\(255,\s?0,\s?0\)/); // Matches red border
  await expect(page.locator(commandPage.passwordInput)).toHaveCSS('border', /rgb\(255,\s?0,\s?0\)/); // Matches red border
}

async function checkLoginSuccess(page) {
  const commandPage = new CommandPage(page);  // Move this inside the helper function
  await expect(page.locator('.navbar')).toContainText('Logout');
}

test.describe('Admin Login Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(adminPageProperties.urls.adminPageURL);
  });

  test('Login with valid username and valid password', async ({ page }) => {
    await loginWithCredentials(page, adminPageProperties.credentials.correctUsername, adminPageProperties.credentials.correctPassword);
    await checkLoginSuccess(page);
  });

  test('Login with valid username and invalid password', async ({ page }) => {
    await loginWithCredentials(page, adminPageProperties.credentials.correctUsername, adminPageProperties.credentials.wrongPassword);
    await checkLoginFailure(page);
  });

  test('Login with invalid username and valid password', async ({ page }) => {
    await loginWithCredentials(page, adminPageProperties.credentials.wrongUsername, adminPageProperties.credentials.correctPassword);
    await checkLoginFailure(page);
  });

  test('Login with invalid username and invalid password', async ({ page }) => {
    await loginWithCredentials(page, adminPageProperties.credentials.wrongUsername, adminPageProperties.credentials.wrongPassword);
    await checkLoginFailure(page);
  });

  test('Login with blank username and valid password', async ({ page }) => {
    await loginWithCredentials(page, '', adminPageProperties.credentials.correctPassword);
    await checkLoginFailure(page);
  });

  test('Login with valid username and blank password', async ({ page }) => {
    await loginWithCredentials(page, adminPageProperties.credentials.correctUsername, '');
    await checkLoginFailure(page);
  });

});
