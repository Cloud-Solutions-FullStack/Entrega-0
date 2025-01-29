import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Alert, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    usuario: '',
    contraseña: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/usuarios/login', {
        nombre_usuario: formData.usuario,
        contrasenia: formData.contraseña
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      console.log("Inicio de sesión exitoso");
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Usuario o contraseña inválidos');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Error al intentar iniciar sesión');
      }
    }
  };

  return (
    <Box className="auth-container">
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Tareas
      </Typography>
      <Typography variant="subtitle1" gutterBottom className="auth-subtitle">
        Inicia sesión para continuar
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit} className="auth-form">
        <TextField
          name="usuario"
          label="Usuario"
          variant="outlined"
          value={formData.usuario}
          onChange={handleChange}
          fullWidth
          required
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
        />
        <Stack spacing={2}>
          <Button 
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            className="submit-button"
          >
            Ingresar
          </Button>
          <Button
            variant="outlined"
            fullWidth
            size="large"
            className="register-button"
            onClick={() => navigate('/register')}
          >
            Crear Usuario
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default Login;