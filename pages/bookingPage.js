const bookingPageProperties = require('../properties/bookingPageProperties');

class BookingPage {
  constructor(page, commandPage) {
    this.page = page;
    this.commandPage = commandPage;
  }

  // Navigate to the booking page
  async navigateToBookingPage(adminPage) {
    await this.page.goto(bookingPageProperties.urls.bookingPageUrl);
    await adminPage.enableHacking(); 
  }

  // Book the first room
  async bookFirstRoom() {
    await this.page.locator(this.commandPage.bookThisRoomButton).first().click();
    await this.page.locator(this.commandPage.confirmBookButton).scrollIntoViewIfNeeded();
    await this.page.locator(this.commandPage.confirmBookButton).click({ force: true });
  }

  // Fill in booking details
  async fillBookingDetails(firstName, lastName, email, phone) {
    await this.page.fill(this.commandPage.bookingFirstNameInput, firstName);
    await this.page.fill(this.commandPage.bookingLastnameInput, lastName);
    await this.page.fill(this.commandPage.bookingEmailInput, email);
    await this.page.fill(this.commandPage.bookingPhone, phone);
  }

  // Verify error messages
  async verifyErrorMessages() {
    await this.page.waitForTimeout(2000); 
    const errorMessages = await this.page.locator(this.commandPage.errorMessages).allTextContents();
    console.log('Error Messages:', errorMessages);
    return errorMessages;
  }

  // Cancel the booking
  async cancelBooking() {
    const cancelButton = this.page.locator(this.commandPage.cancelBookButton);
    const text = await cancelButton.textContent();
    console.log('Cancel Button Text:', text);
    await cancelButton.scrollIntoViewIfNeeded();
    await cancelButton.click({ force: true });
  }
}

module.exports = BookingPage;
