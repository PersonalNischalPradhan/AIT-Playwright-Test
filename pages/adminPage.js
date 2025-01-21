class AdminPage {
    constructor(page, commandPage) {
        this.page = page;
        this.commandPage = commandPage;
    }

    async enableHacking() {
        await this.page.click(this.commandPage.letMeHackButton);
    }

    async createRoom(roomNumber, roomType, roomAccessible, price, features) {
        await this.page.fill(this.commandPage.roomNumberInput, roomNumber);
        await this.page.selectOption(this.commandPage.roomTypeDropdown, roomType);
        await this.page.selectOption(this.commandPage.roomAccessibleDropdown, roomAccessible);
        await this.page.fill(this.commandPage.roomPriceInput, price);

        // Handle room features
        const featureSelectors = {
            WiFi: this.commandPage.featureWiFi,
            TV: this.commandPage.featureTV,
            Radio: this.commandPage.featureRadio,
            Refreshments: this.commandPage.featureRefreshments,
            Safe: this.commandPage.featureSafe,
            Views: this.commandPage.featureViews,
        };

        // Check only the features included in the input
        for (const feature of features) {
            if (featureSelectors[feature]) await this.page.check(featureSelectors[feature]);
        }

        // Click on the Create Room button
        await this.page.click(this.commandPage.createRoomButton, { force: true });
    }
}

module.exports = AdminPage;
