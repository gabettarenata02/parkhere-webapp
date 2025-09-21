// Temporary Firestore functions for testing without authentication
console.log('ParkHere firestore-test.js loaded');

// Mock Firestore functions for testing
export async function addVehicle(userId, vehicleData) {
    try {
        console.log('Adding vehicle for user:', userId, vehicleData);
        
        // Simulate database save
        const vehicleId = 'test-vehicle-' + Date.now();
        
        // Store in localStorage for testing
        const vehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
        const newVehicle = {
            id: vehicleId,
            userId: userId,
            licensePlate: vehicleData.licensePlate,
            vehicleType: vehicleData.vehicleType,
            color: vehicleData.color,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Set all other vehicles to inactive
        vehicles.forEach(v => v.isActive = false);
        
        // Add new vehicle
        vehicles.push(newVehicle);
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
        
        console.log('Vehicle added with ID:', vehicleId);
        return { success: true, vehicleId: vehicleId };
    } catch (error) {
        console.error('Error adding vehicle:', error);
        throw error;
    }
}

export async function getUserVehicles(userId) {
    try {
        console.log('Fetching vehicles for user:', userId);
        
        // Get from localStorage
        const vehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
        const userVehicles = vehicles.filter(v => v.userId === userId);
        
        console.log('Found vehicles:', userVehicles);
        return userVehicles;
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        throw error;
    }
}

export async function setActiveVehicle(userId, vehicleId) {
    try {
        console.log('Setting active vehicle:', vehicleId, 'for user:', userId);
        
        // Get from localStorage
        const vehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
        
        // Set all vehicles to inactive
        vehicles.forEach(v => {
            if (v.userId === userId) {
                v.isActive = false;
                v.updatedAt = new Date().toISOString();
            }
        });
        
        // Set selected vehicle to active
        const targetVehicle = vehicles.find(v => v.id === vehicleId && v.userId === userId);
        if (targetVehicle) {
            targetVehicle.isActive = true;
            targetVehicle.updatedAt = new Date().toISOString();
        }
        
        // Save back to localStorage
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
        
        console.log('Active vehicle updated successfully');
        return { success: true };
    } catch (error) {
        console.error('Error setting active vehicle:', error);
        throw error;
    }
}
