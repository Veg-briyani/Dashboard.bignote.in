import { bookAPI } from './api';

export const bookService = {
    createBook: async (bookData) => {
        try {
            const response = await bookAPI.createBook(bookData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || error.message;
        }
    },

    getAllBooks: async () => {
        try {
            const response = await bookAPI.getAllBooks();
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || error.message;
        }
    },

    getBookById: async (id) => {
        try {
            const response = await bookAPI.getBookById(id);
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || error.message;
        }
    },

    updateBook: async (id, bookData) => {
        try {
            const response = await bookAPI.updateBook(id, bookData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || error.message;
        }
    },

    deleteBook: async (id) => {
        try {
            const response = await bookAPI.deleteBook(id);
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || error.message;
        }
    },

    getDashboardStats: async () => {
        try {
            const response = await bookAPI.getDashboardStats();
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || error.message;
        }
    }
};