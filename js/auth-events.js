// Import authentication functions
import { handleRegister, handleLogin, handleGoogleLogin } from './auth.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Auth events loaded');

    // Registration form event listener
    const registerButton = document.getElementById('register-button');
    if (registerButton) {
        registerButton.addEventListener('click', function(e) {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            
            if (email && password) {
                handleRegister(email, password);
            } else {
                alert('Please fill in all required fields');
            }
        });
    }

    // Login form event listener
    const loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.addEventListener('click', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            if (email && password) {
                handleLogin(email, password);
            } else {
                alert('Please fill in all required fields');
            }
        });
    }

    // Google signup button event listener
    const googleSignupButton = document.getElementById('google-signup-button');
    if (googleSignupButton) {
        googleSignupButton.addEventListener('click', function(e) {
            e.preventDefault();
            handleGoogleLogin();
        });
    }

    // Google login button event listener
    const googleLoginButton = document.getElementById('google-login-button');
    if (googleLoginButton) {
        googleLoginButton.addEventListener('click', function(e) {
            e.preventDefault();
            handleGoogleLogin();
        });
    }
});
