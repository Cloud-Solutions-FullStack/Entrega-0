// -----------------------------------------------------------------------------
// Autor: Santiago Bobadilla Suarez
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Bibliotecas
// -----------------------------------------------------------------------------

// React y Material-UI
import React, { useState } from "react";
import { TextField, Button, Paper, Alert } from "@mui/material";

// Servicios
import { createCategory } from "../../services/categoryService";

// Estilos
import "../../styles/smallCategoria.css";

// -----------------------------------------------------------------------------
// Formulario Compacto de Categorías
// -----------------------------------------------------------------------------
// Props:
// - userId: ID del usuario actual
// - onCategoryCreated: Callback al crear categoría
const SmallCategoryForm = ({ userId, onCategoryCreated }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  const [error, setError] = useState("");

  // Manejo del envío del formulario
  // - Crea nueva categoría
  // - Limpia formulario al éxito
  // - Maneja errores
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

  // -----------------------------------------------------------------------------
  // Renderizado del Componente
  // -----------------------------------------------------------------------------
  return (
    <Paper className="small-category-form" elevation={0}>
      {/* Mensaje de Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Formulario de Categoría */}
      <form onSubmit={handleSubmit}>
        {/* Campo: Nombre */}
        <TextField
          name="nombre"
          label="Nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
          fullWidth
          sx={{ mb: 2 }}
        />

        {/* Campo: Descripción */}
        <TextField
          name="descripcion"
          label="Descripción"
          value={formData.descripcion}
          onChange={(e) =>
            setFormData({ ...formData, descripcion: e.target.value })
          }
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 3 }}
        />

        {/* Botón de Envío */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "#2B7781",
            fontSize: "1.1rem",
            py: 1.5,
            borderRadius: "50px",
            "&:hover": {
              bgcolor: "#2B7781",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(43, 119, 129, 0.4)",
            },
          }}
        >
          Crear Categoría
        </Button>
      </form>
    </Paper>
  );
};

export default SmallCategoryForm;
