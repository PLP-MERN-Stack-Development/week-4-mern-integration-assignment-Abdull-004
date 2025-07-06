// client/src/context/PostContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useApi } from '../hooks/useApi'; // Use the custom API hook

const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { get, post: createPostApi, put: updatePostApi, remove: deletePostApi } = useApi();

    // Fetch all posts
    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await get('/posts');
            setPosts(data);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError(err.message || 'Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    }, [get]);

    // Add a new post (optimistic update)
    const addPost = useCallback(async (newPostData) => {
        setError(null);
        try {
            const createdPost = await createPostApi('/posts', newPostData);
            setPosts(prevPosts => [createdPost, ...prevPosts]); // Add to the beginning
            return createdPost;
        } catch (err) {
            console.error('Error creating post:', err);
            setError(err.message || 'Failed to create post');
            throw err; // Re-throw for component to handle
        }
    }, [createPostApi]);

    // Update an existing post (optimistic update)
    const updatePost = useCallback(async (postId, updatedPostData) => {
        setError(null);
        try {
            const updatedPost = await updatePostApi(`/posts/${postId}`, updatedPostData);
            setPosts(prevPosts =>
                prevPosts.map(post => (post._id === updatedPost._id ? updatedPost : post))
            );
            return updatedPost;
        } catch (err) {
            console.error('Error updating post:', err);
            setError(err.message || 'Failed to update post');
            throw err;
        }
    }, [updatePostApi]);

    // Delete a post (optimistic update)
    const deletePost = useCallback(async (postId) => {
        setError(null);
        try {
            await deletePostApi(`/posts/${postId}`);
            setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
        } catch (err) {
            console.error('Error deleting post:', err);
            setError(err.message || 'Failed to delete post');
            throw err;
        }
    }, [deletePostApi]);


    const value = {
        posts,
        loading,
        error,
        fetchPosts,
        addPost,
        updatePost,
        deletePost,
    };

    return (
        <PostContext.Provider value={value}>
            {children}
        </PostContext.Provider>
    );
};

export const usePosts = () => {
    const context = useContext(PostContext);
    if (context === undefined) {
        throw new Error('usePosts must be used within a PostProvider');
    }
    return context;
};