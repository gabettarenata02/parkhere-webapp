// Firestore database operations for ParkHere web app
console.log('ParkHere firestore.js loaded');

// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc, writeBatch } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

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

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Parking Location Functions
export async function getParkingLocations(category) {
    try {
        console.log('Fetching parking locations from Firestore for category:', category);
        
        const parkingLocationsRef = collection(db, 'parkingLocations');
        const q = query(parkingLocationsRef, where("availableFor", "array-contains", category));
        const querySnapshot = await getDocs(q);
        
        const locations = [];
        querySnapshot.forEach((doc) => {
            locations.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log('Found parking locations for', category, ':', locations);
        return locations;
    } catch (error) {
        console.error('Error fetching parking locations:', error);
        
        // If it's a permissions error, provide helpful message
        if (error.code === 'permission-denied') {
            throw new Error('Permission denied. Please check your Firestore security rules and ensure you are authenticated.');
        }
        
        // Return empty array on error
        return [];
    }
}

// Vehicle Management Functions
export async function addVehicle(userId, vehicleData) {
    try {
        console.log('Adding vehicle for user:', userId, vehicleData);
        
        const vehicleDoc = {
            userId: userId,
            licensePlate: vehicleData.licensePlate,
            vehicleType: vehicleData.vehicleType,
            color: vehicleData.color,
            isActive: true, // New vehicle becomes active by default
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        // First, set all existing vehicles to inactive
        await setAllVehiclesInactive(userId);
        
        // Add the new vehicle
        const docRef = await addDoc(collection(db, 'vehicles'), vehicleDoc);
        console.log('Vehicle added with ID:', docRef.id);
        
        return { success: true, vehicleId: docRef.id };
    } catch (error) {
        console.error('Error adding vehicle:', error);
        
        // If it's a permissions error, provide helpful message
        if (error.code === 'permission-denied') {
            throw new Error('Permission denied. Please check your Firestore security rules and ensure you are authenticated.');
        }
        
        throw error;
    }
}

export async function getUserVehicles(userId) {
    try {
        console.log('Fetching vehicles for user:', userId);
        
        const vehiclesRef = collection(db, 'vehicles');
        const q = query(vehiclesRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        const vehicles = [];
        querySnapshot.forEach((doc) => {
            vehicles.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log('Found vehicles:', vehicles);
        return vehicles;
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        throw error;
    }
}

export async function setActiveVehicle(userId, vehicleId) {
    try {
        console.log('Setting active vehicle:', vehicleId, 'for user:', userId);
        
        // First, get all user's vehicles
        const vehicles = await getUserVehicles(userId);
        
        // Create a batch to update all vehicles
        const batch = writeBatch(db);
        
        // Set all vehicles to inactive
        vehicles.forEach(vehicle => {
            const vehicleRef = doc(db, 'vehicles', vehicle.id);
            batch.update(vehicleRef, { 
                isActive: false,
                updatedAt: new Date()
            });
        });
        
        // Set the selected vehicle to active
        const activeVehicleRef = doc(db, 'vehicles', vehicleId);
        batch.update(activeVehicleRef, { 
            isActive: true,
            updatedAt: new Date()
        });
        
        // Commit the batch
        await batch.commit();
        console.log('Active vehicle updated successfully');
        
        return { success: true };
    } catch (error) {
        console.error('Error setting active vehicle:', error);
        throw error;
    }
}

async function setAllVehiclesInactive(userId) {
    try {
        const vehicles = await getUserVehicles(userId);
        const batch = writeBatch(db);
        
        vehicles.forEach(vehicle => {
            const vehicleRef = doc(db, 'vehicles', vehicle.id);
            batch.update(vehicleRef, { 
                isActive: false,
                updatedAt: new Date()
            });
        });
        
        if (vehicles.length > 0) {
            await batch.commit();
        }
    } catch (error) {
        console.error('Error setting vehicles inactive:', error);
        throw error;
    }
}

// Legacy functions for parking records
function saveParkingRecord(record) {
    console.log('Saving parking record:', record);
    return new Promise((resolve, reject) => {
        // Simulate database save
        setTimeout(() => {
            resolve({ id: Date.now(), ...record });
        }, 500);
    });
}

function getParkingHistory(userId) {
    console.log('Fetching parking history for user:', userId);
    return new Promise((resolve, reject) => {
        // Simulate database fetch
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    location: 'Mall Central',
                    startTime: '2024-01-15 10:00',
                    endTime: '2024-01-15 12:00',
                    cost: 15000,
                    status: 'completed'
                },
                {
                    id: 2,
                    location: 'Office Building A',
                    startTime: '2024-01-16 09:00',
                    endTime: '2024-01-16 17:00',
                    cost: 25000,
                    status: 'completed'
                }
            ]);
        }, 500);
    });
}

function updateParkingRecord(recordId, updates) {
    console.log('Updating parking record:', recordId, updates);
    return new Promise((resolve, reject) => {
        // Simulate database update
        setTimeout(() => {
            resolve({ id: recordId, ...updates });
        }, 500);
    });
}

function deleteParkingRecord(recordId) {
    console.log('Deleting parking record:', recordId);
    return new Promise((resolve, reject) => {
        // Simulate database delete
        setTimeout(() => {
            resolve({ success: true, id: recordId });
        }, 500);
    });
}

// Real-time listeners
function listenToParkingUpdates(userId, callback) {
    console.log('Setting up real-time listener for user:', userId);
    // Add your real-time listener code here
}

// Export functions
window.Firestore = {
    saveParkingRecord,
    getParkingHistory,
    updateParkingRecord,
    deleteParkingRecord,
    listenToParkingUpdates
};
