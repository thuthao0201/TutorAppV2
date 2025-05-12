import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ApiClient } from "../config/api";

// Create the Auth Context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// API endpoint path for authentication
const AUTH_PATH = "/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const api = ApiClient();

  // Initialize auth state
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Load authentication state from storage
  const loadStoredAuth = async () => {
    setLoading(true);
    try {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("auth_user");

      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.error("Failed to load authentication info", e);
    } finally {
      setLoading(false);
    }
  };

  // Store authentication data
  const storeAuthData = async (userData, accessToken, refreshToken) => {
    try {
      await AsyncStorage.setItem("token", `Bearer ${accessToken}`);
      await AsyncStorage.setItem("refreshToken", refreshToken);
      await AsyncStorage.setItem("auth_user", JSON.stringify(userData));
    } catch (e) {
      console.error("Failed to store auth data", e);
    }
  };

  // Clear authentication data
  const clearAuthData = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("refreshToken");
      await AsyncStorage.removeItem("auth_user");
    } catch (e) {
      console.error("Failed to clear auth data", e);
    }
  };

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(`${AUTH_PATH}/login`, {
        email,
        password,
      });

      const { user: userData, accessToken, refreshToken } = response.data;
      console.log("Login response:", response); // Log the response for debugging

      setUser(userData);
      setIsLoggedIn(true);
      await storeAuthData(userData, accessToken, refreshToken);

      router.push("/");
      return true;
    } catch (err) {
      console.error("Login error", err); // Log the error for debugging
      const message =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(`${AUTH_PATH}/register`, userData);
      console.log("Signup data:", userData); // Log the signup data for debugging

      const { user: newUser, accessToken, refreshToken } = response.data;
      console.log("Signup response:", response); // Log the response for debugging

      setUser(newUser);
      setIsLoggedIn(true);
      await storeAuthData(newUser, accessToken, refreshToken);

      router.push("/");
      return true;
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);

    try {
      // Optional: Call logout API endpoint
      // await api.post(${AUTH_PATH}/logout);

      setUser(null);
      setIsLoggedIn(false);
      await clearAuthData();

      router.navigate("/auth/login");
      return true;
    } catch (err) {
      console.error("Logout error", err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log("Token:", token);

    return !!token;
  };

  // Update user profile
  const updateProfile = async (updatedUserData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.put(`${AUTH_PATH}/profile`, updatedUserData);

      const updatedUser = response.user || response;
      setUser(updatedUser);
      await AsyncStorage.setItem("auth_user", JSON.stringify(updatedUser));

      return true;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update profile.";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Password reset request
  const requestPasswordReset = async (email) => {
    setLoading(true);
    setError(null);

    try {
      await api.post(`${AUTH_PATH}/forgot-password`, { email });
      return true;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to request password reset.";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Reset password with token
  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    setError(null);

    try {
      await api.post(`${AUTH_PATH}/reset-password`, {
        token,
        password: newPassword,
      });
      return true;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to reset password.";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    isLoggedIn,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated,
    updateProfile,
    requestPasswordReset,
    resetPassword,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
