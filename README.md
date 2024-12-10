# Daily Report Generator
A Tampermonkey script designed specifically for the KwickPOS system to automatically generate daily reports.

## Quick Installation
1. First, install the Tampermonkey browser extension
   - [Chrome Version](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox Version](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge Version](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. Click the link below to install the script:
   [Install Script](https://raw.githubusercontent.com/tfsui3/daily-report-generator/main/daily-report.user.js)

## Features
- Automatically generate work reports for specified dates
- Filter tickets by username
- Auto-save username and shift information
- One-click report content copying
- Smart report formatting

## How to Use
1. After entering the ticket page, a report generation control panel will appear at the top
2. Enter the following information:
   - Date (MM-DD format)
   - Username
   - Shift information (Like S, SOD, LOG, 3PP)
3. Click the "Generate Daily Report" button to generate the report
4. Use the "Copy Report" button to copy the report content

## Important Notes
- Date format must be MM-DD (example: 12-25)
- Username is automatically saved in the browser for future use
- Shift information is also saved
- The script will check for updates automatically

## Update History
- v0.5: Initial Release
  - Basic report generation functionality
  - Auto-save user preferences
  - One-click copy feature

## Feedback
If you encounter any issues or have suggestions, please raise them in GitHub Issues.
