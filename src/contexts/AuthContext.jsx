import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(
        `${API_URL}/auth/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      await fetchUserProfile(token);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/register`,
        {
          name,
          email,
          password,
        }
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      await fetchUserProfile(token);
      return true;
    } catch (error) {
      throw error;
    }
  };

  // New method to request OTP
  const requestOTP = async (phoneNumber) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/request-otp`,
        { phoneNumber }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Method to request signup OTP
  const requestSignupOTP = async (phoneNumber) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/request-signup-otp`,
        { phoneNumber }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // New method to verify OTP and login
  const verifyOTP = async (phoneNumber, otp) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/verify-otp`,
        {
          phoneNumber,
          otp,
        }
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      await fetchUserProfile(token);
      return true;
    } catch (error) {
      throw error;
    }
  };

  // Method to verify signup OTP
  const verifySignupOTP = async (phoneNumber, otp) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/verify-signup-otp`,
        {
          phoneNumber,
          otp,
        }
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      await fetchUserProfile(token);
      return true;
    } catch (error) {
      throw error;
    }
  };

  // Method to handle forgot password request
  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/forgot-password`,
        { email }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Method to handle reset password with token
  const resetPassword = async (token, newPassword) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/reset-password`,
        { token, newPassword }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  // Method to verify reset token
  const verifyResetToken = async (token) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/verify-reset-token`,
        { token }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // New method for Google login
  const googleLogin = async (credential) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/google-login`,
        { credential }
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      await fetchUserProfile(token);
      return true;
    } catch (error) {
      throw error;
    }
  };
  
  // New method for Google signup
  const googleSignup = async (credential) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/google-signup`,
        { credential }
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      await fetchUserProfile(token);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    logout,
    signup,
    requestOTP,
    verifyOTP,
    requestSignupOTP,
    verifySignupOTP,
    forgotPassword,
    resetPassword,
    verifyResetToken,
    googleLogin,
    googleSignup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};