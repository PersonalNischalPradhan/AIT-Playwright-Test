const { test, expect } = require('@playwright/test');
const CommandPage = require('../pages/commandPage');
const LoginPage = require('../pages/loginPage');
const HomePage = require('../pages/homePage');
const AdminPage = require('../pages/adminPage');
const bookingPageProperties = require('../properties/bookingPageProperties');

test.describe('Room Booking Suite', () => {
  test('Book a room using the unique room number', async ({ page }) => {
    const commandPage = new CommandPage(page);
    const loginPage = new LoginPage(page, commandPage);
    const homePage = new HomePage(page, commandPage);
    const adminPage = new AdminPage(page, commandPage);

    // Step 1: Navigate to the booking page
    await page.goto(bookingPageProperties.urls.bookingPageUrl);
    await adminPage.enableHacking();

    // Step 2: Attempt to book the first room
    const bookThisRoomButton = await page.locator('button:has-text("Book this room")').first();
    await bookThisRoomButton.click();

    const confirmBookButton = page.locator('button.book-room.btn-outline-primary');
    await confirmBookButton.scrollIntoViewIfNeeded();
    await confirmBookButton.click({ force: true });

    // Step 3: Fill in booking details with missing fields
    const bookingFirstNameInput = await page.locator('input[name="firstname"]');
    const bookingLastnameInput = await page.locator('input[name="lastname"]');
    const bookingEmailInput = await page.locator('input[name="email"]');
    const bookingPhone = await page.locator('input[name="phone"]');

    // Use details from the properties file
    await bookingFirstNameInput.fill(bookingPageProperties.bookingDetails.firstName);
    await bookingLastnameInput.fill(bookingPageProperties.bookingDetails.lastName);
    await bookingEmailInput.fill(bookingPageProperties.bookingDetails.email);
    await bookingPhone.fill(bookingPageProperties.bookingDetails.phone);

    // Step 4: Wait for error messages and verify
    await page.waitForTimeout(2000); // Adjust wait time if needed

    const errorMessages = await page.locator('.alert.alert-danger p').allTextContents();
    console.log('Error Messages:', errorMessages);

    // Assert error messages exist and match expectations
    expect(errorMessages.length).toBeGreaterThan(0); // At least one error message must exist
    expect(errorMessages).toContain('must not be null');
    expect(errorMessages).toContain('size must be between 11 and 21');
  });

  test('Book a room and cancel at the end', async ({ page }, testInfo) => {
    testInfo.annotations.push({ type: 'feature', description: 'Room Booking' }); // Allure label
    testInfo.annotations.push({ type: 'severity', description: 'minor' });

    const commandPage = new CommandPage(page);
    const loginPage = new LoginPage(page, commandPage);
    const homePage = new HomePage(page, commandPage);
    const adminPage = new AdminPage(page, commandPage);

    await test.step('Navigate to the booking page and enable hacking', async () => {
      await page.goto(bookingPageProperties.urls.bookingPageUrl);
      await adminPage.enableHacking();
    });

    await test.step('Attempt to book the first room', async () => {
      const bookThisRoomButton = await page.locator('button:has-text("Book this room")').first();
      await bookThisRoomButton.click();
    });

    // Step 3: Fill in booking details with missing fields
    const bookingFirstNameInput = await page.locator('input[name="firstname"]');
    const bookingLastnameInput = await page.locator('input[name="lastname"]');
    const bookingEmailInput = await page.locator('input[name="email"]');
    const bookingPhone = await page.locator('input[name="phone"]');

    // Use details from the properties file
    await bookingFirstNameInput.fill(bookingPageProperties.bookingDetails.firstName);
    await bookingLastnameInput.fill(bookingPageProperties.bookingDetails.lastName);
    await bookingEmailInput.fill(bookingPageProperties.bookingDetails.email);
    await bookingPhone.fill(bookingPageProperties.bookingDetails.phone);

    // Step 4: Wait for error messages and verify
    await page.waitForTimeout(2000); // Adjust wait time if needed

    await test.step('Cancel booking', async () => {
      const cancelButton = page.locator('button.book-room.btn-outline-danger');
      const text = await cancelButton.textContent();
      console.log('Cancel Button Text:', text);

      await cancelButton.scrollIntoViewIfNeeded();
      await cancelButton.click({ force: true });
    });
  });
});
