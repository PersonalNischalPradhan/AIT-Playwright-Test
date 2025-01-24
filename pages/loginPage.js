class LoginPage {
  constructor(page, commandPage) {
    this.page = page;
    this.commandPage = commandPage;
  }

  async loginAsAdmin(username, password) {
    await this.page.fill(this.commandPage.usernameInput, username);
    await this.page.fill(this.commandPage.passwordInput, password);
    await this.page.click(this.commandPage.loginButton);
  }
  async checkLoginSuccess() {
    await expect(this.page.locator('.navbar')).toContainText('Logout');
  }
}

module.exports = LoginPage;