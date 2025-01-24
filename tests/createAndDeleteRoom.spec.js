const { test, expect } = require('@playwright/test');
const CommandPage = require('../pages/commandPage');
const AdminPage = require('../pages/adminPage');
const LoginPage = require('../pages/loginPage');
const adminPageProperties = require('../properties/adminPageProperties');

let uniqueRoomNumber; 
test.describe('Admin Room Management Suite', () => {
  let commandPage, adminPage, loginPage;

  test.beforeEach(async ({ page }) => {
    commandPage = new CommandPage(page);
    adminPage = new AdminPage(page, commandPage);
    loginPage = new LoginPage(page, commandPage);
    await adminPage.navigateToAdminPage(adminPageProperties.urls.adminPageURL);
    await loginPage.loginAsAdmin(
      adminPageProperties.credentials.correctUsername,
      adminPageProperties.credentials.correctPassword
    );
    uniqueRoomNumber = await adminPage.createUniqueRoom(adminPageProperties.roomDetails);
  });

  /* Test Case: Verify Room Creation
   * Verify that a room is successfully created and appears in the list of rooms.
   */
  test('Create a room and verify it', async ({ page }) => {
    const isRoomCreated = await adminPage.verifyRoomCreation(uniqueRoomNumber);
    expect(isRoomCreated).toBeTruthy();
  });

  /* Test Case: Delete a Created Room
   * Verify that the created room can be deleted successfully and no longer appears in the list.
   */
  test('Delete a created room and verify it is deleted', async ({ page }) => {
    await adminPage.deleteRoom(uniqueRoomNumber,expect);
  });
});
