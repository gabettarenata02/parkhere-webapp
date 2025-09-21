// UI utility functions for ParkHere web app
console.log('ParkHere ui.js loaded');

// SweetAlert2 is loaded via CDN script tag in HTML 

// Show toast notification
export function showToast(icon, title) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    Toast.fire({
        icon: icon,
        title: title
    });
}

// Show popup with callback
export function showPopup(icon, title, text, callback) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed && callback) {
            callback();
        }
    });
}

// Helper function to parse Firebase error messages
export function parseFirebaseError(error) {
    const errorMessages = {
        'auth/wrong-password': 'Wrong password',
        'auth/user-not-found': 'User not found',
        'auth/email-already-in-use': 'Email already in use',
        'auth/weak-password': 'Password is too weak',
        'auth/invalid-email': 'Invalid email address',
        'auth/user-disabled': 'This account has been disabled',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later',
        'auth/network-request-failed': 'Network error. Please check your connection',
        'auth/popup-closed-by-user': 'Sign-in popup was closed',
        'auth/cancelled-popup-request': 'Sign-in was cancelled'
    };
    
    // Extract the error code from the error message
    const errorCode = error.message.match(/\(auth\/[^)]+\)/)?.[0]?.slice(1, -1);
    
    // Return user-friendly message or fallback to original message
    return errorMessages[errorCode] || error.message.replace(/^Firebase: Error \(auth\/[^)]+\)\.\s*/, '');
}
