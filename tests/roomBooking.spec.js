const { test, expect } = require('@playwright/test');
const CommandPage = require('../pages/commandPage');
const AdminPage = require('../pages/adminPage');
const BookingPage = require('../pages/bookingPage');
const bookingPageProperties = require('../properties/bookingPageProperties');
let commandPage, adminPage, bookingPage;

test.describe('Room Booking Suite', () => {
  test.beforeEach(async ({ page }) => {
    commandPage = new CommandPage(page);
    adminPage = new AdminPage(page, commandPage);
    bookingPage = new BookingPage(page, commandPage);
  });

  /* Verify Room Booking with Unique Room Number:
* Verify that a user can book a room using the unique room number and receive appropriate error messages when filling in the booking details.
*/
  test('Book a room using the unique room number', async ({ page }) => {

    await bookingPage.navigateToBookingPage(adminPage);
    await bookingPage.bookFirstRoom();
    await bookingPage.fillBookingDetails(bookingPageProperties.bookingDetails.firstName, bookingPageProperties.bookingDetails.lastName, bookingPageProperties.bookingDetails.email, bookingPageProperties.bookingDetails.phone);

    const errorMessages = await bookingPage.verifyErrorMessages();
    console.log('Error Messages:', errorMessages);

    expect(errorMessages.length).toBeGreaterThan(0);
    expect(errorMessages).toContain('must not be null');
    expect(errorMessages).toContain('size must be between 11 and 21');
  });

  /* Verify Room Booking and Cancel at the End:
* Verify that a user can book a room, fill in the details, and cancel the booking successfully.
*/
  test('Book a room and cancel at the end', async ({ page }, testInfo) => {
    testInfo.annotations.push({ type: 'feature', description: 'Room Booking' });
    testInfo.annotations.push({ type: 'severity', description: 'minor' });

    await bookingPage.navigateToBookingPage(adminPage);
    await test.step('Attempt to book the first room', async () => {
      await bookingPage.bookFirstRoom();
    });
    await bookingPage.fillBookingDetails(bookingPageProperties.bookingDetails.firstName, bookingPageProperties.bookingDetails.lastName, bookingPageProperties.bookingDetails.email, bookingPageProperties.bookingDetails.phone);
    await test.step('Cancel booking', async () => {
      await bookingPage.cancelBooking();
    });
  });
});
