import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api.jsx';
import EditComment from './EditComment';
import DeleteCommentButton from './DeleteComment';
import AuthContext from '../../AuthContext.jsx';
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { apiUrl } from "../../config.js";

function CommentsByPost() {
    const { blogPostId } = useParams(); // Pobierz blogPostId z trasy
    const [comments, setComments] = useState([]);
    const [editingCommentId, setEditingCommentId] = useState(null); // Stan dla edytowanego komentarza

    const { currentUser } = useContext(AuthContext); // Uzyskaj aktualnego użytkownika z kontekstu

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.get(`${apiUrl}comments/${blogPostId}/`);
                setComments(response.data);
            } catch (error) {
                console.error('Błąd podczas pobierania komentarzy:', error);
            }
        };

        fetchComments();
    }, [blogPostId]);

    const handleDelete = (deletedCommentId) => {
        setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== deletedCommentId)
        );
    };

    const handleEdit = (commentId) => {
        setEditingCommentId(commentId);
    };

    const handleUpdate = (commentId, updatedContent) => {
        setComments((prevComments) =>
            prevComments.map((comment) =>
                comment.id === commentId ? { ...comment, content: updatedContent } : comment
            )
        );
        setEditingCommentId(null);
    };

    const handleCancel = () => {
        setEditingCommentId(null);
    };

    return (
        <Box sx={{ padding: 2 }}>
          {/* Nagłówek */}
          <Typography variant="h4" gutterBottom>
            Komentarze dla posta {blogPostId}
          </Typography>
    
          {/* Lista komentarzy */}
          {comments.map((comment) => {
            const canEditOrDelete =
              currentUser &&
              (currentUser.username === comment.author || currentUser.is_superuser);
    
            return (
              <Card key={comment.id} sx={{ marginBottom: 2 }}>
                <CardContent>
                  {editingCommentId === comment.id ? (
                    <EditComment
                      comment={comment}
                      onUpdate={handleUpdate}
                      onCancel={handleCancel}
                    />
                  ) : (
                    <>
                      {/* Treść komentarza */}
                      <Typography variant="body1" gutterBottom>
                        {comment.content}
                      </Typography>
                      {/* Autor komentarza */}
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Autor: {comment.author}
                      </Typography>
                      {/* Akcje: Edytuj/Usuń */}
                      {canEditOrDelete && (
                        <Box sx={{ display: "flex", gap: 1, marginTop: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(comment.id)}
                          >
                            Edytuj
                          </Button>
                          <DeleteCommentButton
                            commentId={comment.id}
                            onDelete={handleDelete}
                          />
                        </Box>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Box>
      );
    }

export default CommentsByPost;