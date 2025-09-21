// Map functionality for ParkHere web app
console.log('ParkHere map.js loaded');

// Map configuration
let map = null;
let markers = [];
let currentLocation = null;

// Initialize map
function initializeMap(containerId) {
    console.log('Initializing map in container:', containerId);
    
    // This is a placeholder for map initialization
    // Replace with actual map library (Google Maps, Leaflet, etc.)
    
    // Simulate map initialization
    const mapContainer = document.getElementById(containerId);
    if (mapContainer) {
        mapContainer.innerHTML = '<div class="map-placeholder">Map will be loaded here</div>';
        mapContainer.style.height = '400px';
        mapContainer.style.backgroundColor = '#f0f0f0';
        mapContainer.style.border = '1px solid #ccc';
        mapContainer.style.display = 'flex';
        mapContainer.style.alignItems = 'center';
        mapContainer.style.justifyContent = 'center';
    }
}

// Get user's current location
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    console.log('Current location:', currentLocation);
                    resolve(currentLocation);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    reject(error);
                }
            );
        } else {
            reject(new Error('Geolocation not supported'));
        }
    });
}

// Add parking spot marker
function addParkingMarker(location, info) {
    console.log('Adding parking marker at:', location);
    const marker = {
        id: Date.now(),
        location: location,
        info: info,
        available: true
    };
    markers.push(marker);
    return marker;
}

// Remove parking marker
function removeParkingMarker(markerId) {
    console.log('Removing parking marker:', markerId);
    markers = markers.filter(marker => marker.id !== markerId);
}

// Find nearby parking spots
function findNearbyParking(userLocation, radius = 1000) {
    console.log('Finding parking spots near:', userLocation, 'within', radius, 'meters');
    
    // Simulate finding nearby parking
    const nearbySpots = [
        {
            id: 1,
            name: 'Mall Central Parking',
            location: { lat: userLocation.lat + 0.001, lng: userLocation.lng + 0.001 },
            available: true,
            price: 5000,
            distance: 200
        },
        {
            id: 2,
            name: 'Office Building A',
            location: { lat: userLocation.lat - 0.002, lng: userLocation.lng + 0.001 },
            available: false,
            price: 3000,
            distance: 500
        },
        {
            id: 3,
            name: 'Street Parking Zone 1',
            location: { lat: userLocation.lat + 0.001, lng: userLocation.lng - 0.001 },
            available: true,
            price: 2000,
            distance: 300
        }
    ];
    
    return nearbySpots;
}

// Calculate distance between two points
function calculateDistance(point1, point2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1.lat * Math.PI/180;
    const φ2 = point2.lat * Math.PI/180;
    const Δφ = (point2.lat - point1.lat) * Math.PI/180;
    const Δλ = (point2.lng - point1.lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
}

// Center map on location
function centerMapOnLocation(location) {
    console.log('Centering map on:', location);
    // Add your map centering logic here
}

// Export functions
window.Map = {
    initializeMap,
    getCurrentLocation,
    addParkingMarker,
    removeParkingMarker,
    findNearbyParking,
    calculateDistance,
    centerMapOnLocation
};
