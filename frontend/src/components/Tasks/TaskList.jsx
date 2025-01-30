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
import "../../styles/taskList.css";

const TASK_STATES = {
  PENDIENTE: "Pendiente",
  EN_PROGRESO: "En Progreso",
  FINALIZADA: "Finalizada",
};

const mapBackendToFrontendState = (backendState) => {
  const stateMap = {
    PENDIENTE: "Pendiente",
    EN_PROGRESO: "En Progreso",
    FINALIZADA: "Finalizada",
  };
  return stateMap[backendState] || "Pendiente";
};

const mapFrontendToBackendState = (frontendState) => {
  const stateMap = {
    Pendiente: "PENDIENTE",
    "En Progreso": "EN_PROGRESO",
    Finalizada: "FINALIZADA",
  };
  return stateMap[frontendState];
};

const getStatusColor = (status) => {
  const colors = {
    PENDIENTE: {
      bg: "rgba(255, 218, 224, 0.4)", // Soft pink
      border: "rgba(255, 182, 193, 0.6)",
    },
    EN_PROGRESO: {
      bg: "rgba(176, 229, 235, 0.4)", // Soft blue
      border: "rgba(137, 207, 240, 0.6)",
    },
    FINALIZADA: {
      bg: "rgba(212, 237, 218, 0.4)", // Soft green
      border: "rgba(177, 219, 187, 0.6)",
    },
  };
  return colors[status] || colors.PENDIENTE;
};

const TaskList = ({ tasks, onStatusChange, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Box className="task-list">
      {tasks.map((task) => {
        const statusColors = getStatusColor(task.estado);
        return (
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

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" className="date-label">
                    Fecha Límite
                  </Typography>
                  <Typography variant="body2" className="date-value">
                    {formatDate(task.fecha_tentativa_finalizacion)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" className="date-label">
                    Fecha Creación
                  </Typography>
                  <Typography variant="body2" className="date-value">
                    {formatDate(task.fecha_creacion)}
                  </Typography>
                </Grid>
              </Grid>

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
