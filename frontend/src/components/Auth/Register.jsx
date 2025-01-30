import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Paper,
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.contrasenia !== formData.confirmar_contrasenia) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Set default profile image if empty
    const imagen_perfil =
      formData.imagen_perfil ||
      "https://i.pinimg.com/736x/d4/3c/22/d43c22f0698b776391f59313e7b22a73.jpg";

    try {
      await api.post("/usuarios", {
        nombre_usuario: formData.nombre_usuario,
        contrasenia: formData.contrasenia,
        imagen_perfil: imagen_perfil,
      });
      showToast("Usuario creado exitosamente", "success");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Error al crear el usuario");
    }
  };

  return (
    <Box className="auth-container">
      <Paper className="auth-card" elevation={0}>
        <Typography
          variant="h1"
          className="title"
          sx={{
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            fontWeight: 800,
            color: "#2c3e50",
            mb: 2,
            textAlign: "center",
          }}
        >
          TaskHub
        </Typography>
        <Typography
          variant="h4"
          className="subtitle"
          sx={{
            fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
            color: "#34495e",
            mb: 4,
            textAlign: "center",
          }}
        >
          Crea tu cuenta
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <TextField
            name="nombre_usuario"
            label="Nombre de Usuario"
            value={formData.nombre_usuario}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            name="contrasenia"
            label="Contraseña"
            type="password"
            value={formData.contrasenia}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            name="confirmar_contrasenia"
            label="Confirmar Contraseña"
            type="password"
            value={formData.confirmar_contrasenia}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            name="imagen_perfil"
            label="URL Imagen de Perfil (Opcional)"
            value={formData.imagen_perfil}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            placeholder="https://..."
            helperText="Deja en blanco para usar imagen por defecto"
          />
          <Stack spacing={1}>
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
              Registrarse
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/login")}
              sx={{
                color: "#2B7781",
                borderColor: "#2B7781",
                fontSize: "1.1rem",
                py: 1.5,
                borderRadius: "50px",
                "&:hover": {
                  borderColor: "#2980b9",
                  bgcolor: "rgba(52, 152, 219, 0.1)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(43, 119, 129, 0.4)",
                },
              }}
            >
              Volver al Login
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default Register;
