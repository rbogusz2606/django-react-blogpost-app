import { useState, useEffect } from 'react';
import api from '../api.jsx';
import { Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { apiUrl } from "../../config.js";

function FilterByCategory({ onCategoryChange }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Pobranie listy kategorii z API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(`${apiUrl}/category-list`); // Endpoint zwracający listę kategorii
        setCategories(response.data);
      } catch (error) {
        console.error('Błąd podczas pobierania kategorii:', error);
      }
    };

    fetchCategories();
  }, []);

  // Obsługa zmiany wybranej kategorii
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    onCategoryChange(category); // Wywołanie callbacku z wybraną kategorią
  };

  return (
    <Box sx={{ marginBottom: 4 }}>
      <FormControl fullWidth sx={{ maxWidth: 400 }}>
        <InputLabel id="category-filter-label">Filtruj według kategorii</InputLabel>
        <Select
          labelId="category-filter-label"
          value={selectedCategory}
          onChange={handleCategoryChange}
          label="Filtruj według kategorii"
        >
          <MenuItem value="">
            <em>Wszystkie</em>
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.name}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default FilterByCategory;