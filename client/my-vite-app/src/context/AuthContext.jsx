// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Using axios directly for auth for clarity, useApi can be adapted

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Axios instance for authentication, without the token initially
    const authApiClient = axios.create({
        baseURL: '/api/auth', // This will be proxied by Vite
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Function to load user from token
    const loadUser = useCallback(async () => {
        if (token) {
            try {
                // Set the Authorization header for this request
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const res = await axios.get('/api/auth/me', config); // Use direct axios for this check
                setUser(res.data);
            } catch (err) {
                console.error('Failed to load user:', err);
                localStorage.removeItem('token'); // Clear invalid token
                setToken(null);
                setUser(null);
            }
        }
        setLoading(false);
    }, [token]);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    // Register user
    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authApiClient.post('/register', userData);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUser(res.data);
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error('Registration error:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Registration failed');
            setLoading(false);
            throw err; // Re-throw to allow component to handle
        }
    };

    // Login user
    const login = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authApiClient.post('/login', userData);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUser(res.data);
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error('Login error:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Login failed');
            setLoading(false);
            throw err;
        }
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        loadUser // Expose loadUser for manual refresh if needed
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
