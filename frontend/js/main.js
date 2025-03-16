// Function to show toast messages
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000); // Toast disappears after 3 seconds
}

// Function to check if the user is logged in
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('signup.html')) {
        window.location.href = 'login.html'; // Redirect to login if not authenticated
    }
}

// Function to get the current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Function to handle user logout
function logoutUser() {
    localStorage.removeItem('currentUser');
    showToast('Logged out successfully!', 'success'); // Show logout message

    setTimeout(() => {
        window.location.href = 'index.html'; // Redirect to home page
    }, 1000); // Delay to allow the toast to be visible
}

// Add event listeners for logout button
document.addEventListener('DOMContentLoaded', function () {
    const signOutButton = document.getElementById('signOutButton');
    if (signOutButton) {
        signOutButton.addEventListener('click', logoutUser);
    }

    // Check authentication on page load
    checkAuth();
});

// Export functions for use in other files
export { checkAuth, logoutUser, getCurrentUser };
