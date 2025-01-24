const path = require('path');
const fs = require('fs');

class ReportGenerator {
    static generateHtmlReport(violations, reportTitle) {
        const severityCounts = { critical: 0, serious: 0, moderate: 0, minor: 0 };

        // Count violations by severity
        violations.forEach((violation) => {
            switch (violation.impact) {
                case 'critical': severityCounts.critical++; break;
                case 'serious': severityCounts.serious++; break;
                case 'moderate': severityCounts.moderate++; break;
                case 'minor': severityCounts.minor++; break;
            }
        });

        // Set output path
        const outputDir = path.resolve(__dirname, '../reports');
        const filename = `${reportTitle.replace(/\s+/g, '_')}-accessibility-report.html`;
        const reportPath = path.join(outputDir, filename);

        // Create directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Build HTML content
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${reportTitle}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #333; }
                    ul { padding-left: 20px; }
                    li { margin-bottom: 15px; }
                    strong { color: #d9534f; }
                </style>
            </head>
            <body>
                <h1>${reportTitle}</h1>
                <p>Total Violations: <strong>${violations.length}</strong></p>
                <p>Severity Counts:</p>
                <ul>
                    <li>Critical: ${severityCounts.critical}</li>
                    <li>Serious: ${severityCounts.serious}</li>
                    <li>Moderate: ${severityCounts.moderate}</li>
                    <li>Minor: ${severityCounts.minor}</li>
                </ul>
                <h2>Details</h2>
                <ul>
                    ${violations.map(v => `
                        <li>
                            <strong>${v.description}</strong>
                            <p>Impact: ${v.impact}</p>
                            <p>Help: <a href="${v.helpUrl}" target="_blank">${v.helpUrl}</a></p>
                        </li>
                    `).join('')}
                </ul>
            </body>
            </html>
        `;

        // Write report to file
        fs.writeFileSync(reportPath, htmlContent, 'utf-8');
        console.log(`Report generated: ${reportPath}`);
    }
}

module.exports = ReportGenerator;
