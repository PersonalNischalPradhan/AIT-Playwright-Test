
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
    await page.goto(bookingPageProperties.urls.bookingPage);
    await adminPage.enableHacking();

    // Step 2: Attempt to book the first room
    const bookThisRoomButton = await page.locator('button:has-text("Book this room")').first();



    await bookThisRoomButton.click();

    const confirmBookButton = page.locator('button.book-room.btn-outline-primary');

    const text = await confirmBookButton.textContent();
    console.log('This will print the text content of the confirmBookButton' + text);  // This will print the text content of the confirmBookButton

    await confirmBookButton.scrollIntoViewIfNeeded();  // Scroll to the button


    // Step 3: Fill in booking details (only partially or skip required fields to simulate error)
    const bookingFirstNameInput = await page.locator('input[name="firstname"]');
    const bookingLastnameInput = await page.locator('input[name="lastname"]');
    const bookingEmailInput = await page.locator('input[name="email"]');
    const bookingPhone = await page.locator('input[name="phone"]');

    // Fill only partial information to trigger errors
    await bookingFirstNameInput.fill('Johnyytest123');
    await bookingLastnameInput.fill('Chamlingtest123'); // Leave last name empty
    await bookingEmailInput.scrollIntoViewIfNeeded();
    await bookingEmailInput.fill('johncham@tets.com'); // Leave email empty
    await bookingPhone.fill('0304040505'); // Leave phone empty

    // Step 4: Click the second "Book" button
    await page.waitForTimeout(10000); // Wait for 10 seconds

    await confirmBookButton.click({ force: true });

    await page.waitForTimeout(1000); // Wait for 10 seconds

    console.log('confirm button is clicked');

    // Step 5: Verify error messages
    await page.waitForTimeout(2000); // Wait for errors to display
    const errorMessages = await page.locator('.alert.alert-danger p').allTextContents();

    console.log('Error Messages:', errorMessages); // Debugging output

    // Assert error messages exist and match expected
    expect(errorMessages.length).toBeGreaterThan(0); // At least one error message must exist

    // Validate that error messages contain 'must not be null' and 'size must be between 11 and 21'
    expect(errorMessages).toContain('must not be null');
    expect(errorMessages).toContain('size must be between 11 and 21');


  });

  test('Book a room using the unique room number and cancel at the end', async ({ page }) => {
    const commandPage = new CommandPage(page);
    const loginPage = new LoginPage(page, commandPage);
    const homePage = new HomePage(page, commandPage);
    const adminPage = new AdminPage(page, commandPage);

    // Step 1: Navigate to the booking page
    await page.goto(bookingPageProperties.urls.bookingPage);
    await adminPage.enableHacking();

    // Step 2: Attempt to book the first room
    const bookThisRoomButton = await page.locator('button:has-text("Book this room")').first();



    await bookThisRoomButton.click();

    const cancelButton = page.locator('button.book-room.btn-outline-danger');


    const text = await cancelButton.textContent();
    console.log('This will print the text content of the cancelButton' + text);  // This will print the text content of the confirmBookButton

    await cancelButton.scrollIntoViewIfNeeded();  // Scroll to the button


    // Step 3: Fill in booking details (only partially or skip required fields to simulate error)
    const bookingFirstNameInput = await page.locator('input[name="firstname"]');
    const bookingLastnameInput = await page.locator('input[name="lastname"]');
    const bookingEmailInput = await page.locator('input[name="email"]');
    const bookingPhone = await page.locator('input[name="phone"]');

    // Fill only partial information to trigger errors
    await bookingFirstNameInput.fill('Johnyytest123');
    await bookingLastnameInput.fill('Chamlingtest123'); // Leave last name empty
    await bookingEmailInput.scrollIntoViewIfNeeded();
    await bookingEmailInput.fill('johncham@tets.com'); // Leave email empty
    await bookingPhone.fill('0304040505'); // Leave phone empty

    // Step 4: Click the second "Book" button
    await page.waitForTimeout(10000); // Wait for 10 seconds

    await cancelButton.click({ force: true });

    await page.waitForTimeout(1000); // Wait for 10 seconds

    console.log('cancelButton  is clicked');

  });
})

