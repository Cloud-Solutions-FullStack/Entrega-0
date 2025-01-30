import React, { useState, useEffect } from "react";
import { Container, Typography, Alert, Grid, Box } from "@mui/material";
import TaskForm from "../components/Tasks/TaskForm";
import TaskList from "../components/Tasks/TaskList";
import {
  createTask,
  getTasksByUser,
  updateTask,
  deleteTask,
} from "../services/taskService";

const TaskView = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const userId = JSON.parse(localStorage.getItem("user")).id;
  const categories = JSON.parse(localStorage.getItem("userCategories") || "[]");

  const loadTasks = async () => {
    try {
      const userTasks = await getTasksByUser(userId);
      setTasks(userTasks);
      localStorage.setItem("userTasks", JSON.stringify(userTasks));
    } catch (err) {
      setError("Error al cargar las tareas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedTasks = localStorage.getItem("userTasks");
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
      localStorage.setItem("userTasks", JSON.stringify(updatedTasks));
    } catch (err) {
      setError("Error al crear la tarea");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const cachedTasks = JSON.parse(localStorage.getItem("userTasks") || "[]");
      const currentTask = cachedTasks.find((task) => task.id === taskId);
      if (!currentTask) return;

      const updatedTaskData = {
        texto_tarea: currentTask.texto_tarea,
        fecha_tentativa_finalizacion: currentTask.fecha_tentativa_finalizacion,
        estado: newStatus,
        user_id: currentTask.user_id,
        category_id: currentTask.category_id,
      };

      await updateTask(taskId, updatedTaskData);

      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, estado: newStatus } : task
      );
      setTasks(updatedTasks);
      localStorage.setItem("userTasks", JSON.stringify(updatedTasks));
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Error al actualizar el estado");
      const cachedTasks = localStorage.getItem("userTasks");
      if (cachedTasks) {
        setTasks(JSON.parse(cachedTasks));
      }
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem("userTasks", JSON.stringify(updatedTasks));
    } catch (err) {
      setError("Error al eliminar la tarea");
    }
  };

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Tareas
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      <TaskForm onSubmit={handleCreateTask} />
      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} md={6} key={category.id}>
            <Box
              sx={{
                p: 2,
                bgcolor: "background.paper",
                borderRadius: 1,
                boxShadow: 1,
              }}
            >
              <Typography variant="h6" gutterBottom>
                {category.nombre}
              </Typography>
              <TaskList
                tasks={tasks.filter((task) => task.category_id === category.id)}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TaskView;
