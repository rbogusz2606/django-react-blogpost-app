import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { apiUrl } from "../../config.js";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${apiUrl}signup/`, formData);
      // Wyodrębnij tokeny z odpowiedzi
      const { access, refresh, user } = response.data;
      // Przechowaj tokeny w localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      // Opcjonalnie, przechowaj dane użytkownika
      localStorage.setItem('user', JSON.stringify(user));
      setError(null);
      setSuccess('Pomyślnie zarejestrowano użytkownika!');
      alert("Rejestracja pomyślna!")
      navigate('/login');
    } catch (error) {
      setSuccess(null);
      setError('Rejestracja nie powiodła się. Sprawdź wprowadzone dane.');
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: 2,
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          backgroundColor: "white",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Rejestracja
        </Typography>
        {error && (
          <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography variant="body2" color="success.main" sx={{ marginBottom: 2 }}>
            {success}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nazwa użytkownika"
            variant="outlined"
            fullWidth
            margin="normal"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            label="Hasło"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
            Zarejestruj się
          </Button>
        </form>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          Masz konto?{" "}
          <Link component={RouterLink} to="/login" underline="hover">
            Zaloguj się
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Signup;

