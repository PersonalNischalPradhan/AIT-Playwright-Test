const { test, expect } = require('@playwright/test');
const CommandPage = require('../pages/commandPage');
const AdminPage = require('../pages/adminPage');
const LoginPage = require('../pages/loginPage');
const adminPageProperties = require('../properties/adminPageProperties');

let uniqueRoomNumber; // Declare outside tests to share the value

// Helper Functions
async function navigateToAdminPage(page, adminPage) {
  await page.goto(adminPageProperties.urls.adminPageURL);
  await adminPage.enableHacking();
}

async function loginAsAdmin(page, loginPage) {
  const { correctUsername, correctPassword } = adminPageProperties.credentials;
  await loginPage.login(correctUsername, correctPassword);
  await page.waitForSelector('#createRoom'); // Wait for "Create Room" button
}

async function createUniqueRoom(page, adminPage, commandPage) {
  uniqueRoomNumber = Math.floor(Math.random() * 1000) + 100; // Random number between 100 and 1099
  const { defaultType, defaultAccessibility, defaultPrice, defaultFeatures } = adminPageProperties.roomDetails;

  await adminPage.createRoom(
    uniqueRoomNumber.toString(),
    defaultType,
    defaultAccessibility,
    defaultPrice,
    defaultFeatures
  );
}

async function verifyRoomCreation(page, roomNumber) {
  for (let i = 0; i < 5; i++) { // Retry up to 5 times
    const rooms = await page.locator('div[data-testid="roomlisting"]').all();
    for (const room of rooms) {
      const roomText = await room.textContent();
      if (roomText.includes(roomNumber.toString())) return true; // Room found
    }
    await page.waitForTimeout(1000); // Wait 1 second before retrying
  }
  return false; // Room not found
}

async function deleteRoom(page, roomNumber) {
  const roomElement = page.locator(`#roomName${roomNumber}`);
  await expect(roomElement).toBeVisible();

  await roomElement.scrollIntoViewIfNeeded();

  const deleteButton = page
    .locator(`#roomName${roomNumber}`)
    .locator('..')
    .locator('..')
    .locator('.roomDelete');
  await expect(deleteButton).toBeVisible();
  await deleteButton.click();

  await expect(page.locator(`#roomName${roomNumber}`)).not.toBeVisible();
  console.log(`Room ${roomNumber} deleted successfully!`);
}

// Test Suite
test.describe('Admin Room Management Suite', () => {
  test.beforeEach(async ({ page }) => {
    const commandPage = new CommandPage(page);
    const loginPage = new LoginPage(page, commandPage);
    const adminPage = new AdminPage(page, commandPage);

    await navigateToAdminPage(page, adminPage);
    await loginAsAdmin(page, loginPage);
    await createUniqueRoom(page, adminPage, commandPage);
  });

  test('Create a room and verify it', async ({ page }) => {
    const isRoomCreated = await verifyRoomCreation(page, uniqueRoomNumber);
    if (!isRoomCreated) {
      throw new Error(
        `${adminPageProperties.errorMessages.roomCreationFailure} for room: ${uniqueRoomNumber}`
      );
    }
  });

  test('Delete a created room and verify it is deleted', async ({ page }) => {
    await deleteRoom(page, uniqueRoomNumber);
  });
});
