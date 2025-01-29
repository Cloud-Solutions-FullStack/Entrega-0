import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CategoryForm from '../components/Categories/CategoryForm';
import { getUserCategories } from '../services/categoryService';

const CategoryView = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const userId = JSON.parse(localStorage.getItem('user')).id;

  const saveCategoriesToStorage = (categories) => {
    localStorage.setItem('userCategories', JSON.stringify(categories));
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const userCategories = await getUserCategories(userId);
        setCategories(userCategories);
        if (userCategories.length >= 2) {
          saveCategoriesToStorage(userCategories);
        }
      } catch (err) {
        setError('Error al cargar las categorías');
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (categories.length >= 2) {
      saveCategoriesToStorage(categories);
      navigate('/tareas');
    }
  }, [categories, navigate]);

  const handleCategoryCreated = (newCategory) => {
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    if (updatedCategories.length >= 2) {
      saveCategoriesToStorage(updatedCategories);
    }
  };

  return (
    <Box className="category-view">
      <Typography variant="h4" component="h1" gutterBottom>
        Configuración de Categorías
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {categories.length === 0 ? (
        <>
          <Alert severity="info" sx={{ mb: 2 }}>
            Debes crear al menos dos categorías para continuar
          </Alert>
          <CategoryForm 
            userId={userId} 
            onCategoryCreated={handleCategoryCreated}
          />
        </>
      ) : categories.length === 1 ? (
        <>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Necesitas crear una categoría más
          </Alert>
          <CategoryForm 
            userId={userId}
            onCategoryCreated={handleCategoryCreated}
          />
        </>
      ) : (
        <Box className="loading-view">
          <Typography variant="h6">
            Redirigiendo al gestor de tareas...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CategoryView;