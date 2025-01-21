const bookingPageProperties = require('../properties/bookingPageProperties');
class BookingPage {
  constructor(page, commandPage) {
    this.page = page;
    this.commandPage = commandPage;
  }

  // Navigate to the booking page
  async navigateToBookingPage() {
    await this.page.goto(bookingPageProperties.urls.bookingPageUrl);
  }

  // Fill in booking details
  async fillBookingDetails(firstName, lastName, email, phone) {
    await this.page.fill(this.commandPage.bookingFirstNameInput, firstName);
    await this.page.fill(this.commandPage.bookingLastnameInput, lastName);
    await this.page.fill(this.commandPage.bookingEmailInput, email);
    await this.page.fill(this.commandPage.bookingPhone, phone);
  }

  // Submit the booking
  async submitBooking() {
    const submitButton = this.page.locator(this.commandPage.submitBookingButton);
    await submitButton.scrollIntoViewIfNeeded();
    await submitButton.click({ force: true });
  }

  // Verify error messages
  async verifyErrorMessages() {
    return await this.page.locator(this.commandPage.errorMessages).allTextContents();
  }
}

module.exports = BookingPage;
