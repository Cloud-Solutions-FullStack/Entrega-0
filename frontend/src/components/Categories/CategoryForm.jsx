import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import { createCategory } from "../../services/categoryService";
import "../../styles/categoria.css";

const CategoryForm = ({
  userId,
  onCategoryCreated,
  alertType,
  alertMessage,
}) => {
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
    <Box className="category-container">
      <Paper className="category-card" elevation={0}>
        <Typography
          variant="h4"
          sx={{
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            fontWeight: 700,
            color: "#2c3e50",
            mb: 3,
            textAlign: "center",
          }}
        >
          Nueva Categoría
        </Typography>

        {alertMessage && (
          <Alert severity={alertType} sx={{ mb: 3, width: "100%" }}>
            {alertMessage}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="category-form">
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
