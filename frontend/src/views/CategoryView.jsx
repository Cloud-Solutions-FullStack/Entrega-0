import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import CategoryForm from '../components/Categories/CategoryForm';
import { getUserCategories } from '../services/categoryService';

const CategoryView = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const userId = JSON.parse(localStorage.getItem('user')).id;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const userCategories = await getUserCategories(userId);
      setCategories(userCategories);
    } catch (err) {
      setError('Error al cargar las categorías');
    }
  };

  return (
    <Box className="category-view">
      <Typography variant="h4" gutterBottom>
        Configuración de Categorías
      </Typography>
      {categories.length === 0 ? (
        <>
          <Alert severity="info">
            Debes crear al menos dos categorías para continuar
          </Alert>
          <CategoryForm 
            userId={userId} 
            onCategoryCreated={(newCategory) => {
              setCategories([...categories, newCategory]);
            }}
          />
        </>
      ) : categories.length === 1 ? (
        <>
          <Alert severity="warning">
            Necesitas crear una categoría más
          </Alert>
          <CategoryForm 
            userId={userId}
            onCategoryCreated={(newCategory) => {
              setCategories([...categories, newCategory]);
            }}
          />
        </>
      ) : null}
    </Box>
    );
};

export default CategoryView;