// Authentication JavaScript for ParkHere web app
console.log('ParkHere auth.js loaded');

// Import Firebase functions from CDN URLs
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';

// Import UI utility functions
import { showToast, showPopup, parseFirebaseError } from './ui.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9ptLHZoLaExf9hK4uUdrhNNZRkjk-BUI",
  authDomain: "parkhere-2025.firebaseapp.com",
  projectId: "parkhere-2025",
  storageBucket: "parkhere-2025.firebasestorage.app",
  messagingSenderId: "56999479616",
  appId: "1:56999479616:web:4819b71d79d946a66212a5",
  measurementId: "G-CBFWBYZ8ZR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Authentication state
let isAuthenticated = false;
let userProfile = null;


// Authentication functions
async function login(email, password) {
    console.log('Attempting login for:', email);
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        isAuthenticated = true;
        userProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        };
        return { success: true, user: userProfile };
    } catch (error) {
        console.error('Login error:', error);
        throw new Error(error.message);
    }
}

async function register(userData) {
    console.log('Attempting registration for:', userData);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        const user = userCredential.user;
        isAuthenticated = true;
        userProfile = {
            uid: user.uid,
            email: user.email,
            displayName: userData.name,
            phoneNumber: userData.phone
        };
        return { success: true, user: userProfile };
    } catch (error) {
        console.error('Registration error:', error);
        throw new Error(error.message);
    }
}

async function loginWithGoogle() {
    console.log('Attempting Google login');
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        isAuthenticated = true;
        userProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        };
        return { success: true, user: userProfile };
    } catch (error) {
        console.error('Google login error:', error);
        throw new Error(error.message);
    }
}

function logout() {
    console.log('Logging out user');
    isAuthenticated = false;
    userProfile = null;
    // Redirect to login page
    window.location.href = 'login.html';
}

function getCurrentUser() {
    return userProfile;
}

function isUserAuthenticated() {
    return isAuthenticated;
}

// Form handlers
function handleLoginForm(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    login(email, password)
        .then(result => {
            window.ParkHere.showAlert('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        })
        .catch(error => {
            window.ParkHere.showAlert('Login failed: ' + error.message, 'danger');
        });
}

function handleRegisterForm(event) {
    event.preventDefault();
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    
    register(formData)
        .then(result => {
            window.ParkHere.showAlert('Registration successful!', 'success');
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        })
        .catch(error => {
            window.ParkHere.showAlert('Registration failed: ' + error.message, 'danger');
        });
}

// Separate authentication functions for direct use
export async function handleRegister(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User registered successfully:', user);
        
        // Show success popup that user must click OK on
        showPopup('success', 'Registration Successful!', 'You can now log in.', () => {
            window.location.href = 'login.html';
        });
    } catch (error) {
        console.error('Registration error:', error.message);
        const friendlyError = parseFirebaseError(error);
        showToast('error', friendlyError);
    }
}

export async function handleLogin(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User logged in successfully:', user);
        
        // Show success toast
        showToast('success', 'Signed in successfully');
        
        // Redirect after a short delay to let user read the toast
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1500);
    } catch (error) {
        console.error('Login error:', error.message);
        const friendlyError = parseFirebaseError(error);
        showToast('error', friendlyError);
    }
}

export async function handleGoogleLogin() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log('Google login successful:', user);
        
        // Show success toast
        showToast('success', 'Signed in successfully');
        
        // Redirect after a short delay to let user read the toast
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1500);
    } catch (error) {
        console.error('Google login error:', error.message);
        const friendlyError = parseFirebaseError(error);
        showToast('error', friendlyError);
    }
}

// Export functions
window.Auth = {
    login,
    register,
    loginWithGoogle,
    logout,
    getCurrentUser,
    isUserAuthenticated,
    handleLoginForm,
    handleRegisterForm,
    handleRegister,
    handleLogin,
    handleGoogleLogin
};
