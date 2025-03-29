import { adminAPI } from './api';

export const adminBookService = {
    getAllBooks: async () => {
        try {
            const response = await adminAPI.getAllBooks();
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || error.message;
        }
    },

    updateBook: async (id, bookData) => {
        try {
            const response = await adminAPI.updateBook(id, bookData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || error.message;
        }
    },

    deleteBook: async (id) => {
        try {
            const response = await adminAPI.deleteBook(id);
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || error.message;
        }
    }
};