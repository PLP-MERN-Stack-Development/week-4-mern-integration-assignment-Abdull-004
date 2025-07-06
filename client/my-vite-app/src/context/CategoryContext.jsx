// client/src/context/CategoryContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useApi } from '../hooks/useApi';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { get, post: createCategoryApi } = useApi();

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await get('/categories');
            setCategories(data);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError(err.message || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    }, [get]);

    const createCategory = useCallback(async (categoryName) => {
        setError(null);
        try {
            const newCategory = await createCategoryApi('/categories', { name: categoryName });
            setCategories(prevCategories => [...prevCategories, newCategory]);
            return newCategory;
        } catch (err) {
            console.error('Error creating category:', err);
            setError(err.message || 'Failed to create category');
            throw err;
        }
    }, [createCategoryApi]);

    const value = {
        categories,
        loading,
        error,
        fetchCategories,
        createCategory,
    };

    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategories = () => {
    const context = useContext(CategoryContext);
    if (context === undefined) {
        throw new Error('useCategories must be used within a CategoryProvider');
    }
    return context;
};
