import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Chip, 
  Select, 
  MenuItem 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const TASK_STATES = {
  PENDIENTE: 'Pendiente',
  EN_PROGRESO: 'En Progreso',
  TERMINADA: 'Terminada'
};

const mapBackendToFrontendState = (backendState) => {
  const stateMap = {
    'PENDIENTE': 'Pendiente',
    'EN_PROGRESO': 'En Progreso',
    'TERMINADA': 'Terminada'
  };
  return stateMap[backendState] || 'Pendiente';
};

const mapFrontendToBackendState = (frontendState) => {
  const stateMap = {
    'Pendiente': 'PENDIENTE',
    'En Progreso': 'EN_PROGRESO',
    'Terminada': 'TERMINADA'
  };
  return stateMap[frontendState];
};

const TaskList = ({ tasks, onStatusChange, onDelete }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Pendiente': return 'warning';
      case 'En Progreso': return 'info';
      case 'Terminada': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      {tasks.map((task) => (
        <Card key={task.id} sx={{ mb: 2 }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6">{task.texto_tarea}</Typography>
              <Typography color="textSecondary">
                Fecha límite: {new Date(task.fecha_tentativa_finalizacion).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Select
                value={mapBackendToFrontendState(task.estado)}
                onChange={(e) => onStatusChange(task.id, mapFrontendToBackendState(e.target.value))}
                size="small"
              >
                {Object.values(TASK_STATES).map((status) => (
                  <MenuItem key={status} value={status}>
                    <Chip 
                      label={status} 
                      size="small" 
                      color={getStatusColor(status)}
                    />
                  </MenuItem>
                ))}
              </Select>
              <IconButton onClick={() => onDelete(task.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default TaskList;