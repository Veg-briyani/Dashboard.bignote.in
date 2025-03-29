import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const adminAPI = {
    // Get all users
    getAllUsers: async () => {
        const response = await axios.get(`${BASE_URL}/admin/users`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response;
    },

    // Get user by ID
    getUserById: async (userId) => {
        const response = await axios.get(`${BASE_URL}/admin/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response;
    },

    // Update user data
    updateUser: async (userId, userData) => {
        const response = await axios.put(
            `${BASE_URL}/admin/users/${userId}`,
            userData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
        return response;
    },

    // Delete user
    deleteUser: async (userId) => {
        const response = await axios.delete(`${BASE_URL}/admin/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response;
    },

    // Update user role
    updateUserRole: async (userId, role) => {
        const response = await axios.patch(
            `${BASE_URL}/admin/users/${userId}/role`,
            { role },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
        return response;
    },

    // Get user statistics
    getUserStats: async () => {
        const response = await axios.get(`${BASE_URL}/admin/users/stats`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response;
    },
};