const { test, expect } = require('@playwright/test');
const CommandPage = require('../pages/commandPage');
const AdminPage = require('../pages/adminPage');
const LoginPage = require('../pages/loginPage');
const adminPageProperties = require('../properties/adminPageProperties');

let uniqueRoomNumber; 

test.describe('Admin Room Management Suite', () => {
  test.beforeEach(async ({ page }) => {
    const commandPage = new CommandPage(page);
    const loginPage = new LoginPage(page, commandPage);
    const adminPage = new AdminPage(page, commandPage);

    await adminPage.navigateToAdminPage();
    await loginPage.loginAsAdmin(
      adminPageProperties.credentials.correctUsername,
      adminPageProperties.credentials.correctPassword
    );
    await page.waitForSelector(commandPage.createRoomButton);
    uniqueRoomNumber = await adminPage.createUniqueRoom();
  });

  /* Test Case: Create a Room and Verify It
   * Verify that a new room can be created and is visible on the admin dashboard.
   */
  test('Create a room and verify it', async ({ page }) => {
    const adminPage = new AdminPage(page);
    const isRoomCreated = await adminPage.verifyRoomCreation(uniqueRoomNumber);
    if (!isRoomCreated) {
      throw new Error(
        `${adminPageProperties.errorMessages.roomCreationFailure} for room: ${uniqueRoomNumber}`
      );
    }
  });

  /* Test Case: Edit a Created Room and Verify Changes
   *  Verify that after editing the details of an existing room the changes are saved.
   */
  test('Edit a created room and verify changes', async ({ page }) => {
    const adminPage = new AdminPage(page);
    await adminPage.editRoomDetails(uniqueRoomNumber,expect);
    console.log(`Room ${uniqueRoomNumber} edited successfully!`);
  });
});