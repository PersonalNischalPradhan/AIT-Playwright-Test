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

async function createUniqueRoom(page, adminPage) {
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

async function editRoomDetails(page, roomNumber) {
  const roomElement = page.locator(`#roomName${roomNumber}`);
  await roomElement.scrollIntoViewIfNeeded();
  await expect(roomElement).toBeVisible();

  await roomElement.click();
  await page.locator('button.btn.btn-outline-primary.float-right:has-text("Edit")').click();

  // Edit room details
  await page.fill('#roomName', `Updated Room ${roomNumber}`); // Update the room name
  await page.fill('#roomPrice', '300'); // Update the room price
  await page.selectOption('#type', 'Double'); // Update the room type
  await page.selectOption('#accessible', 'false'); // Update accessibility to false
  await page.fill('#description', 'This is an edited room script');

  // Submit the form
  const updateButton = page.locator('#update');
  await expect(updateButton).toBeVisible();
  await updateButton.click();
}

// Test Suite
test.describe('Admin Room Management Suite', () => {
  test.beforeEach(async ({ page }) => {
    const commandPage = new CommandPage(page);
    const loginPage = new LoginPage(page, commandPage);
    const adminPage = new AdminPage(page, commandPage);

    await navigateToAdminPage(page, adminPage);
    await loginAsAdmin(page, loginPage);
    await createUniqueRoom(page, adminPage);
  });

  test('Create a room and verify it', async ({ page }) => {
    const isRoomCreated = await verifyRoomCreation(page, uniqueRoomNumber);
    if (!isRoomCreated) {
      throw new Error(
        `${adminPageProperties.errorMessages.roomCreationFailure} for room: ${uniqueRoomNumber}`
      );
    }
  });

  test('Edit a created room and verify changes', async ({ page }) => {
    await editRoomDetails(page, uniqueRoomNumber);
    console.log(`Room ${uniqueRoomNumber} edited successfully!`);
  });
});
