import { useEffect, useState } from 'react';
import api from '../../api.jsx'; 
import FilterByCategory from '../FilterByCategory.jsx';
import LikeButton from '../likes/LikeButton.jsx';
import LikesCounter from '../likes/LikesCounter.jsx';
import CreateComment from '../Comments/AddComment.jsx';
import CommentCount from '../Comments/CommentCount.jsx';
import { Link } from 'react-router-dom';
import { Typography, Box, Card, CardContent, Button, CircularProgress, Alert } from "@mui/material";

function PostsList() {
  const [posts, setPosts] = useState([]); // Stan dla postów
  const [loading, setLoading] = useState(true); // Stan dla wskaźnika ładowania
  const [error, setError] = useState(null); // Stan dla błędów
  const [comments, setComments] = useState([]);

  // Pobranie postów z API
    const fetchPosts = async (category = '') => {
      try {
        const response = category
        ? await api.get(`http://127.0.0.1:8000/post_filter_by/category/${category}/`) // Żądanie filtrowane
        : await api.get('http://127.0.0.1:8000/blogposts/'); // Żądanie bez filtra
        const data = response.data;
         // Ustawienie posts na odpowiednią tablicę
        setPosts(data.results || data);
      } catch (err) {
        console.error('Błąd podczas pobierania postów:', err);
        setError('Nie udało się pobrać listy postów.'); // Ustawienie błędu
      } finally {
        setLoading(false); // Zakończenie ładowania
      }
    };

    useEffect(() => {
      fetchPosts();
    }, []);

  // Jeśli trwa ładowanie, wyświetl komunikat
  if (loading) {
    return <p>Ładowanie postów...</p>;
  }

  // Jeśli wystąpił błąd, wyświetl komunikat
  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  const handleCommentAdded = (newComment) => {
    // Dodaj nowy komentarz do istniejącej listy
    setComments((prevComments) => [...prevComments, newComment]);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <FilterByCategory onCategoryChange={(category) => fetchPosts(category)} />
      <Typography variant="h4" component="h2" gutterBottom>
        Lista postów
      </Typography>
      {posts.map((post) => (
        <Card key={post.id} sx={{ marginBottom: 2, padding: 2 }}>
          <CardContent>
            <Typography variant="h5" component="h3" gutterBottom>
              {post.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Autor:</strong> {post.author}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Data publikacji:</strong> {new Date(post.published_date).toLocaleDateString()}
            </Typography>
            <Typography variant="body1">
              {post.content}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Kategorie:</strong>{" "}
              {post.categories.length > 0
                ? post.categories.map((category, index) => (
                    <span key={index}>
                      {category}
                      {index < post.categories.length - 1 ? ", " : ""}
                    </span>
                  ))
                : "Brak kategorii"}
            </Typography>
            <Box display="flex" gap={2} mt={2}>
              <LikeButton blogPostId={post.id} initialLiked={post.liked} />
              <LikesCounter blogPostId={post.id} />
            </Box>
            <Typography variant="h6" component="h3" mt={3}>
              Dodaj komentarz:
            </Typography>
            <CreateComment blogPostId={post.id} onCommentAdded={handleCommentAdded} />
            <CommentCount blogPostId={post.id} />
            <Button
              component={Link}
              to={`/comments/${post.id}`}
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Zobacz komentarze
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default PostsList;