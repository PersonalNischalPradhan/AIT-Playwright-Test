const adminPageProperties = require('../properties/adminPageProperties');
class AdminPage {
    constructor(page, commandPage) {
        this.page = page;
        this.commandPage = commandPage;
    }
    async navigateToAdminPage() {
        await this.page.goto(adminPageProperties.urls.adminPageURL);
        await this.enableHacking();
    }
    async enableHacking() {
        await this.page.click(this.commandPage.letMeHackButton);
    }
    async createUniqueRoom() {
        const uniqueRoomNumber = Math.floor(Math.random() * 1000) + 100; // Generate a random number between 100 and 1099
        const { defaultType, defaultAccessibility, defaultPrice, defaultFeatures } = adminPageProperties.roomDetails;

        await this.createRoom(
            uniqueRoomNumber.toString(),
            defaultType,
            defaultAccessibility,
            defaultPrice,
            defaultFeatures
        );

        return uniqueRoomNumber;
    }
    async createRoom(roomNumber, roomType, roomAccessible, price, features) {
        await this.page.fill(this.commandPage.roomNumberInput, roomNumber);
        await this.page.selectOption(this.commandPage.roomTypeDropdown, roomType);
        await this.page.selectOption(this.commandPage.roomAccessibleDropdown, roomAccessible);
        await this.page.fill(this.commandPage.roomPriceInput, price);

        const featureSelectors = {
            WiFi: this.commandPage.featureWiFi,
            TV: this.commandPage.featureTV,
            Radio: this.commandPage.featureRadio,
            Refreshments: this.commandPage.featureRefreshments,
            Safe: this.commandPage.featureSafe,
            Views: this.commandPage.featureViews,
        };

        for (const feature of features) {
            if (featureSelectors[feature]) {
                await this.page.check(featureSelectors[feature]);
            }
        }
        await this.page.click(this.commandPage.createRoomButton, { force: true });
    }

    async verifyRoomCreation(roomNumber) {
        for (let i = 0; i < 5; i++) { // Retry up to 5 times
            const rooms = await this.page.locator('div[data-testid="roomlisting"]').all();
            for (const room of rooms) {
                const roomText = await room.textContent();
                if (roomText.includes(roomNumber.toString())) return true; // Room found
            }
            await this.page.waitForTimeout(1000);
        }
        return false; // Room not found
    }

    async editRoomDetails(roomNumber, expect) {
        const roomElement = this.page.locator(`#roomName${roomNumber}`);
        await roomElement.scrollIntoViewIfNeeded();
        await expect(roomElement).toBeVisible();
        await roomElement.click();
        await this.page.locator('button.btn.btn-outline-primary.float-right:has-text("Edit")').click();
        await this.page.fill('#roomName', `Updated Room ${roomNumber}`); // Update room name
        await this.page.fill('#roomPrice', '300'); // Update room price
        await this.page.selectOption('#type', 'Double'); // Update room type
        await this.page.selectOption('#accessible', 'false'); // Update accessibility
        await this.page.fill('#description', 'This is an edited room script');
        const updateButton = this.page.locator('#update');
        await expect(updateButton).toBeVisible();
        await updateButton.click();
    }
    async deleteRoom(roomNumber, expect) {
        const roomElement = this.page.locator(`#roomName${roomNumber}`);
        await expect(roomElement).toBeVisible();

        await roomElement.scrollIntoViewIfNeeded();

        const deleteButton = roomElement
            .locator('..') 
            .locator('..')
            .locator('.roomDelete');
        await expect(deleteButton).toBeVisible();
        await deleteButton.click();
        // Verify all elements with the room number are removed
        const roomElements = this.page.locator(`#roomName${roomNumber}`);
        await expect(roomElements).toHaveCount(0);
        // await expect(this.page.locator(`#roomName${roomNumber}`)).not.toBeVisible();
        console.log(`Room ${roomNumber} deleted successfully!`);
    }
}

module.exports = AdminPage;