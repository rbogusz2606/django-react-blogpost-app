import  { useEffect, useState } from 'react';
import api from '../../api.jsx';
import { Link } from 'react-router-dom';
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Alert } from "@mui/material";

function CreatePost() {
  const [title, setTitle] = useState(''); // Stan dla tytułu posta
  const [content, setContent] = useState(''); // Stan dla treści posta
  const [categories, setCategories] = useState([]); // Stan dla listy kategorii pobranych z API
  const [selectedCategory, setSelectedCategory] = useState(''); // Stan dla wybranej kategorii
  const [error, setError] = useState(null); // Stan dla przechowywania ewentualnych błędów

  // Pobieranie listy kategorii po zamontowaniu komponentu
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('http://127.0.0.1:8000/category-list/'); // Pobieranie kategorii z API
        setCategories(response.data); // Zapisanie kategorii w stanie
      } catch (error) {
        console.error("Błąd podczas pobierania kategorii:", error);
        setError("Nie udało się pobrać kategorii."); // Ustawienie błędu w przypadku problemów
      }
    };

    fetchCategories();
  }, []);

  // Obsługa zmiany kategorii w polu wyboru
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value); // Aktualizacja wybranej kategorii
  };

  // Obsługa wysłania formularza
  const handleSubmit = async (e) => {
    e.preventDefault(); // Zapobiega przeładowaniu strony po wysłaniu formularza
    setError(null); // Resetowanie stanu błędu

    // Sprawdzenie, czy kategoria została wybrana
    if (!selectedCategory) {
      setError("Proszę wybrać kategorię."); // Ustawienie błędu, jeśli kategoria nie została wybrana
      return;
    }

    try {
      // Wysłanie danych posta do API
      await api.post('http://127.0.0.1:8000/blogposts/create/', {
        title,
        content,
        categories: [selectedCategory], // Przekazanie wybranej kategorii jako lista UUID
      });
      alert("Post utworzony!")
      // Resetowanie pól formularza po udanym wysłaniu
      setTitle('');
      setContent('');
      setSelectedCategory('');
      
    } catch (error) {
      console.error("Błąd podczas tworzenia postu:", error.response?.data || error.message);
      setError("Wystąpił błąd podczas tworzenia posta."); // Wyświetlenie komunikatu o błędzie
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: "0 auto" }}>
      {/* Nagłówek */}
      <Typography variant="h4" gutterBottom>
        Utwórz nowy post
      </Typography>

      {/* Linki */}
      <Box sx={{ display: "flex", gap: 2, marginBottom: 3 }}>
        <Button
          component={Link}
          to="/blogposts"
          variant="outlined"
          color="primary"
        >
          Wyświetl wszystkie posty
        </Button>
        <Button
          component={Link}
          to="/"
          variant="outlined"
          color="secondary"
        >
          Wróć do strony głównej
        </Button>
      </Box>

      {/* Formularz */}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Tytuł */}
        <TextField
          label="Tytuł"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />

        {/* Treść */}
        <TextField
          label="Treść"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          multiline
          rows={4}
          fullWidth
        />

        {/* Kategoria */}
        <FormControl fullWidth required>
          <InputLabel id="category-label">Kategoria</InputLabel>
          <Select
            labelId="category-label"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <MenuItem value="">
              <em>Wybierz kategorię</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Błędy */}
        {error && (
          <Alert severity="error">{error}</Alert>
        )}

        {/* Przycisk publikacji */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Opublikuj
        </Button>
      </Box>
    </Box>
  );
}

export default CreatePost;

