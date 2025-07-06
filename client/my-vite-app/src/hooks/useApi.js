// client/src/hooks/useApi.js
import { useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import useAuth to get the token

// Base URL is implicitly handled by Vite proxy
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const useApi = () => {
    const { token, logout } = useAuth(); // Get the token and logout function from AuthContext

    // Create an Axios instance with a memoized configuration
    const apiClient = useMemo(() => {
        const instance = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add a request interceptor to include the token
        instance.interceptors.request.use(
            (config) => {
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Add a response interceptor to handle token expiration/invalidity
        instance.interceptors.response.use(
            (response) => response,
            (error) => {
                // If the error is 401 Unauthorized and not from login/register,
                // it might mean the token is expired or invalid.
                // Redirect to login or log out the user.
                if (error.response && error.response.status === 401 &&
                    !error.config.url.includes('/api/auth/login') &&
                    !error.config.url.includes('/api/auth/register')) {
                    console.error('Unauthorized API request, logging out...');
                    logout(); // Log out the user
                    // Optionally, redirect to login page here if not handled by AuthContext
                }
                return Promise.reject(error.response?.data || new Error('Network error'));
            }
        );

        return instance;
    }, [token, logout]); // Recreate apiClient if token or logout changes

    const get = useCallback(async (url) => {
        const response = await apiClient.get(url);
        return response.data;
    }, [apiClient]);

    const post = useCallback(async (url, data) => {
        const response = await apiClient.post(url, data);
        return response.data;
    }, [apiClient]);

    const put = useCallback(async (url, data) => {
        const response = await apiClient.put(url, data);
        return response.data;
    }, [apiClient]);

    const remove = useCallback(async (url) => {
        const response = await apiClient.delete(url);
        return response.data;
    }, [apiClient]);

    return { get, post, put, remove };
};