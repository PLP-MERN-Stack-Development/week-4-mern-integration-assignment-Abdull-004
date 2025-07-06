// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PostProvider } from './context/PostContext';
import { CategoryProvider } from './context/CategoryContext';

// Components
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Home from './pages/Home';
import PostDetails from './pages/PostDetails';
import PostForm from './pages/PostForm';
import Login from './pages/Login';
import Register from './pages/Register';

// A simple wrapper for protected routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Redirect to login page, but remember the original path
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      {/* Wrap the entire app with AuthProvider first, as other contexts/hooks depend on it */}
      <AuthProvider>
        {/* Navbar needs access to AuthContext */}
        <Navbar />
        <div className="min-h-[calc(100vh-64px)]"> {/* Adjust height based on navbar */}
          {/* Post and Category providers can be nested as they don't directly depend on AuthProvider's state for initialization, but their internal hooks will use `useAuth` */}
          <PostProvider>
            <CategoryProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/posts/:id" element={<PostDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                  path="/posts/new"
                  element={
                    <ProtectedRoute>
                      <PostForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/posts/edit/:id"
                  element={
                    <ProtectedRoute>
                      <PostForm />
                    </ProtectedRoute>
                  }
                />
                {/* Add more protected routes here if needed */}
              </Routes>
            </CategoryProvider>
          </PostProvider>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App; // <--- THIS LINE IS CRUCIAL
