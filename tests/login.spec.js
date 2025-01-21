const { test, expect } = require('@playwright/test');
const CommandPage = require('../pages/commandPage');
const adminPageProperties = require('../properties/adminPageProperties');

test.describe('Admin Login Suite', () => {

    test.beforeEach(async ({ page }) => {
        const commandPage = new CommandPage(page); // instantiate CommandPage
        await page.goto(adminPageProperties.urls.adminPageURL);
    });

    test('Login with valid username and valid password', async ({ page }) => {
        const commandPage = new CommandPage(page);
        await commandPage.adminPage.enableHacking();
        await commandPage.loginPage.login(adminPageProperties.credentials.correctUsername, adminPageProperties.credentials.correctPassword);

        await expect(page.locator('.navbar')).toContainText('Logout');
    });

    test('Login with valid username and invalid password', async ({ page }) => {
        const commandPage = new CommandPage(page);
        await commandPage.adminPage.enableHacking();
        await commandPage.loginPage.login(
            adminPageProperties.credentials.correctUsername,
            adminPageProperties.credentials.wrongPassword
        );
    
        // Verify that the navbar does not contain "Logout"
        await expect(page.locator('.navbar')).not.toContainText('Logout');
    
        // Verify that the username and password inputs have a red border
        await expect(page.locator(commandPage.usernameInput)).toHaveCSS('border', /rgb\(255,\s?0,\s?0\)/); // Matches red border
        await expect(page.locator(commandPage.passwordInput)).toHaveCSS('border', /rgb\(255,\s?0,\s?0\)/); // Matches red border
    });
    
    

    test('Login with invalid username and valid password', async ({ page }) => {
        const commandPage = new CommandPage(page);
        await commandPage.adminPage.enableHacking();
        await commandPage.loginPage.login(adminPageProperties.credentials.wrongUsername, adminPageProperties.credentials.correctPassword);

        // Check for error message or lack of "Logout" in navbar
        await expect(page.locator('.navbar')).not.toContainText('Logout');

                // Verify that the username and password inputs have a red border
                await expect(page.locator(commandPage.usernameInput)).toHaveCSS('border', /rgb\(255,\s?0,\s?0\)/); // Matches red border
                await expect(page.locator(commandPage.passwordInput)).toHaveCSS('border', /rgb\(255,\s?0,\s?0\)/); // Matches red border
    });
    
    test('Login with invalid username and invalid password', async ({ page }) => {
        const commandPage = new CommandPage(page);
        await commandPage.adminPage.enableHacking();
        await commandPage.loginPage.login(adminPageProperties.credentials.wrongUsername, adminPageProperties.credentials.wrongPassword);
    
        // Check for error message or lack of "Logout" in navbar
        await expect(page.locator('.navbar')).not.toContainText('Logout');
                // Verify that the username and password inputs have a red border
                await expect(page.locator(commandPage.usernameInput)).toHaveCSS('border', /rgb\(255,\s?0,\s?0\)/); // Matches red border
                await expect(page.locator(commandPage.passwordInput)).toHaveCSS('border', /rgb\(255,\s?0,\s?0\)/); // Matches red border
    });
    
    test('Login with blank username and valid password', async ({ page }) => {
        const commandPage = new CommandPage(page);
        await commandPage.adminPage.enableHacking();
        await commandPage.loginPage.login('', adminPageProperties.credentials.correctPassword);
    
        // Check for error message or lack of "Logout" in navbar
        await expect(page.locator('.navbar')).not.toContainText('Logout');
                // Verify that the username and password inputs have a red border
                await expect(page.locator(commandPage.usernameInput)).toHaveCSS('border', /rgb\(255,\s?0,\s?0\)/); // Matches red border
                await expect(page.locator(commandPage.passwordInput)).toHaveCSS('border', /rgb\(255,\s?0,\s?0\)/); // Matches red border
    });
    
    test('Login with valid username and blank password', async ({ page }) => {
        const commandPage = new CommandPage(page);
        await commandPage.adminPage.enableHacking();
        await commandPage.loginPage.login(adminPageProperties.credentials.correctUsername, '');
    
        // Check for error message or lack of "Logout" in navbar
        await expect(page.locator('.navbar')).not.toContainText('Logout');
                // Verify that the username and password inputs have a red border
                await expect(page.locator(commandPage.usernameInput)).toHaveCSS('border', /rgb\(255,\s?0,\s?0\)/); // Matches red border
                await expect(page.locator(commandPage.passwordInput)).toHaveCSS('border', /rgb\(255,\s?0,\s?0\)/); // Matches red border
    });
    

});
