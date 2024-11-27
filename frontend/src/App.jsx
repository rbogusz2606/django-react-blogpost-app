
import { useState} from 'react';
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
    <Router>
      <Routes>
        {/* Publiczne ścieżki (bez AuthProvider) */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />

        {/* Prywatne ścieżki (wymagające AuthProvider) */}
        <Route
          path="*"
          element={
            <AuthProvider>
              {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
              <Routes>
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/createpost" element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" />} />
                <Route path="/blogposts" element={isAuthenticated ? <PostsList /> : <Navigate to="/login" />} />
                <Route path="/comments/:blogPostId" element={isAuthenticated ? <CommentsByPost /> : <Navigate to="/login" />} />
              </Routes>
            </AuthProvider>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;