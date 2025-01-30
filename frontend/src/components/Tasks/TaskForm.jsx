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
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "../../styles/task.css";

const TASK_STATES = {
  PENDIENTE: "PENDIENTE",
  EN_PROGRESO: "EN_PROGRESO",
  FINALIZADA: "FINALIZADA",
};

const TaskForm = ({ onSubmit, error }) => {
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const storedCategories = JSON.parse(
    localStorage.getItem("userCategories") || "[]"
  );

  const [task, setTask] = useState({
    texto_tarea: "",
    fecha_tentativa_finalizacion: null,
    estado: TASK_STATES.PENDIENTE,
    category_id: "",
    user_id: userId,
  });

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

    setTask({
      texto_tarea: "",
      fecha_tentativa_finalizacion: null,
      estado: TASK_STATES.PENDIENTE,
      category_id: "",
      user_id: userId,
    });
  };

  return (
    <Box className="task-form-container">
      <Paper className="task-form-card" elevation={0}>
        <Typography
          variant="h4"
          sx={{
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            fontWeight: 700,
            color: "#2c3e50",
            mb: 3,
            textAlign: "center",
          }}
        >
          Nueva Tarea
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="task-form">
          <TextField
            name="texto_tarea"
            label="Descripción de la tarea"
            value={task.texto_tarea}
            onChange={(e) => setTask({ ...task, texto_tarea: e.target.value })}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

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
            {storedCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.nombre}
              </MenuItem>
            ))}
          </TextField>

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
