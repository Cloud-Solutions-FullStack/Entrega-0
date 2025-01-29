import React, { useState, useEffect } from 'react';
import { Container, Typography, Alert } from '@mui/material';
import TaskForm from '../components/Tasks/TaskForm';
import TaskList from '../components/Tasks/TaskList';
import { createTask, getTasksByUser, updateTask, deleteTask } from '../services/taskService';

const TaskView = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const userId = JSON.parse(localStorage.getItem('user')).id;
  const categories = JSON.parse(localStorage.getItem('userCategories') || '[]');

  const loadTasks = async () => {
    try {
      const userTasks = await getTasksByUser(userId);
      setTasks(userTasks);
      localStorage.setItem('userTasks', JSON.stringify(userTasks));
    } catch (err) {
      setError('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to load from localStorage first
    const cachedTasks = localStorage.getItem('userTasks');
    if (cachedTasks) {
      setTasks(JSON.parse(cachedTasks));
      setLoading(false);
    }
    loadTasks();
  }, []);

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      localStorage.setItem('userTasks', JSON.stringify(updatedTasks));
    } catch (err) {
      setError('Error al crear la tarea');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { estado: newStatus });
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, estado: newStatus } : task
      );
      setTasks(updatedTasks);
      localStorage.setItem('userTasks', JSON.stringify(updatedTasks));
    } catch (err) {
      setError('Error al actualizar el estado');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem('userTasks', JSON.stringify(updatedTasks));
    } catch (err) {
      setError('Error al eliminar la tarea');
    }
  };

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

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
      <TaskForm onSubmit={handleCreateTask} />
      <TaskList 
        tasks={tasks}
        categories={categories}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </Container>
  );
};

export default TaskView;