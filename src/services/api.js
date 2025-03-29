import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if it exists
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials) => axiosInstance.post('/auth/login', credentials),
    register: (userData) => axiosInstance.post('/auth/register', userData),
    getProfile: () => axiosInstance.get('/auth/profile'),
    updateProfile: (data) => axiosInstance.put('/auth/profile', data),
    logout: () => {
        localStorage.removeItem('token');
        return Promise.resolve();
    }
};

export const bookAPI = {
    createBook: (bookData) => axiosInstance.post('/books', bookData),
    getAllBooks: () => axiosInstance.get('/books'),
    getDashboardStats: () => axiosInstance.get('/books/dashboard'),
    getBookById: (id) => axiosInstance.get(`/books/${id}`),
    updateBook: (id, bookData) => axiosInstance.put(`/books/${id}`, bookData),
    deleteBook: (id) => axiosInstance.delete(`/books/${id}`)
};

export const adminAPI = {
    getAllUsers: () => axiosInstance.get('/admin/users'),
    updateUser: (id, userData) => axiosInstance.put(`/admin/users/${id}`, userData),
    deleteUser: (id) => axiosInstance.delete(`/admin/users/${id}`),
    getAllBooks: () => axiosInstance.get('/admin/books'),
    updateBook: (id, bookData) => axiosInstance.put(`/admin/books/${id}`, bookData),
    deleteBook: (id) => axiosInstance.delete(`/admin/books/${id}`)
};

export default axiosInstance;