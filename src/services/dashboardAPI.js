import axiosInstance from './api';
import { bookAPI } from './api';

export const dashboardAPI = {
    getSummary: () => bookAPI.getDashboardStats(),
    getMonthlyStats: () => bookAPI.getDashboardStats(),
    getYearlyStats: () => bookAPI.getDashboardStats(),
    getOrderStats: () => bookAPI.getDashboardStats(),
    getRevenueStats: () => bookAPI.getDashboardStats(),
    getProfitStats: () => bookAPI.getDashboardStats(),
    getTransactionStats: () => bookAPI.getDashboardStats(),
    getBookInventory: () => bookAPI.getAllBooks(),
    getBookSales: () => bookAPI.getAllBooks(),
    getMonthlyEarnings: () => bookAPI.getDashboardStats()
};