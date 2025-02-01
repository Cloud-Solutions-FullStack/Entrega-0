// -----------------------------------------------------------------------------
// Autor: Santiago Bobadilla Suarez
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Bibliotecas
// -----------------------------------------------------------------------------

// React y Material-UI
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
} from "@mui/material";

// Servicios
import { createCategory } from "../../services/categoryService";

// Estilos
import "../../styles/categoria.css";

// -----------------------------------------------------------------------------
// Formulario de Categorías
// -----------------------------------------------------------------------------
// Props:
// - userId: ID del usuario actual
// - onCategoryCreated: Callback al crear categoría
// - alertType: Tipo de alerta (info/warning)
// - alertMessage: Mensaje de alerta
const CategoryForm = ({
  userId,
  onCategoryCreated,
  alertType,
  alertMessage,
}) => {
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
    // Contenedor principal
    <Box className="category-container">
      {/* Tarjeta del formulario */}
      <Paper className="category-card" elevation={0}>
        {/* Título del formulario con tipografía responsiva */}
        <Typography
          variant="h4"
          sx={{
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)", // Tamaño adaptativo
            fontWeight: 700,
            color: "#2c3e50",
            mb: 3,
            textAlign: "center",
          }}
        >
          Nueva Categoría
        </Typography>

        {/* Alerta informativa o de advertencia (condicional) */}
        {alertMessage && (
          <Alert severity={alertType} sx={{ mb: 3, width: "100%" }}>
            {alertMessage}
          </Alert>
        )}

        {/* Alerta de error (condicional) */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
            {error}
          </Alert>
        )}

        {/* Formulario de categoría */}
        <form onSubmit={handleSubmit} className="category-form">
          {/* Campo: Nombre de la categoría */}
          <TextField
            name="nombre"
            label="Nombre"
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            required
            fullWidth
            sx={{ mb: 2 }}
          />

          {/* Campo: Descripción de la categoría */}
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

          {/* Botón de envío con efectos hover */}
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
    </Box>
  );
};

export default CategoryForm;
