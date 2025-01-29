import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { createCategory } from "../../services/categoryService";
import "../../styles/categoria.css";

const CategoryForm = ({ userId, onCategoryCreated }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCategory = await createCategory({
        ...formData,
        user_id: userId,
      });
      onCategoryCreated(newCategory);
      setFormData({ nombre: "", descripcion: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Error al crear la categoría");
    }
  };

  return (
    <Box className="category-form">
      <Typography variant="h6">Nueva Categoría</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          name="nombre"
          label="Nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          name="descripcion"
          label="Descripción"
          value={formData.descripcion}
          onChange={(e) =>
            setFormData({ ...formData, descripcion: e.target.value })
          }
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          className="submit-button"
        >
          Crear Categoría
        </Button>
      </form>
    </Box>
  );
};

export default CategoryForm;
