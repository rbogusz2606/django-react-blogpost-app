import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";

function Logout({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Usuń tokeny z localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Aktualizacja stanu autoryzacji
    setIsAuthenticated(false);

    // Przekierowanie do strony logowania
    navigate('/login');
  };

  return (
    <Button
      onClick={handleLogout}
      variant="contained" // Styl przycisku: "contained" (wypełniony)
      color="secondary" // Użycie koloru z motywu
      sx={{
        textTransform: "none", // Wyłącz wielkie litery
        fontSize: "1rem", // Rozmiar czcionki
        fontWeight: "bold", // Grubość czcionki
        padding: "10px 20px", // Wewnętrzny odstęp
        boxShadow: "none", // Wyłącz domyślny cień
        "&:hover": {
          backgroundColor: "secondary.dark", // Ciemniejszy kolor na hover
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Lekki cień przy hover
        },
        "&:active": {
          transform: "scale(0.95)", // Skalowanie przy kliknięciu
        },
      }}
    >
      Wyloguj się
    </Button>
  );
}

export default Logout;