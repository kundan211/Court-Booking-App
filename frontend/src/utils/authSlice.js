import { createSlice } from "@reduxjs/toolkit";

// Function to retrieve stored user credentials from localStorage
const getStoredCredentials = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return {
    token: token || null,
    user: user ? JSON.parse(user) : { name: '', email: '', role: '' }
  };
};

const initialState = getStoredCredentials();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginData: (state, action) => {
      const { token, name, email, role } = action.payload;
      state.token = token;
      state.user = {
        name,
        email,
        role,
      };

      // Save token and user details to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ name, email, role }));
      console.log("Login successful");
    },
    logout: (state) => {
      state.token = null;
      state.user = { name: '', email: '', role: '' };

      // Remove user credentials from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log("Logged out");
    }
  },
});

// Export the actions for use in components
export const { setLoginData, logout } = authSlice.actions;

// Export the reducer to be used in the store
export default authSlice.reducer;