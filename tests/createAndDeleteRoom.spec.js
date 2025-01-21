const { test, expect } = require('@playwright/test');
const CommandPage = require('../pages/commandPage');
const AdminPage = require('../pages/adminPage');
const LoginPage = require('../pages/loginPage');
const adminPageProperties = require('../properties/adminPageProperties');

let uniqueRoomNumber; // Declare outside tests to share the value

test.describe('Admin Room Management Suite', () => {
    test.beforeEach(async ({ page }) => {
        const commandPage = new CommandPage(page);
        const loginPage = new LoginPage(page, commandPage);
        const adminPage = new AdminPage(page, commandPage);

        // Step 1: Navigate to admin page and enable hacking
        await page.goto(adminPageProperties.urls.adminPage);
        await adminPage.enableHacking();

        // Step 2: Log in as admin
        const { correctUsername, correctPassword } = adminPageProperties.credentials;
        await loginPage.login(correctUsername, correctPassword);
        await page.waitForSelector(commandPage.createRoomButton); // Wait for "Create Room" button

        // Step 3: Generate a unique room number and create a new room
        uniqueRoomNumber = Math.floor(Math.random() * 1000) + 100; // Random number between 100 and 1099
        const { defaultType, defaultAccessibility, defaultPrice, defaultFeatures } = adminPageProperties.roomDetails;

        await adminPage.createRoom(
            uniqueRoomNumber.toString(),
            defaultType,
            defaultAccessibility,
            defaultPrice,
            defaultFeatures
        );
    });

    test('Create a room and verify it', async ({ page }) => {
        const isRoomCreated = await verifyRoomCreation(page, uniqueRoomNumber);
        if (!isRoomCreated) throw new Error(`${adminPageProperties.errorMessages.roomCreationFailure} for room: ${uniqueRoomNumber}`);
    });

    test('Delete a created room and verify it is deleted', async ({ page }) => {
        const adminPage = new AdminPage(page);

        // Locate the room name by its ID
        const roomElement = page.locator(`#roomName${uniqueRoomNumber}`);
        await expect(roomElement).toBeVisible();

        // Scroll the room element into view (if necessary)
        await roomElement.scrollIntoViewIfNeeded();

        // Locate the delete button associated with the room
        const deleteButton = page.locator(`#roomName${uniqueRoomNumber}`).locator('..').locator('..').locator('.roomDelete');
        await expect(deleteButton).toBeVisible();

        // Click the delete button
        await deleteButton.click();

        // Verify that the room has been deleted
        await expect(page.locator(`#roomName${uniqueRoomNumber}`)).not.toBeVisible();

        console.log(`Room ${uniqueRoomNumber} deleted successfully!`);
    });


    // Helper function to verify room creation
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
});
