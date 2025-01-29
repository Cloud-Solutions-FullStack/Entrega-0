import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const TASK_STATES = {
  PENDIENTE: 'PENDIENTE',
  EN_PROGRESO: 'EN_PROGRESO',
  TERMINADA: 'FINALIZADA'
};

const TaskForm = ({ onSubmit }) => {
  const userId = JSON.parse(localStorage.getItem('user')).id;
  const storedCategories = JSON.parse(localStorage.getItem('userCategories') || '[]');
  
  const [task, setTask] = useState({
    texto_tarea: '',
    fecha_tentativa_finalizacion: null,
    estado: TASK_STATES.PENDIENTE,
    category_id: '',
    user_id: userId
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.category_id || !task.texto_tarea || !task.fecha_tentativa_finalizacion) {
      return;
    }

    onSubmit({
      texto_tarea: task.texto_tarea,
      fecha_tentativa_finalizacion: dayjs(task.fecha_tentativa_finalizacion).format('YYYY-MM-DD'),
      estado: task.estado,
      user_id: task.user_id,
      category_id: parseInt(task.category_id)
    });
    
    setTask({
      texto_tarea: '',
      fecha_tentativa_finalizacion: null,
      estado: TASK_STATES.PENDIENTE,
      category_id: '',
      user_id: userId
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
      <TextField
        name="texto_tarea"
        label="Descripción de la tarea"
        value={task.texto_tarea}
        onChange={(e) => setTask({...task, texto_tarea: e.target.value})}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        select
        name="category_id"
        label="Categoría"
        value={task.category_id}
        onChange={(e) => setTask({...task, category_id: e.target.value})}
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
      <DatePicker
        label="Fecha límite"
        value={task.fecha_tentativa_finalizacion}
        onChange={(newValue) => setTask({
          ...task,
          fecha_tentativa_finalizacion: newValue
        })}
        slots={{
          textField: (params) => (
            <TextField 
              {...params}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
          )
        }}
      />
      <Button 
        type="submit"
        variant="contained"
        fullWidth
        size="large"
      >
        Crear Tarea
      </Button>
    </Box>
  );
};

export default TaskForm;