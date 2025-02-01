// -----------------------------------------------------------------------------
// Autor: Santiago Bobadilla Suarez
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Bibliotecas
// -----------------------------------------------------------------------------

// React y Material-UI
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Estilos
import "../../styles/taskList.css";

// -----------------------------------------------------------------------------
// Estados de Tarea y Funciones de Mapeo
// -----------------------------------------------------------------------------

// Estados disponibles para las tareas
const TASK_STATES = {
  PENDIENTE: "Pendiente",
  EN_PROGRESO: "En Progreso",
  FINALIZADA: "Finalizada",
};

// Mapea estados del backend a frontend
const mapBackendToFrontendState = (backendState) => {
  const stateMap = {
    PENDIENTE: "Pendiente",
    EN_PROGRESO: "En Progreso",
    FINALIZADA: "Finalizada",
  };
  return stateMap[backendState] || "Pendiente";
};

// Mapea estados del frontend a backend
const mapFrontendToBackendState = (frontendState) => {
  const stateMap = {
    Pendiente: "PENDIENTE",
    "En Progreso": "EN_PROGRESO",
    Finalizada: "FINALIZADA",
  };
  return stateMap[frontendState];
};

// -----------------------------------------------------------------------------
// Utilidades de Estilo
// -----------------------------------------------------------------------------

// Obtiene colores según el estado de la tarea
const getStatusColor = (status) => {
  const colors = {
    PENDIENTE: {
      bg: "rgba(255, 218, 224, 0.4)", // Rosa suave
      border: "rgba(255, 182, 193, 0.6)",
    },
    EN_PROGRESO: {
      bg: "rgba(176, 229, 235, 0.4)", // Azul suave
      border: "rgba(137, 207, 240, 0.6)",
    },
    FINALIZADA: {
      bg: "rgba(212, 237, 218, 0.4)", // Verde suave
      border: "rgba(177, 219, 187, 0.6)",
    },
  };
  return colors[status] || colors.PENDIENTE;
};

// -----------------------------------------------------------------------------
// Componente Lista de Tareas
// -----------------------------------------------------------------------------
// Props:
// - tasks: Array de tareas a mostrar
// - onStatusChange: Función para cambiar estado
// - onDelete: Función para eliminar tarea
const TaskList = ({ tasks, onStatusChange, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return date.toISOString().split("T")[0];
  };

  // -----------------------------------------------------------------------------
  // Renderizado del Componente
  // -----------------------------------------------------------------------------
  return (
    // Contenedor principal de la lista
    <Box className="task-list">
      {/* Mapeo de tareas a tarjetas */}
      {tasks.map((task) => {
        const statusColors = getStatusColor(task.estado);
        return (
          // Tarjeta de tarea con estilos dinámicos según estado
          <Card
            key={task.id}
            className="task-card"
            sx={{
              bgcolor: statusColors.bg,
              borderColor: statusColors.border,
              "&:hover": {
                bgcolor: statusColors.bg,
                transform: "translateY(-2px)",
                boxShadow: `0 4px 12px ${statusColors.border} !important`,
              },
            }}
          >
            <CardContent sx={{ p: 2 }}>
              {/* Encabezado: Título y botón eliminar */}
              <Box className="task-header">
                <Typography variant="h6" className="task-title">
                  {task.texto_tarea}
                </Typography>
                <IconButton
                  onClick={() => onDelete(task.id)}
                  size="small"
                  className="delete-button"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              {/* Grid de fechas */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {/* Fecha límite */}
                <Grid item xs={6}>
                  <Typography variant="caption" className="date-label">
                    Fecha Límite
                  </Typography>
                  <Typography variant="body2" className="date-value">
                    {formatDate(task.fecha_tentativa_finalizacion)}
                  </Typography>
                </Grid>
                {/* Fecha creación */}
                <Grid item xs={6}>
                  <Typography variant="caption" className="date-label">
                    Fecha Creación
                  </Typography>
                  <Typography variant="body2" className="date-value">
                    {formatDate(task.fecha_creacion)}
                  </Typography>
                </Grid>
              </Grid>

              {/* Selector de estado */}
              <Select
                value={mapBackendToFrontendState(task.estado)}
                onChange={(e) =>
                  onStatusChange(
                    task.id,
                    mapFrontendToBackendState(e.target.value)
                  )
                }
                fullWidth
                size="small"
                className="status-select"
                sx={{
                  mt: 2,
                  bgcolor: "rgba(255, 255, 255, 0.5)",
                  "& .MuiSelect-select": { py: 1 },
                }}
              >
                {/* Opciones de estado */}
                {Object.values(TASK_STATES).map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default TaskList;
