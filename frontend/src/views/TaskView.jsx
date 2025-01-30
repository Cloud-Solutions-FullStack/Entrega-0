import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Collapse,
  Alert,
  Avatar,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import TaskForm from "../components/Tasks/TaskForm";
import SmallCategoryForm from "../components/Categories/smallCategoryForm";
import TaskList from "../components/Tasks/TaskList";
import {
  createTask,
  getTasksByUser,
  updateTask,
  deleteTask,
} from "../services/taskService";
import "../styles/taskView.css";

const TaskView = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;
  const categories = JSON.parse(localStorage.getItem("userCategories") || "[]");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

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

  const getFilteredAndSortedTasks = (categoryId) => {
    return tasks
      .filter(
        (task) =>
          task.category_id === categoryId && task.estado !== "FINALIZADA"
      )
      .sort(
        (a, b) =>
          new Date(a.fecha_tentativa_finalizacion) -
          new Date(b.fecha_tentativa_finalizacion)
      );
  };

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

  const handleCategoryCreated = async (newCategory) => {
    const updatedCategories = [...categories, newCategory];
    localStorage.setItem("userCategories", JSON.stringify(updatedCategories));
    window.location.reload();
  };

  if (loading) {
    return (
      <Box className="task-view-container">
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  return (
    <Box className="task-view-container">
      <Container maxWidth="xl">
        <Box
          className="header-section"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
            py: 2,
            px: 3,
            bgcolor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={user.imagen_perfil}
              sx={{
                width: 60,
                height: 60,
                border: "2px solid #2B7781",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: "#2c3e50",
                fontWeight: 600,
              }}
            >
              {user.nombre_usuario}
            </Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 800,
              color: "#2c3e50",
              textAlign: "center",
              flex: 2,
            }}
          >
            Tareas
          </Typography>

          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <IconButton
              onClick={handleLogout}
              sx={{
                color: "#2B7781",
                "&:hover": {
                  backgroundColor: "rgba(43, 119, 129, 0.1)",
                },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box className="form-section">
              <TaskForm onSubmit={handleCreateTask} error={error} />

              <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => setShowCategoryForm(!showCategoryForm)}
                fullWidth
                sx={{
                  mt: 2,
                  color: "#2B7781",
                  borderColor: "#2B7781",
                  "&:hover": {
                    borderColor: "#2B7781",
                    backgroundColor: "rgba(43, 119, 129, 0.1)",
                  },
                }}
              >
                {showCategoryForm ? "Ocultar" : "Agregar Nueva Categoría"}
              </Button>

              <Collapse in={showCategoryForm}>
                <Box sx={{ mt: 2 }}>
                  <SmallCategoryForm
                    userId={userId}
                    onCategoryCreated={handleCategoryCreated}
                  />
                </Box>
              </Collapse>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box className="tasks-section">
              <Grid container spacing={2}>
                {categories.map((category) => (
                  <Grid
                    item
                    key={category.id}
                    xs={12}
                    md={12 / categories.length}
                  >
                    <Box
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.7)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "20px",
                        p: 2,
                        height: "100%",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#2c3e50",
                          mb: 2,
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        {category.nombre}
                      </Typography>
                      <TaskList
                        tasks={getFilteredAndSortedTasks(category.id)}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TaskView;
