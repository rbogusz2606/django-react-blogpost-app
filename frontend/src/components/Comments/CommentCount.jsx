import  { useEffect, useState } from "react";
import api from "../../api.jsx";

const CommentCount = ({ blogPostId }) => {
  const [commentCount, setCommentCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const response = await api.get(
          `http://localhost:8000/comments/count/${blogPostId}/`, 
        );
        setCommentCount(response.data.comment_count);
      } catch (error) {
        setError("Nie udało się pobrać liczby komentarzy.");
      }
    };

    fetchCommentCount();
  }, [blogPostId]);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return <p>Liczba komentarzy: {commentCount}</p>;
};

export default CommentCount;