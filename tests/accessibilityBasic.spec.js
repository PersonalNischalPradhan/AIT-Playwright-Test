import path from 'path';
import fs from 'fs';
import { injectAxe, getViolations } from 'axe-playwright';
import { test, expect } from '@playwright/test';
const urlData = require('../properties/accessibilityUrlsProperties'); 

let allViolations = []; // Collect all violations globally

async function generateHtmlReport(violations, reportTitle) {
    const severityCounts = { critical: 0, serious: 0, moderate: 0, minor: 0 };

    violations.forEach((violation) => {
        switch (violation.impact) {
            case 'critical': severityCounts.critical++; break;
            case 'serious': severityCounts.serious++; break;
            case 'moderate': severityCounts.moderate++; break;
            case 'minor': severityCounts.minor++; break;
        }
    });

    const outputDir = path.resolve(__dirname, '../reports');
    const filename = `${reportTitle}-accessibility-report.html`;
    const reportPath = path.join(outputDir, filename);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Accessibility Violations Report</title>
        </head>
        <body>
            <h1>${reportTitle}</h1>
            <p>Total Violations: ${violations.length}</p>
            <ul>${violations.map(v => `
                <li>
                    <strong>${v.description}</strong>
                    <p>Impact: ${v.impact}</p>
                    <p>Help: <a href="${v.helpUrl}" target="_blank">${v.helpUrl}</a></p>
                </li>
            `).join('')}</ul>
        </body>
        </html>
    `;

    fs.writeFileSync(reportPath, htmlContent, 'utf-8');
    console.log(`Report generated: ${reportPath}`);
}

test.describe('Accessibility Tests for Automation in Testing Admin Page', () => {
    test('should check accessibility on Admin page', async ({ page }) => {
        await page.goto(urlData.urls.adminPageUrl);
        await injectAxe(page);

        const violations = await getViolations(page);
        console.log(`Found ${violations.length} accessibility violations.`);

        allViolations.push(...violations);

        expect(violations.length).toBe(0);

        await generateHtmlReport(violations, 'Admin Page Accessibility');
    });

    test.afterAll(async () => {
        if (allViolations.length > 0) {
            await generateHtmlReport(allViolations, 'Consolidated Accessibility Report');
        }
    });
});
