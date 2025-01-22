const LoginPage = require('./loginPage');
const HomePage = require('./homePage');
const AdminPage = require('./adminPage');
const BookingPage = require('./bookingPage');

class CommandPage {
  constructor(page) {
    this.page = page;

    // Login Page Selectors
    this.usernameInput = '#username'; 
    this.passwordInput = '#password';
    this.loginButton = '#doLogin';
    this.loginErrorText = '.alert-danger';

    // Home Page Selectors
    this.inventoryItemName = '.row.room-name';
    this.inventoryItemPrice = '.row .room-price';
    this.roomBookButton = '.row .book-room';

    // Room Creation Selectors
    this.letMeHackButton = 'button:has-text("Let me hack!")'; 
    this.roomNumberInput = '#roomName'; 
    this.roomTypeDropdown = '#type'; 
    this.roomAccessibleDropdown = '#accessible'; 
    this.roomPriceInput = '#roomPrice'; 
    this.roomFeaturesInput = '#features'; 
    this.saveRoomButton = 'button#saveRoom'; 
    this.createRoomButton = 'button#createRoom'; 

    // Room Features Checkboxes
    this.featureWiFi = '#wifiCheckbox'; 
    this.featureTV = '#tvCheckbox'; 
    this.featureRadio = '#radioCheckbox'; 
    this.featureRefreshments = '#refreshmentsCheckbox'; 
    this.featureSafe = '#safeCheckbox'; 
    this.featureViews = '#viewsCheckbox'; 

    // Selectors for the booking page
    this.bookingFirstNameInput = 'input[name="firstname"]';
    this.bookingLastnameInput = 'input[name="lastname"]';
    this.bookingEmailInput = 'input[name="email"]';
    this.bookingPhone = 'input[name="phone"]';
    this.bookingDateInput = 'input[name="bookingDate"]';
    this.submitBookingButton = 'button.book-room';
    this.confirmationMessage = '.confirmation-message';
    this.errorMessages = '.alert.alert-danger p';
    this.bookThisRoomButton  = 'button:has-text("Book this room")';
    this.confirmBookButton ='button.book-room.btn-outline-primary';
    this.cancelBookButton ='button.book-room.btn-outline-danger';


    
    // Initialize pages
    this.loginPage = new LoginPage(page, this);
    this.homePage = new HomePage(page, this);
    this.adminPage = new AdminPage(page, this);
    this.bookingPage= new BookingPage(page,this);



  }
}

module.exports = CommandPage;
