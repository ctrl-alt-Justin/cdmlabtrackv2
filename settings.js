// Settings Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
    loadUserSettings();
    setupEventListeners();
});

// Load user settings from localStorage
function loadUserSettings() {
    const settings = JSON.parse(localStorage.getItem('labtrack_settings') || '{}');

    // Profile
    document.getElementById('userName').value = settings.userName || 'Admin';
    document.getElementById('userRole').value = settings.userRole || 'Administrator';

    // Theme
    const currentTheme = settings.theme || 'default';
    setTheme(currentTheme, false); // Don't save again on load
}

// Set Theme
function setTheme(theme, save = true) {
    // Update active state
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        }
    });

    // Apply theme
    document.body.setAttribute('data-theme', theme);
    document.body.className = `theme-${theme}`;

    if (save) {
        saveSettings({ theme: theme });
        showSuccessMessage('Theme updated!');
    }
}

// Save Settings Helper
function saveSettings(updates) {
    const settings = JSON.parse(localStorage.getItem('labtrack_settings') || '{}');
    const newSettings = { ...settings, ...updates };
    localStorage.setItem('labtrack_settings', JSON.stringify(newSettings));
}

// Setup Event Listeners
function setupEventListeners() {
    // Profile Form
    document.getElementById('profileForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const userName = document.getElementById('userName').value;
        const userRole = document.getElementById('userRole').value;

        saveSettings({ userName, userRole });

        // Update sidebar if present
        const sidebarName = document.getElementById('sidebarUserName');
        if (sidebarName) sidebarName.textContent = userName;

        showSuccessMessage('Profile updated successfully!');
    });
}

// Show Success Message
function showSuccessMessage(message) {
    const msgEl = document.getElementById('successMessage');
    const textEl = document.getElementById('successText');
    textEl.textContent = message;
    msgEl.classList.add('show');
    setTimeout(() => msgEl.classList.remove('show'), 3000);
}
