import React, { useState } from "react";
import { TextField, Button, Paper, Alert } from "@mui/material";
import { createCategory } from "../../services/categoryService";
import "../../styles/smallCategoria.css";

const SmallCategoryForm = ({ userId, onCategoryCreated }) => {
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
    <Paper className="small-category-form" elevation={0}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          name="nombre"
          label="Nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
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
  );
};

export default SmallCategoryForm;
