import { injectAxe, getViolations } from 'axe-playwright';
import { test, expect } from '@playwright/test';
const urlData = require('../properties/accessibilityUrlsProperties');
const ReportGenerator = require('../utils/reportGenerator');

let allViolations = []; // Collect all violations globally

/* Test Suite: Accessibility Tests for Admin Page
 * Purpose: Ensure the Admin page is free of accessibility violations as per WCAG guidelines.
 */
test.describe('Accessibility Tests for Automation in Testing Admin Page', () => {

    /* Test Case: Verify Accessibility of Admin Page
   * Verify that the Admin page meets accessibility standards by ensuring there are no violations detected by Axe.
   * Expected Result: The Admin page should have zero accessibility violations.
   */

    test('should check accessibility on Admin page', async ({ page }) => {
        await page.goto(urlData.urls.adminPageUrl);
        await injectAxe(page);
        const violations = await getViolations(page);
        console.log(`Found ${violations.length} accessibility violations.`);
        allViolations.push(...violations);
        expect(violations.length).toBe(0);  // Check there are no violations
        ReportGenerator.generateHtmlReport(violations, 'Admin Page Accessibility');
    });

    test.afterAll(async () => {
        if (allViolations.length > 0) {
            // Generate consolidated report for all tests
            ReportGenerator.generateHtmlReport(allViolations, 'Consolidated Accessibility Report');
        }
    });
});
