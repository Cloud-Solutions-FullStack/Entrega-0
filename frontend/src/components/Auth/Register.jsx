import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { showToast } from "../../utils/toast";
import "../../styles/Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    contrasenia: "",
    confirmar_contrasenia: "",
    imagen_perfil: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.contrasenia !== formData.confirmar_contrasenia) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.contrasenia.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    try {
      await api.post("/usuarios", {
        nombre_usuario: formData.nombre_usuario,
        contrasenia: formData.contrasenia,
        imagen_perfil: formData.imagen_perfil || null,
      });
      showToast("Usuario creado exitosamente");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Error al crear usuario");
    }
  };

  return (
    <Box className="auth-container">
      <Typography variant="h4" gutterBottom>
        Crear Usuario
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit} className="auth-form">
        <TextField
          name="nombre_usuario"
          label="Usuario"
          value={formData.nombre_usuario}
          onChange={(e) =>
            setFormData({ ...formData, nombre_usuario: e.target.value })
          }
          required
          fullWidth
        />
        <TextField
          name="contrasenia"
          label="Contraseña"
          type="password"
          value={formData.contrasenia}
          onChange={(e) =>
            setFormData({ ...formData, contrasenia: e.target.value })
          }
          required
          fullWidth
          helperText="Mínimo 8 caracteres"
        />
        <TextField
          name="confirmar_contrasenia"
          label="Confirmar Contraseña"
          type="password"
          value={formData.confirmar_contrasenia}
          onChange={(e) =>
            setFormData({ ...formData, confirmar_contrasenia: e.target.value })
          }
          required
          fullWidth
        />
        <TextField
          name="imagen_perfil"
          label="URL Imagen de Perfil (Opcional)"
          value={formData.imagen_perfil}
          onChange={(e) =>
            setFormData({ ...formData, imagen_perfil: e.target.value })
          }
          fullWidth
        />
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="submit-button"
          >
            Crear Usuario
          </Button>
          <Button
            variant="outlined"
            fullWidth
            className="back-button"
            onClick={() => navigate("/login")}
          >
            Volver al Login
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default Register;
