import apiClient from './apiClient';

// This function will be used to get the student's details from the backend
export const getLoggedInUser = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return null;
  }
  
  // The JWT 'sub' (subject) claim holds the username (email in your case)
  // We need to call the backend to get the full student object which includes the ID
  try {
    // We don't have a direct endpoint to get user by email, so we will need to adjust.
    // For now, let's assume the login response also saves the userID.
    // A better approach would be to save the userID in localStorage upon login.
    
    // Let's modify the login response to save the full user object or at least the ID.
    // For now, I will simulate this. A real implementation would fetch this.
    const userId = localStorage.getItem('userId'); // Assuming we save this at login
    if (!userId) {
        console.error("User ID not found in local storage.");
        return null;
    }

    const response = await apiClient.get(`/api/students/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Could not fetch user profile", error);
    return null;
  }
};