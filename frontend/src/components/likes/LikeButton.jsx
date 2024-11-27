import { useState, useEffect } from 'react';
import api from '../../api.jsx'; 
import { Button } from "@mui/material";
import { apiUrl } from "../../config.js";

function LikeButton({ blogPostId, initialLiked,  }) {
  const [isLiked, setIsLiked] = useState(initialLiked); // Czy post jest polubiony
  const [likeId, setLikeId] = useState(null); // ID "like'a"

  useEffect(() => {
    // Opcjonalnie: Możesz pobrać status polubienia dla użytkownika, jeśli nie jest znany
    const fetchLikeStatus = async () => {
      try {
        const response = await api.get(`${apiUrl}likes-status/${blogPostId}/`); // Przykładowy endpoint sprawdzający status
        if (response.data.liked) {
          setIsLiked(true);
          setLikeId(response.data.like_id); // Ustawiamy istniejące ID "like'a"
        }
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    fetchLikeStatus();
  }, [blogPostId]);

  const handleLike = async () => {
    try {
      const response = await api.post(`${apiUrl}like/create/`, { blog_post: blogPostId });
      setIsLiked(true);
      setLikeId(response.data.id); // Ustawiamy ID nowo utworzonego "like'a"
    } catch (error) {
      console.error('Error liking the post:', error);
    }
  };

  const handleUnlike = async () => {
    if (!likeId) return; // Jeśli brak ID, nie możemy usunąć "like'a"

    try {
      await api.delete(`${apiUrl}like/${likeId}/delete/`);
      setIsLiked(false);
      setLikeId(null); // Usuwamy ID "like'a"
    } catch (error) {
      console.error('Error unliking the post:', error);
    }
  };

  return (
    <Button
      onClick={isLiked ? handleUnlike : handleLike}
      variant="contained"
      color={isLiked ? "secondary" : "primary"} // Różne kolory dla różnych stanów
      sx={{
        textTransform: "none", // Wyłączenie wielkich liter
        fontWeight: "bold", // Grubsza czcionka
        padding: "8px 16px", // Odstępy wewnętrzne
        "&:hover": {
          backgroundColor: isLiked ? "secondary.dark" : "primary.dark", // Ciemniejsze tło przy hover
        },
        "&:active": {
          transform: "scale(0.95)", // Lekka animacja wciśnięcia
        },
      }}
    >
      {isLiked ? "Unlike" : "Like"}
    </Button>
  );
}

export default LikeButton;


