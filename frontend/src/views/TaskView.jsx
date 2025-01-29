import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  TextField, 
  MenuItem,
  Alert 
} from '@mui/material';
import TaskForm from '../components/Tasks/TaskForm';
import TaskList from '../components/Tasks/TaskList';
import { createTask, getTasksByUser, updateTask, deleteTask } from '../services/taskService';
import { getUserCategories } from '../services/categoryService';

const TaskView = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('fecha_creacion');
  const [error, setError] = useState('');
  const userId = JSON.parse(localStorage.getItem('user')).id;

  const loadCategories = async () => {
    try {
      const userCategories = await getUserCategories(userId);
      setCategories(userCategories);
    } catch (err) {
      setError('Error al cargar las categorías');
    }
  };

  const loadTasks = async () => {
    try {
      const userTasks = await getTasksByUser(userId);
      setTasks(userTasks);
    } catch (err) {
      setError('Error al cargar las tareas');
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await createTask({
        ...taskData,
        user_id: userId
      });
      setTasks([...tasks, newTask]);
    } catch (err) {
      setError('Error al crear la tarea');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { estado: newStatus });
      loadTasks(); // Reload tasks after update
    } catch (err) {
      setError('Error al actualizar el estado de la tarea');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Error al eliminar la tarea');
    }
  };

  useEffect(() => {
    loadTasks();
    loadCategories();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Tareas
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TaskForm 
        categories={categories} 
        onSubmit={handleCreateTask}
      />
      <TaskList 
        tasks={tasks}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </Container>
  );
};

export default TaskView;