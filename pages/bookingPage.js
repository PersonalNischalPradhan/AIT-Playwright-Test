class BookingPage {
    constructor(page, commandPage) {
      this.page = page;
      this.commandPage = commandPage;
    }
  
    // Navigate to the booking page
    async navigateToBookingPage() {
      await this.page.goto(this.commandPage.bookingPageUrl);
    }
  
    // Fill in booking details
    async fillBookingDetails(firstName, lastName, email, phone, bookingDate) {
      await this.page.fill(this.commandPage.bookingFirstNameInput, firstName);
      await this.page.fill(this.commandPage.bookingLastnameInput, lastName);
      await this.page.fill(this.commandPage.bookingEmailInput, email);
      await this.page.fill(this.commandPage.bookingPhone, phone);
      await this.page.fill(this.commandPage.bookingDateInput, bookingDate);
    }
  
    // Submit the booking
    async submitBooking() {
      const submitButton = await this.page.locator(this.commandPage.submitBookingButton);
      await submitButton.click();
    }
  
    // Verify error messages if form is not filled correctly
    async verifyErrorMessages() {
      const errorMessages = await this.page.locator(this.commandPage.errorMessages).allTextContents();
      return errorMessages;
    }
  
    // Verify booking success
    async verifyBookingSuccess() {
      const confirmationMessage = await this.page.locator(this.commandPage.confirmationMessage);
      return await confirmationMessage.textContent();
    }
  }
  
  module.exports = BookingPage;
  