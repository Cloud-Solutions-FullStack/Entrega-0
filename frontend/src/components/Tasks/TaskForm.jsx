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
  MenuItem,
  Paper,
  Alert,
} from "@mui/material";

// Gestión de Fechas
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// Estilos
import "../../styles/task.css";

// -----------------------------------------------------------------------------
// Estados de Tarea
// -----------------------------------------------------------------------------
const TASK_STATES = {
  PENDIENTE: "PENDIENTE",
  EN_PROGRESO: "EN_PROGRESO",
  FINALIZADA: "FINALIZADA",
};

// -----------------------------------------------------------------------------
// Formulario de Tareas
// -----------------------------------------------------------------------------
// Props:
// - onSubmit: Función para manejar el envío del formulario
// - error: Mensaje de error a mostrar
const TaskForm = ({ onSubmit, error }) => {
  // Datos del usuario y categorías
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const storedCategories = JSON.parse(
    localStorage.getItem("userCategories") || "[]"
  );

  // Estado del formulario
  const [task, setTask] = useState({
    texto_tarea: "",
    fecha_tentativa_finalizacion: null,
    estado: TASK_STATES.PENDIENTE,
    category_id: "",
    user_id: userId,
  });

  // Manejo del envío del formulario
  // - Valida campos requeridos
  // - Formatea fecha
  // - Envía datos y limpia formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !task.category_id ||
      !task.texto_tarea ||
      !task.fecha_tentativa_finalizacion
    ) {
      return;
    }

    onSubmit({
      texto_tarea: task.texto_tarea,
      fecha_tentativa_finalizacion: dayjs(
        task.fecha_tentativa_finalizacion
      ).format("YYYY-MM-DD"),
      estado: task.estado,
      user_id: task.user_id,
      category_id: parseInt(task.category_id),
    });

    // Limpia el formulario
    setTask({
      texto_tarea: "",
      fecha_tentativa_finalizacion: null,
      estado: TASK_STATES.PENDIENTE,
      category_id: "",
      user_id: userId,
    });
  };

  // -----------------------------------------------------------------------------
  // Renderizado del Componente
  // -----------------------------------------------------------------------------
  return (
    // Contenedor principal del formulario
    <Box className="task-form-container">
      {/* Tarjeta contenedora con elevación nula */}
      <Paper className="task-form-card" elevation={0}>
        {/* Título del formulario con tipografía responsiva */}
        <Typography
          variant="h4"
          sx={{
            fontSize: "clamp(1.5rem, 4vw, 2rem)", // Tamaño adaptativo
            fontWeight: 700,
            color: "#2c3e50",
            mb: 3,
            textAlign: "center",
          }}
        >
          Nueva Tarea
        </Typography>

        {/* Alerta de error condicional */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Formulario de tarea */}
        <form onSubmit={handleSubmit} className="task-form">
          {/* Campo: Descripción de la tarea */}
          <TextField
            name="texto_tarea"
            label="Descripción de la tarea"
            value={task.texto_tarea}
            onChange={(e) => setTask({ ...task, texto_tarea: e.target.value })}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          {/* Campo: Selector de categoría */}
          <TextField
            select
            name="category_id"
            label="Categoría"
            value={task.category_id}
            onChange={(e) => setTask({ ...task, category_id: e.target.value })}
            fullWidth
            required
            sx={{ mb: 2 }}
          >
            {/* Mapeo de categorías disponibles */}
            {storedCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.nombre}
              </MenuItem>
            ))}
          </TextField>

          {/* Campo: Selector de fecha con adaptador DayJS */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha límite"
              value={task.fecha_tentativa_finalizacion}
              onChange={(newValue) =>
                setTask({
                  ...task,
                  fecha_tentativa_finalizacion: newValue,
                })
              }
              disablePast
              sx={{ mb: 3, width: "100%" }}
              slots={{
                textField: (params) => (
                  <TextField {...params} fullWidth required />
                ),
              }}
            />
          </LocalizationProvider>

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
            Crear Tarea
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default TaskForm;
