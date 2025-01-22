const { test, expect } = require('@playwright/test');
const CommandPage = require('../pages/commandPage');
const AdminPage = require('../pages/adminPage');
const bookingPageProperties = require('../properties/bookingPageProperties');

// Utility methods
async function navigateToBookingPage(page, adminPage) {
  await page.goto(bookingPageProperties.urls.bookingPageUrl);
  await adminPage.enableHacking();
}

async function bookFirstRoom(page, commandPage) {
  await page.locator(commandPage.bookThisRoomButton).first().click();
  await page.locator(commandPage.confirmBookButton).scrollIntoViewIfNeeded();
  await page.locator(commandPage.confirmBookButton).click({ force: true });
}

async function fillBookingDetails(page, commandPage, bookingDetails) {
  await page.locator(commandPage.bookingFirstNameInput).fill(bookingDetails.firstName);
  await page.locator(commandPage.bookingLastnameInput).fill(bookingDetails.lastName);
  await page.locator(commandPage.bookingEmailInput).fill(bookingDetails.email);
  await page.locator(commandPage.bookingPhone).fill(bookingDetails.phone);
}

async function verifyErrorMessages(page, commandPage) {
  await page.waitForTimeout(2000); // Adjust wait time if needed
  const errorMessages = await page.locator(commandPage.errorMessages).allTextContents();
  console.log('Error Messages:', errorMessages);

  expect(errorMessages.length).toBeGreaterThan(0); // At least one error message must exist
  expect(errorMessages).toContain('must not be null');
  expect(errorMessages).toContain('size must be between 11 and 21');
}

async function cancelBooking(page, commandPage) {
  const cancelButton = page.locator(commandPage.cancelBookButton);
  const text = await cancelButton.textContent();
  console.log('Cancel Button Text:', text);

  await cancelButton.scrollIntoViewIfNeeded();
  await cancelButton.click({ force: true });
}

// Tests
test.describe('Room Booking Suite', () => {
  test('Book a room using the unique room number', async ({ page }) => {
    const commandPage = new CommandPage(page);
    const adminPage = new AdminPage(page, commandPage);

    await navigateToBookingPage(page, adminPage);
    await bookFirstRoom(page, commandPage);
    await fillBookingDetails(page, commandPage, bookingPageProperties.bookingDetails);
    await verifyErrorMessages(page, commandPage);
  });

  test('Book a room and cancel at the end', async ({ page }, testInfo) => {
    testInfo.annotations.push({ type: 'feature', description: 'Room Booking' });
    testInfo.annotations.push({ type: 'severity', description: 'minor' });

    const commandPage = new CommandPage(page);
    const adminPage = new AdminPage(page, commandPage);

    await navigateToBookingPage(page, adminPage);

    await test.step('Attempt to book the first room', async () => {
      await bookFirstRoom(page, commandPage);
    });

    await fillBookingDetails(page, commandPage, bookingPageProperties.bookingDetails);

    await test.step('Cancel booking', async () => {
      await cancelBooking(page, commandPage);
    });
  });
});
