import axios from 'axios';

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post('http://localhost:8000/token/refresh/', {
      refresh: refreshToken,
    });

    const { access } = response.data;

    // Aktualizuj token dostępu
    localStorage.setItem('accessToken', access);

    return access;
  } catch (err) {
    console.error('Błąd podczas odświeżania tokenu:', err);
    // Opcjonalnie: Wyloguj użytkownika lub poproś o ponowne zalogowanie
  }
};

export default refreshAccessToken;