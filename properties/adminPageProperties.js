module.exports = {
    urls: {
        adminPageURL: 'https://automationintesting.online/#/admin',
    },
    credentials: {
        correctUsername: 'admin',
        correctPassword: 'password',
        wrongPassword:'test123',
        wrongUsername:'ttttteee',
    },
    roomDetails: {
        defaultType: 'Single',
        defaultAccessibility: 'true',
        defaultPrice: '150',
        defaultFeatures: ['WiFi', 'TV', 'Safe'],
    },
    errorMessages: {
        roomCreationFailure: 'Room creation verification failed!',
    },
};
