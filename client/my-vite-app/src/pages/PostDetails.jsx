// client/src/pages/PostDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { usePosts } from '../context/PostContext'; // For optimistic update on delete
import { useAuth } from '../context/AuthContext'; // To check if user is logged in
import LoadingSpinner from '../components/LoadingSpinner';
import MessageBox from '../components/MessageBox';

function PostDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { get } = useApi(); // Only need GET for fetching details
    const { deletePost } = usePosts(); // Use deletePost from PostContext for optimistic UI
    const { user } = useAuth(); // Get current user
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const data = await get(`/posts/${id}`);
                setPost(data);
            } catch (err) {
                console.error('Error fetching post details:', err);
                setError(err.message || 'Failed to fetch post details');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id, get]);

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        setShowDeleteConfirm(false);
        try {
            await deletePost(id); // Call delete from PostContext
            navigate('/'); // Go back to post list after deletion
        } catch (err) {
            console.error('Error deleting post:', err);
            setError(err.message || 'Failed to delete post');
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-red-600 text-center mt-8 text-lg">Error: {error}</div>;
    }

    if (!post) {
        return <div className="text-center mt-8 text-lg text-gray-600">Post not found.</div>;
    }

    // Determine if the current user is the author of the post
    // This assumes your backend returns an 'author' field which is the user's ID
    // And that req.user._id matches this author ID.
    // For now, using post.author as a string, but ideally it would be post.user._id
    const isAuthor = user && post.author === user.name; // Placeholder: adjust based on how you store author

    return (
        <div className="container py-8">
            <div className="bg-white rounded-lg shadow-xl p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
                {post.category && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                        {post.category.name}
                    </span>
                )}
                <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">{post.content}</p>
                <p className="text-gray-500 text-sm mb-6">
                    By <span className="font-semibold">{post.author}</span> on {new Date(post.createdAt).toLocaleDateString()}
                </p>

                {user && ( // Only show edit/delete if logged in
                    <div className="flex space-x-3 mt-6">
                        <Link
                            to={`/posts/edit/${post._id}`}
                            className="btn"
                        >
                            Edit Post
                        </Link>
                        <button
                            onClick={handleDeleteClick}
                            className="btn btn-danger"
                        >
                            Delete Post
                        </button>
                    </div>
                )}
            </div>

            {showDeleteConfirm && (
                <MessageBox
                    title="Confirm Deletion"
                    message="Are you sure you want to delete this post? This action cannot be undone."
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    );
}

export default PostDetails;