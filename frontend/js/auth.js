const API_URL = 'https://mentormee-n9gso8uej-baqirs-projects-78b9e2a1.vercel.app/api'; // Backend URL

// Function to show toast notifications
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  // Apply basic styling
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.padding = '10px 20px';
  toast.style.background = type === 'success' ? '#4CAF50' : '#FF5733';
  toast.style.color = '#fff';
  toast.style.borderRadius = '5px';
  toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  toast.style.zIndex = '1000';

  document.body.appendChild(toast);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Function to handle user login
async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('currentUser', JSON.stringify(data)); // Save user data and token
      showToast('Login successful!', 'success');
      setTimeout(() => {
        window.location.href = 'social.html'; // Redirect after toast
      }, 1000);
    } else {
      showToast(data.message || 'Invalid email or password.', 'error');
    }
  } catch (error) {
    showToast('An error occurred. Please try again.', 'error');
  }
}

// Function to handle user signup
async function signupUser(name, email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      showToast('Signup successful! Please login.', 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);
    } else {
      showToast(data.message || 'User already exists.', 'error');
    }
  } catch (error) {
    showToast('An error occurred. Please try again.', 'error');
  }
}

// Function to handle forgot password
async function forgotPassword(email) {
  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      showToast(`Password reset link sent to ${email}.`, 'success');
      setTimeout(() => {
        window.location.href = 'reset-password.html';
      }, 1000);
    } else {
      showToast(data.message || 'No user found with this email.', 'error');
    }
  } catch (error) {
    showToast('An error occurred. Please try again.', 'error');
  }
}

// Function to handle reset password
async function resetPassword(email, newPassword) {
  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      showToast('Password reset successful! Please login.', 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);
    } else {
      showToast(data.message || 'No user found with this email.', 'error');
    }
  } catch (error) {
    showToast('An error occurred. Please try again.', 'error');
  }
}

// Export functions for use in other files
export { loginUser, signupUser, forgotPassword, resetPassword };
