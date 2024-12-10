// ==UserScript==
// @name         Daily Report Generator
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Generate daily report for specified user's tickets
// @author       jimmy
// @match        https://kwickpos.com/mon/logreport.php*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create and style toast notification
    function createToast() {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 10000;
            display: none;
        `;
        document.body.appendChild(toast);
        return toast;
    }

    // Show toast message
    function showToast(message, duration = 2000) {
        const toast = document.querySelector('.report-toast') || createToast();
        toast.textContent = message;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, duration);
    }

    // Add button and input fields to page
    function addGenerateButton() {
        const controlContainer = document.createElement('div');
        controlContainer.style.cssText = `
            padding: 10px;
            position: sticky;
            top: 0;
            background-color: white;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 15px;
        `;

        // Create generate button
        const generateButton = document.createElement('button');
        generateButton.textContent = 'Generate Daily Report';
        generateButton.style.cssText = `
            padding: 8px 16px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;

        // Create date input
        const dateContainer = document.createElement('div');
        dateContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 5px;
        `;

        const dateLabel = document.createElement('label');
        dateLabel.textContent = 'Date (MM-DD): ';
        dateLabel.style.fontSize = '14px';

        const dateInput = document.createElement('input');
        dateInput.type = 'text';
        dateInput.placeholder = 'MM-DD';
        dateInput.style.cssText = `
            width: 80px;
            padding: 6px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
        `;

        // Create username input
        const usernameContainer = document.createElement('div');
        usernameContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 5px;
        `;

        const usernameLabel = document.createElement('label');
        usernameLabel.textContent = 'Username: ';
        usernameLabel.style.fontSize = '14px';

        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';
        usernameInput.placeholder = 'KwickPOS username';
        usernameInput.value = localStorage.getItem('reportUsername') || '';
        usernameInput.style.cssText = `
            width: 120px;
            padding: 6px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
        `;

        // Save username when changed
        usernameInput.addEventListener('change', () => {
            localStorage.setItem('reportUsername', usernameInput.value.toLowerCase());
        });

        // Create on duty input
        const onDutyContainer = document.createElement('div');
        onDutyContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 5px;
        `;

        const onDutyLabel = document.createElement('label');
        onDutyLabel.textContent = 'On Duty: ';
        onDutyLabel.style.fontSize = '14px';

        const onDutyInput = document.createElement('input');
        onDutyInput.type = 'text';
        onDutyInput.placeholder = 'S/N...';
        onDutyInput.value = localStorage.getItem('reportOnDuty') || '';
        onDutyInput.style.cssText = `
            width: 60px;
            padding: 6px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
        `;

        // Save on duty status when changed
        onDutyInput.addEventListener('change', () => {
            localStorage.setItem('reportOnDuty', onDutyInput.value);
        });

        // Date validation function
        function validateDate(value) {
            const regex = /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/;
            if (!regex.test(value)) {
                return false;
            }
            const [month, day] = value.split('-').map(num => parseInt(num, 10));
            const currentYear = new Date().getFullYear();
            const date = new Date(currentYear, month - 1, day);
            return date.getMonth() === month - 1 && date.getDate() === day;
        }

        // Add click event listener
        generateButton.addEventListener('click', () => {
            const dateValue = dateInput.value.trim();
            const username = usernameInput.value.trim().toLowerCase();

            if (!validateDate(dateValue)) {
                showToast('Please enter a valid date (MM-DD)');
                return;
            }

            if (!username) {
                showToast('Please enter a username');
                return;
            }

            generateReport(dateValue, username, onDutyInput.value.trim());
        });

        // Append all elements
        dateContainer.appendChild(dateLabel);
        dateContainer.appendChild(dateInput);
        usernameContainer.appendChild(usernameLabel);
        usernameContainer.appendChild(usernameInput);
        onDutyContainer.appendChild(onDutyLabel);
        onDutyContainer.appendChild(onDutyInput);

        controlContainer.appendChild(generateButton);
        controlContainer.appendChild(dateContainer);
        controlContainer.appendChild(usernameContainer);
        controlContainer.appendChild(onDutyContainer);

        document.body.insertBefore(controlContainer, document.body.firstChild);
    }

    // Generate report content
    function generateReport(dateStr, username, onDuty) {
        // Remove existing report if any
        const existingReport = document.getElementById('user-report');
        if (existingReport) {
            existingReport.remove();
        }

        const [month, day] = dateStr.split('-').map(num => num.padStart(2, '0'));
        const targetDate = `${month}-${day}`;
        const currentYear = new Date().getFullYear();

        // Get all rows from the table
        const rows = Array.from(document.querySelectorAll('tr')).slice(1); // Skip header row

        // Filter rows for user's tickets on the specified date
        const userTickets = rows.filter(row => {
            const userCell = row.querySelector('.ruser');
            const timeCell = row.querySelector('.timestart');
            return userCell &&
                   userCell.textContent.trim().toLowerCase().includes(username) &&
                   timeCell &&
                   timeCell.textContent.includes(targetDate);
        });

        if (userTickets.length === 0) {
            showToast('No tickets found for the specified date');
            return;
        }

        // Sort tickets by time (earliest first)
        userTickets.sort((a, b) => {
            const timeA = new Date(a.querySelector('.timestart').textContent);
            const timeB = new Date(b.querySelector('.timestart').textContent);
            return timeA - timeB;
        });

        // Create report container
        const reportContainer = document.createElement('div');
        reportContainer.id = 'user-report';
        reportContainer.style.cssText = `
            margin: 20px;
            padding: 20px;
            background-color: #f0f8ff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;

        // Add report header
        const header = document.createElement('h2');
        header.textContent = `${month}/${day}/${currentYear} EOS report (${onDuty || 'S'})`;
        reportContainer.appendChild(header);

        // Generate report content
        const reportContent = document.createElement('ol');
        reportContent.style.cssText = `
            padding-left: 20px;
            line-height: 1.5;
        `;

        userTickets.forEach(ticket => {
            const sitename = ticket.querySelector('a[href*="?site"]').textContent.trim();
            let log = ticket.querySelector('.log').textContent.trim();
            let solution = ticket.querySelector('.solution').textContent.trim();

            if (!log.endsWith('.')) {
                log += '.';
            }
            if (!solution.endsWith('.')) {
                solution += '.';
            }

            const listItem = document.createElement('li');
            listItem.style.marginBottom = '10px';
            listItem.textContent = `${sitename}- ${log} ${solution}`;
            reportContent.appendChild(listItem);
        });

        reportContainer.appendChild(reportContent);

        // Add copy button
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Report';
        copyButton.style.cssText = `
            margin-top: 10px;
            padding: 8px 16px;
            background-color: #008CBA;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;

        copyButton.addEventListener('click', () => {
            const reportText = `${header.textContent}\n\n${Array.from(reportContent.children)
                .map((item, index) => `${index + 1}. ${item.textContent}`)
                .join('\n')}`;
            navigator.clipboard.writeText(reportText);

            copyButton.textContent = 'Copied!';
            copyButton.style.backgroundColor = '#4CAF50';
            setTimeout(() => {
                copyButton.textContent = 'Copy Report';
                copyButton.style.backgroundColor = '#008CBA';
            }, 2000);
        });

        reportContainer.appendChild(copyButton);

        // Insert report after the button
        document.querySelector('div').after(reportContainer);
    }

    // Initialize
    addGenerateButton();
})();
