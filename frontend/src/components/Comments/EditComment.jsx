// EditCommentForm.js
import  { useState } from 'react';
import api from '../../api.jsx';
import { Box, Button, TextField } from "@mui/material";

function EditComment({ comment, onUpdate, onCancel }) {
    const [editedContent, setEditedContent] = useState(comment.content);

    const handleUpdate = async () => {
        try {
            await api.put(`http://127.0.0.1:8000/comment/${comment.id}/update/`, {
                content: editedContent, 
                blog_post: comment.blog_post
            });
            onUpdate(comment.id, editedContent);
        } catch (error) {
            console.error('Błąd podczas edycji komentarza:', error);
            alert('Nie udało się edytować komentarza.');
        }
    };

    return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2, // Odstępy między elementami
            marginTop: 2,
          }}
        >
          {/* Pole edycji komentarza */}
          <TextField
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            placeholder="Edytuj komentarz..."
            sx={{
              backgroundColor: "white",
            }}
          />
    
          {/* Przyciski akcji */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={handleUpdate}
              variant="contained"
              color="primary"
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                padding: "8px 16px",
              }}
            >
              Zapisz
            </Button>
            <Button
              onClick={onCancel}
              variant="outlined"
              color="secondary"
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                padding: "8px 16px",
              }}
            >
              Anuluj
            </Button>
          </Box>
        </Box>
      );
}


export default EditComment;

