AIT-Playwright-Test read me
```markdown
# AIT-Playwright-Tests

## Project Overview
AIT-Playwright-Tests is an automated testing project using Playwright and JavaScript to test the automationintesting application. This project demonstrates how to implement end-to-end testing and includes accessibility testing for enhanced coverage. The project is set up to automatically run tests whenever changes are pushed to the dev branch or a pull request is made, ensuring seamless integration and cost efficiency.

### Contents - Instructions to run this Project in your local:
- Features
- Prerequisites
- Installation
- Usage
- Running Tests
  - Running Tests Locally
  - Generating Allure Reports
  - Running Tests Automatically on GitHub
  - Running Tests Manually on GitHub
- Accessibility Testing
- Final Note

---

### Features
- Cross-browser testing with Playwright.
- End-to-end automated tests for various user interactions.
- Accessibility testing using `axe-playwright` with detailed HTML reports, including charts and status bars.
- GitHub Actions integration for automated testing on every commit/pull request.
- Screenshots and video recordings of test runs during failures (can be customized).
- HTML and Allure report generation for enhanced test visibility.
- Consolidated reports: Accessibility, HTML, and Allure.

---

### Prerequisites
Before you begin, ensure that you have the following installed on your system:
- Node.js (v20 or later)
- npm (Node package manager)

#### i) Install Node.js
Download and install Node.js from the official website. Choose version v20 or later.

#### ii) Set Environment Variables
For Windows:
1. Click on the Windows icon, type “Env,” and click on “Edit Environment Variables for your Account.”
2. Enter the following Environment Variables:
   - `NODE_HOME → C:\Program Files\nodejs`
   - `PATH → C:\Program Files\nodejs;`

---

### Installation
To get started, clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/PersonalNischalPradhan/AIT-Playwright-Test.git

cd AIT-Playwright-Tests
```

1. Launch **Visual Studio Code**.
2. Open the Project Folder:
   - Go to **File > Open Folder**.
   - Navigate to the folder where the repository was cloned.
3. Install Playwright Dependencies:
   - Open a terminal in Visual Studio Code (**Terminal > New Terminal**).
   - Run:
     ```bash
     npm install
     ```
   - If dependencies are missing, you may encounter `MODULE_NOT_FOUND`. Ensure `npm install` is run.

---

### Usage
To execute tests, use the following command:
```bash
npx playwright test
```

---

### Running Tests

#### Running Tests Locally
To run tests locally, execute:
```bash
npx playwright test
```

Generate and view an HTML report by running:
```bash
npx playwright test --reporter=html
```

You can also run tests in:
- **Headless mode** (useful for CI/CD pipelines):
  ```bash
  npx playwright test --headless
  ```
- **Headed mode** (view browser interactions):
  ```bash
  npx playwright test --headed
  ```

#### Generating Allure Reports
Generate and view Allure reports using the following commands:
1. Generate the Allure report:
   ```bash
   allure generate allure-results --clean
   ```
2. Serve the report locally:
   ```bash
   allure serve
   ```

#### Running Tests Automatically on GitHub
This project is set up to automatically run tests whenever changes are pushed to the `dev` branch or a pull request is made.  
The `.github/workflows/playwright-tests.yml` file is configured to:
- Checkout the code.
- Set up Node.js.
- Install dependencies.
- Run Playwright and accessibility tests.
- Generate and upload consolidated test reports.

The tests are triggered automatically on:
- Any push to the `dev` branch.
- Any pull request targeting the `dev` branch.

#### Running Tests Manually on GitHub
You can manually trigger the workflow from the **GitHub Actions** tab.  
- After the tests run, check the **GitHub Actions** page for results.
- Download artifacts (e.g., `accessibility-report.zip`, `playwright-report.zip`, `allure-report.zip`).
- Extract the desired report zip file and open the corresponding `index.html` in your browser to view the report.

---

### Accessibility Testing
The project includes accessibility testing using the `axe-playwright` library:
- Violations are captured and reported with details like impact, affected nodes, and help links.
- Reports are generated in the `reports/` directory as HTML files for each page tested.

To run accessibility tests, execute:
```bash
npx playwright test tests/accessibilityBasic.spec.js
```

GitHub Actions also automatically triggers accessibility tests, and results are available as artifacts.

---

### Final Note
Feel free to submit a pull request or raise an issue for any problems or suggestions. Your contributions are always welcome!