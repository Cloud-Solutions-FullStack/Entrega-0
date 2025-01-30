import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    usuario: "",
    contraseña: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/usuarios/login", {
        nombre_usuario: formData.usuario,
        contrasenia: formData.contraseña,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/categorias");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Usuario o contraseña inválidos");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Error al intentar iniciar sesión");
      }
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
          Inicia sesión para continuar
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <TextField
            name="usuario"
            label="Usuario"
            variant="outlined"
            value={formData.usuario}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            name="contraseña"
            label="Contraseña"
            type="password"
            variant="outlined"
            value={formData.contraseña}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 3 }}
          />
          <Stack spacing={2}>
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
              Iniciar Sesión
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/register")}
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
              Crear Usuario
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
