import api from "../../api.jsx";
import { Button } from "@mui/material";
import { apiUrl } from "../../config.js";
function DeleteCommentButton({ commentId, onDelete }) {
    const handleDelete = async () => {
        try {
            await api.delete(`${apiUrl}/comment/${commentId}/delete/`, {
            });
            onDelete(commentId);
        } catch (error) {
            console.error('Błąd podczas usuwania komentarza:', error);
            alert('Nie udało się usunąć komentarza.');
        }
    };

    return (
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          sx={{
            textTransform: "none", // Wyłączenie wielkich liter
            fontWeight: "bold",
            padding: "8px 16px",
            "&:hover": {
              backgroundColor: "darkred",
            },
          }}
        >
          Usuń
        </Button>
      );
}

export default DeleteCommentButton;
