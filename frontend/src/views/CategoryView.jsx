import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CategoryForm from "../components/Categories/CategoryForm";
import { getUserCategories } from "../services/categoryService";
import "../styles/categoria.css";

const CategoryView = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const userId = JSON.parse(localStorage.getItem("user")).id;

  const saveCategoriesToStorage = (categories) => {
    localStorage.setItem("userCategories", JSON.stringify(categories));
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
        setError("Error al cargar las categorías");
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (categories.length >= 2) {
      saveCategoriesToStorage(categories);
      navigate("/tareas");
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
      {categories.length === 0 ? (
        <CategoryForm
          userId={userId}
          onCategoryCreated={handleCategoryCreated}
          alertType="info"
          alertMessage="Debes crear al menos dos categorías para continuar"
        />
      ) : categories.length === 1 ? (
        <CategoryForm
          userId={userId}
          onCategoryCreated={handleCategoryCreated}
          alertType="warning"
          alertMessage="Necesitas crear una categoría más"
        />
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
