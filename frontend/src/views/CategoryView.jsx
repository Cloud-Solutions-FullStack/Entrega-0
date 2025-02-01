// -----------------------------------------------------------------------------
// Autor: Santiago Bobadilla Suarez
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Bibliotecas
// -----------------------------------------------------------------------------

// React y Material-UI
// - React, useState, useEffect: Hooks base de React
// - Box, Typography: Componentes de Material-UI
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

// Navegación
// - useNavigate: Hook para navegación programática
import { useNavigate } from "react-router-dom";

// Componentes y Servicios Locales
import CategoryForm from "../components/Categories/CategoryForm";
import { getUserCategories } from "../services/categoryService";

// Estilos
import "../styles/categoria.css";

// -----------------------------------------------------------------------------
// Vista de Categorías
// -----------------------------------------------------------------------------
// Componente que maneja la creación inicial de categorías
// - Requiere mínimo 2 categorías para continuar
// - Redirecciona a tareas cuando se cumple el requisito
const CategoryView = () => {
  // Navegación y estado
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const userId = JSON.parse(localStorage.getItem("user")).id;

  // Guarda categorías en almacenamiento local
  const saveCategoriesToStorage = (categories) => {
    localStorage.setItem("userCategories", JSON.stringify(categories));
  };

  // Carga inicial de categorías
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const userCategories = await getUserCategories(userId);
        setCategories(userCategories);
        if (userCategories.length >= 2) {
          saveCategoriesToStorage(userCategories);
        }
      } catch (err) {
        setError("Error al cargar las categorías");
      }
    };
    loadCategories();
  }, []);

  // Redirección automática cuando hay suficientes categorías
  useEffect(() => {
    if (categories.length >= 2) {
      saveCategoriesToStorage(categories);
      navigate("/tareas");
    }
  }, [categories, navigate]);

  // Manejo de creación de categorías
  const handleCategoryCreated = (newCategory) => {
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    if (updatedCategories.length >= 2) {
      saveCategoriesToStorage(updatedCategories);
    }
  };

  // Renderizado condicional basado en cantidad de categorías
  return (
    <Box className="category-view">
      {categories.length === 0 ? (
        // Sin categorías: Muestra formulario con mensaje inicial
        <CategoryForm
          userId={userId}
          onCategoryCreated={handleCategoryCreated}
          alertType="info"
          alertMessage="Debes crear al menos dos categorías para continuar"
        />
      ) : categories.length === 1 ? (
        // Una categoría: Muestra formulario con mensaje de advertencia
        <CategoryForm
          userId={userId}
          onCategoryCreated={handleCategoryCreated}
          alertType="warning"
          alertMessage="Necesitas crear una categoría más"
        />
      ) : (
        // Dos o más categorías: Muestra mensaje de redirección
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
