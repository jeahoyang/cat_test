import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com', // Replace with your API base URL
  timeout: 10000, // Adjust timeout as needed
  headers: {
    'Content-Type': 'application/json',
    // Add any headers you need
  },
});

// Example method to fetch user data
export const getUser = () => {
  return api.get('/user');
};

// You can add more methods for different API endpoints as needed

export default api;
