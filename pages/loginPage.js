class LoginPage {
    constructor(page, commandPage) {
      this.page = page;
      this.commandPage = commandPage;
    }
  
    async login(username, password) {
      await this.page.fill(this.commandPage.usernameInput, username);
      await this.page.fill(this.commandPage.passwordInput, password);
      await this.page.click(this.commandPage.loginButton);
    }
  
    async getLoginErrorMessage() {
      return await this.page.textContent(this.commandPage.loginErrorText);
    }
  }
  
  module.exports = LoginPage;
  