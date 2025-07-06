// client/src/components/PostCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function PostCard({ post }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">
                <Link to={`/posts/${post._id}`} className="hover:underline">
                    {post.title}
                </Link>
            </h2>
            <p className="text-gray-600 mb-3">
                {post.content.substring(0, 150)}{post.content.length > 150 ? '...' : ''}
            </p>
            {post.category && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-3">
                    {post.category.name}
                </span>
            )}
            <div className="flex justify-end space-x-2">
                <Link
                    to={`/posts/${post._id}`}
                    className="btn btn-outline"
                >
                    Read More
                </Link>
                {/* Edit button will be conditionally rendered based on user ownership/admin role in a real app */}
                {/* <Link to={`/posts/edit/${post._id}`} className="btn">
                    Edit
                </Link> */}
            </div>
        </div>
    );
}

export default PostCard;