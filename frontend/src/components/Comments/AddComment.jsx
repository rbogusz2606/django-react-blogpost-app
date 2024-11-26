import { useState } from "react";
import api from "../../api.jsx";
import { Box, TextField, Button, Typography } from "@mui/material";

const CreateComment = ({ blogPostId, onCommentAdded }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Wyślij POST żądanie do API
      const response = await api.post(
        "https://django-react-blogpost-app.vercel.app//comment/create/", // URL endpointu
        {
          blog_post: blogPostId, 
          content: content, 
        },
      );

      // Wywołaj callback, aby odświeżyć listę komentarzy
      if (onCommentAdded) {
        onCommentAdded(response.data);
      }

      // Wyczyść pole tekstowe
      setContent("");
    } catch (error) {
      // Obsługa błędów
      setError(
        error.response?.data?.detail || "Nie udało się dodać komentarza."
      );
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2, // Odstępy między elementami
        width: "100%",
        maxWidth: 600, // Maksymalna szerokość formularza
      }}
    >
      {/* Pole tekstowe */}
      <TextField
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Napisz komentarz..."
        multiline
        rows={4} // Ustawienie liczby rzędów
        fullWidth
        required
        variant="outlined" // Styl pola tekstowego
        sx={{
          backgroundColor: "white",
        }}
      />

      {/* Błąd */}
      {error && (
        <Typography variant="body2" color="error" sx={{ marginTop: -1 }}>
          {error}
        </Typography>
      )}

      {/* Przycisk */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{
          textTransform: "none", // Wyłączenie wielkich liter
          fontWeight: "bold",
          padding: "10px 20px",
        }}
      >
        Dodaj komentarz
      </Button>
    </Box>
  );
}

export default CreateComment;