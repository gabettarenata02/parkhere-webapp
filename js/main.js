// Main JavaScript file for ParkHere web app
console.log('ParkHere main.js loaded');

// Import Firestore functions
import { addVehicle, getUserVehicles, setActiveVehicle } from './firestore.js';
import { showToast, showPopup, parseFirebaseError } from './ui.js';
import { getCurrentUser } from './auth.js';

// Global variables
let currentUser = null;
let parkingData = [];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('ParkHere app initialized');
    
    // Initialize Firebase Auth
    initializeAuth();
    
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

// Get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().split('.')[0];
    return page;
}

// Initialize page-specific functionality
async function initializePage(page) {
    try {
        // Get current user (simplified - in real app, get from auth)
        currentUser = await getCurrentUser();
        
        switch (page) {
            case 'home':
                await initializeHomePage();
                break;
            case 'add-vehicle':
                await initializeAddVehiclePage();
                break;
            case 'vehicle-list':
                await initializeVehicleListPage();
                break;
            default:
                console.log('No specific initialization for page:', page);
        }
    } catch (error) {
        console.error('Error initializing page:', error);
    }
}

// Initialize Firebase Auth
async function initializeAuth() {
    try {
        // Get the current authenticated user
        const user = await getCurrentUser();
        
        if (user) {
            currentUser = user;
            console.log('User signed in:', user.uid);
        } else {
            currentUser = null;
            console.log('No user signed in');
            
            // Redirect to login if not on login/register pages
            const currentPage = getCurrentPage();
            if (currentPage !== 'login' && currentPage !== 'register' && currentPage !== 'index') {
                window.location.href = 'login.html';
                return;
            }
        }
        
        // Get current page and initialize
        const currentPage = getCurrentPage();
        console.log('Current page:', currentPage);
        initializePage(currentPage);
        
    } catch (error) {
        console.error('Error initializing auth:', error);
    }
}


// Home page initialization
async function initializeHomePage() {
    console.log('Initializing home page');
    
    try {
        if (!currentUser) {
            console.log('No user authenticated for home page');
            return;
        }
        
        const vehicles = await getUserVehicles(currentUser.uid);
        const addVehicleBtn = document.getElementById('addVehicleBtn');
        const selectedVehicle = document.getElementById('selectedVehicle');
        
        if (vehicles.length === 0) {
            // No vehicles - show add vehicle button
            if (addVehicleBtn) addVehicleBtn.classList.remove('d-none');
            if (selectedVehicle) selectedVehicle.classList.add('d-none');
        } else {
            // Has vehicles - show active vehicle
            const activeVehicle = vehicles.find(v => v.isActive) || vehicles[0];
            
            if (addVehicleBtn) addVehicleBtn.classList.add('d-none');
            if (selectedVehicle) {
                selectedVehicle.classList.remove('d-none');
                updateVehicleDisplay(activeVehicle);
            }
        }
    } catch (error) {
        console.error('Error loading vehicles for home page:', error);
        showToast('error', 'Failed to load vehicle information');
    }
}

// Update vehicle display on home page
function updateVehicleDisplay(vehicle) {
    const vehicleType = document.querySelector('#selectedVehicle .vehicle-type');
    const vehiclePlate = document.querySelector('#selectedVehicle .vehicle-plate');
    
    if (vehicleType) {
        vehicleType.textContent = vehicle.vehicleType;
        vehicleType.className = 'vehicle-type text-capitalize-custom';
    }
    if (vehiclePlate) {
        vehiclePlate.textContent = vehicle.licensePlate;
        vehiclePlate.className = 'vehicle-plate text-uppercase-custom';
    }
}

// Add vehicle page initialization
async function initializeAddVehiclePage() {
    console.log('Initializing add vehicle page');
    
    const saveButton = document.querySelector('button[type="submit"]');
    if (saveButton) {
        saveButton.addEventListener('click', handleSaveVehicle);
    }
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(str) {
    return str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase();
}

// Handle save vehicle
async function handleSaveVehicle(event) {
    event.preventDefault();
    
    try {
        // Get the current authenticated user
        const user = await getCurrentUser();
        
        if (user) {
            console.log("User detected:", user.uid);
            
            // Get form values
            const rawLicensePlate = document.getElementById('licensePlate').value;
            const vehicleType = document.querySelector('input[name="vehicleType"]:checked')?.value;
            const rawVehicleColor = document.getElementById('vehicleColor').value;
            
            // Validate form fields
            if (!rawLicensePlate || !vehicleType || !rawVehicleColor) {
                showToast('error', 'Please fill in all fields');
                return;
            }
            
            // Format the input values
            const licensePlate = rawLicensePlate.trim().toUpperCase();
            const vehicleColor = capitalizeFirstLetter(rawVehicleColor);
            
            // Create vehicle data object with formatted values
            const vehicleData = {
                licensePlate,
                vehicleType,
                color: vehicleColor
            };
            
            // Save vehicle to Firestore with real user ID
            await addVehicle(user.uid, vehicleData);
            
            // Show success popup and redirect
            showPopup('success', 'Vehicle Added!', 'Your vehicle has been successfully saved.', () => {
                window.location.href = 'vehicle-list.html';
            });
            
        } else {
            console.log("No user is logged in.");
            showToast('error', 'You must be logged in.');
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
        
    } catch (error) {
        console.error('Error saving vehicle:', error);
        const friendlyError = parseFirebaseError(error);
        showToast('error', friendlyError);
    }
}

// Vehicle list page initialization
async function initializeVehicleListPage() {
    console.log('Initializing vehicle list page');
    
    const loadingSpinner = document.getElementById('loading-spinner');
    const vehicleList = document.getElementById('vehicleList');
    
    try {
        if (!currentUser) {
            console.log('No user authenticated for vehicle list page');
            // Hide loading spinner
            if (loadingSpinner) loadingSpinner.style.display = 'none';
            return;
        }
        
        const vehicles = await getUserVehicles(currentUser.uid);
        
        // Hide loading spinner after data is fetched
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        
        if (vehicles.length === 0) {
            // Show empty state
            if (vehicleList) vehicleList.innerHTML = createEmptyState();
        } else {
            // Render vehicle cards
            if (vehicleList) {
                vehicleList.innerHTML = '';
                vehicles.forEach(vehicle => {
                    const vehicleCard = createVehicleCardElement(vehicle);
                    vehicleList.appendChild(vehicleCard);
                });
            }
        }
        
        // Add click listeners to vehicle cards
        addVehicleCardListeners();
        
    } catch (error) {
        console.error('Error loading vehicles for list page:', error);
        
        // Hide loading spinner on error
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        
        // Show error state
        if (vehicleList) {
            vehicleList.innerHTML = `
                <div class="text-center py-5">
                    <i class="ph ph-warning-circle" style="font-size: 3rem; color: #F2C84F; margin-bottom: 1rem;"></i>
                    <h3 style="color: #FFFFFF; margin-bottom: 0.5rem;">Failed to Load Vehicles</h3>
                    <p style="color: #A0A0A0; margin-bottom: 2rem;">There was an error loading your vehicles. Please try again.</p>
                    <button class="btn btn-primary-yellow" onclick="location.reload()">
                        <i class="ph ph-arrow-clockwise me-2"></i>
                        Try Again
                    </button>
                </div>
            `;
        }
        
        showToast('error', 'Failed to load vehicles');
    }
}

// Create empty state HTML
function createEmptyState() {
    return `
        <div class="empty-state text-center py-5">
            <i class="ph ph-car" style="font-size: 4rem; color: #A0A0A0; margin-bottom: 1rem;"></i>
            <h3 style="color: #FFFFFF; margin-bottom: 0.5rem;">No Vehicles Added</h3>
            <p style="color: #A0A0A0; margin-bottom: 2rem;">You haven't added any vehicles yet.</p>
            <a href="add-vehicle.html" class="btn btn-primary-yellow">
                <i class="ph ph-plus me-2"></i>
                Add Your First Vehicle
            </a>
        </div>
    `;
}

// Create vehicle card DOM element
function createVehicleCardElement(vehicle) {
    // Create the main card div
    const card = document.createElement('div');
    card.className = `vehicle-card ${vehicle.isActive ? 'selected' : ''}`;
    card.setAttribute('data-vehicle-id', vehicle.id);
    
    // Create the inner content div
    const contentDiv = document.createElement('div');
    contentDiv.className = 'd-flex justify-content-between align-items-center';
    
    // Create vehicle info section
    const vehicleInfo = document.createElement('div');
    vehicleInfo.className = 'vehicle-info';
    
    const vehicleType = document.createElement('h3');
    vehicleType.className = 'vehicle-type text-capitalize-custom';
    vehicleType.textContent = vehicle.vehicleType;
    
    const vehicleDetails = document.createElement('p');
    vehicleDetails.className = 'vehicle-details';
    
    // Create formatted display with helper classes
    const licensePlateSpan = document.createElement('span');
    licensePlateSpan.className = 'text-uppercase-custom';
    licensePlateSpan.textContent = vehicle.licensePlate;
    
    const colorSpan = document.createElement('span');
    if (vehicle.color) {
        colorSpan.className = 'text-capitalize-custom';
        colorSpan.textContent = ' | ' + vehicle.color;
    }
    
    vehicleDetails.appendChild(licensePlateSpan);
    if (vehicle.color) {
        vehicleDetails.appendChild(colorSpan);
    }
    
    vehicleInfo.appendChild(vehicleType);
    vehicleInfo.appendChild(vehicleDetails);
    
    // Create right side section
    const rightSection = document.createElement('div');
    rightSection.className = 'd-flex align-items-center';
    
    // Create vehicle illustration
    const vehicleIllustration = document.createElement('div');
    vehicleIllustration.className = 'vehicle-illustration me-3';
    
    const vehicleIcon = document.createElement('i');
    vehicleIcon.className = `ph ${vehicle.vehicleType === 'car' ? 'ph-car' : 'ph-motorcycle'} vehicle-icon`;
    
    vehicleIllustration.appendChild(vehicleIcon);
    
    // Assemble the right section (without selection indicator)
    rightSection.appendChild(vehicleIllustration);
    
    // Assemble the content div
    contentDiv.appendChild(vehicleInfo);
    contentDiv.appendChild(rightSection);
    
    // Assemble the card
    card.appendChild(contentDiv);
    
    return card;
}

// Add click listeners to vehicle cards
function addVehicleCardListeners() {
    const vehicleCards = document.querySelectorAll('.vehicle-card');
    
    vehicleCards.forEach(card => {
        card.addEventListener('click', async function() {
            const vehicleId = this.dataset.vehicleId;
            
            try {
                if (!currentUser) {
                    showToast('error', 'You must be logged in to select a vehicle');
                    return;
                }
                
                await setActiveVehicle(currentUser.uid, vehicleId);
                
                // Update UI
                vehicleCards.forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
                
                showToast('success', 'Vehicle selected successfully');
                
            } catch (error) {
                console.error('Error setting active vehicle:', error);
                const friendlyError = parseFirebaseError(error);
                showToast('error', friendlyError);
            }
        });
    });
}

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
