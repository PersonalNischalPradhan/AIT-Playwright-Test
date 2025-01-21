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
        await page.goto(adminPageProperties.urls.adminPageURL);
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

    test('Edit a created room and verify changes', async ({ page }) => {
        const adminPage = new AdminPage(page);

        // Locate the room name by its ID
        const roomElement = page.locator(`#roomName${uniqueRoomNumber}`);
             // Scroll the room element into view (if necessary)
             await roomElement.scrollIntoViewIfNeeded();
        await expect(roomElement).toBeVisible();
        await roomElement.click();
        await page.locator('button.btn.btn-outline-primary.float-right:has-text("Edit")').click();

        // Edit room details
        await page.fill('#roomName', `Updated Room ${uniqueRoomNumber}`); // Update the room name
        await page.fill('#roomPrice', '300'); // Update the room price
        await page.selectOption('#type', 'Double'); // Update the room type (e.g., Single, Double)
        await page.selectOption('#accessible','false'); // Update accessibility to true (if checkbox)
        await page.fill ('#description','this is an edit room script');

        // Update the form
        const updateButton = page.locator('#update');
        await expect(updateButton).toBeVisible();
        await updateButton.click();
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
