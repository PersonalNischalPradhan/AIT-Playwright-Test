class HomePage {
    constructor(page, commandPage) {
      this.page = page;
      this.commandPage = commandPage;
    }
  
    async bookFirstRoom() {
      await this.page.click(this.commandPage.roomBookButton);
    }
  
    async getFirstRoomName() {
      return await this.page.textContent(this.commandPage.inventoryItemName);
    }
  
    async getFirstRoomPrice() {
      return await this.page.textContent(this.commandPage.inventoryItemPrice);
    }
  }
  
  module.exports = HomePage;
  