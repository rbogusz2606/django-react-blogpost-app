import api from "../../api.jsx";
import { Button } from "@mui/material";

function DeleteCommentButton({ commentId, onDelete }) {
    const handleDelete = async () => {
        try {
            await api.delete(`http://127.0.0.1:8000/comment/${commentId}/delete/`, {
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
