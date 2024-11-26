import { useState, useEffect } from 'react';
import api from '../../api.jsx'; 

function LikesCounter({ blogPostId }) {
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchLikesCount = async () => {
      try {
        const response = await api.get(`http://localhost:8000/likes-count/${blogPostId}/`);
        setLikesCount(response.data.likes_count);
      } catch (error) {
        console.error('Error fetching likes count:', error);
      }
    };

    fetchLikesCount();
  }, [blogPostId]);

  return (
    <div>
      <p>Liczba polubień: {likesCount}</p>
    </div>
  );
}

export default LikesCounter;
