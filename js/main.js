// Main JavaScript file for ParkHere web app
console.log('ParkHere main.js loaded');

// Global variables
let currentUser = null;
let parkingData = [];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('ParkHere app initialized');
    
    // Password visibility toggle for login form
    const toggleLoginPassword = document.getElementById('toggle-login-password');
    if (toggleLoginPassword) {
        toggleLoginPassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('login-password');
            const toggleIcon = this.querySelector('i');
            
            if (passwordInput && toggleIcon) {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    toggleIcon.className = 'ph ph-eye';
                } else {
                    passwordInput.type = 'password';
                    toggleIcon.className = 'ph ph-eye-slash';
                }
            }
        });
    }
    
    // Password visibility toggle for registration form
    const toggleRegisterPassword = document.getElementById('toggle-register-password');
    if (toggleRegisterPassword) {
        toggleRegisterPassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('register-password');
            const toggleIcon = this.querySelector('i');
            
            if (passwordInput && toggleIcon) {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    toggleIcon.className = 'ph ph-eye';
                } else {
                    passwordInput.type = 'password';
                    toggleIcon.className = 'ph ph-eye-slash';
                }
            }
        });
    }
});

// Utility functions
function showAlert(message, type = 'info') {
    // Create and show Bootstrap alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.insertBefore(alertDiv, document.body.firstChild);
}

// Navigation functions
function navigateTo(page) {
    window.location.href = `${page}.html`;
}

// Export functions for use in other modules
window.ParkHere = {
    showAlert,
    navigateTo,
    currentUser,
    parkingData
};
