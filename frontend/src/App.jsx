
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/login/signup.jsx';
import Login from './components/login/login.jsx';
import Dashboard from './components/Dashboard.jsx'; // Komponent zawierający PostList i CreatePost
import CreatePost from './components/Post/CreatePost.jsx';
import PostsList from './components/Post/PostsList.jsx';
import Navbar from './components/Navbar.jsx';
import CommentsByPost from './components/Comments/CommentsByPost.jsx';
import { AuthProvider } from './AuthContext.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));

  return (
    <AuthProvider>
      <Router>
        {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
        <Routes>
          {/* Główna ścieżka */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
          />

          {/* Logowanie */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
          />

          {/* Rejestracja */}
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />}
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
          />

          {/* Tworzenie posta */}
          <Route
            path="/createpost"
            element={isAuthenticated ? <CreatePost setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
          />

          {/* Lista postów */}
          <Route
            path="/blogposts"
            element={isAuthenticated ? <PostsList setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
          />

          {/* Komentarze do posta */}
          <Route
            path="/comments/:blogPostId"
            element={isAuthenticated ? <CommentsByPost setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;