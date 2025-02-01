// -----------------------------------------------------------------------------
// Autor: Santiago Bobadilla Suarez
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Bibliotecas
// -----------------------------------------------------------------------------

// React y Hooks
import React, { useState, useEffect } from "react";

// Componentes de Material-UI
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

// Navegación
import { useNavigate } from "react-router-dom";

// Iconos
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LogoutIcon from "@mui/icons-material/Logout";

// Componentes Locales
import TaskForm from "../components/Tasks/TaskForm";
import SmallCategoryForm from "../components/Categories/smallCategoryForm";
import TaskList from "../components/Tasks/TaskList";

// Servicios
import {
  createTask,
  getTasksByUser,
  updateTask,
  deleteTask,
} from "../services/taskService";

// Estilos
import "../styles/taskView.css";

// -----------------------------------------------------------------------------
// Vista Principal de Tareas
// -----------------------------------------------------------------------------
// Componente que maneja la visualización y gestión de tareas
// - Muestra lista de tareas por categoría
// - Permite crear, actualizar y eliminar tareas
// - Maneja cache local de tareas
// - Integra formulario de categorías
const TaskView = () => {
  // Estado local y navegación
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  // Datos del usuario y categorías
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;
  const categories = JSON.parse(localStorage.getItem("userCategories") || "[]");

  // Manejo de cierre de sesión
  // - Limpia almacenamiento local
  // - Redirecciona a página principal
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Carga de tareas desde el servidor
  // - Obtiene tareas del usuario actual
  // - Actualiza estado local
  // - Guarda en caché local
  // - Maneja errores y estado de carga
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

  // -----------------------------------------------------------------------------
  // Gestión de Tareas y Efectos
  // -----------------------------------------------------------------------------

  // Carga inicial de tareas
  // - Verifica cache local
  // - Carga tareas del servidor
  // - Actualiza estado y cache
  useEffect(() => {
    const cachedTasks = localStorage.getItem("userTasks");
    if (cachedTasks) {
      setTasks(JSON.parse(cachedTasks));
      setLoading(false);
    }
    loadTasks();
  }, []);

  // Filtrado y ordenamiento de tareas
  // - Filtra por categoría
  // - Excluye tareas finalizadas
  // - Ordena por fecha de finalización
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

  // Creación de nuevas tareas
  // - Llama al servicio de creación
  // - Actualiza estado local
  // - Actualiza cache
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

  // Actualización del estado de una tarea
  // - Obtiene la tarea de la caché
  // - Actualiza el estado en el servidor
  // - Actualiza estado local y caché
  // - Maneja errores y restaura desde caché
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const cachedTasks = JSON.parse(localStorage.getItem("userTasks") || "[]");
      const currentTask = cachedTasks.find((task) => task.id === taskId);
      if (!currentTask) return;

      const updatedTaskData = {
        texto_tarea: currentTask.texto_tarea,
        fecha_tentativa_finalizacion:
          currentTask.fecha_tentativa_finalizacion.split("T")[0],
        estado: newStatus,
        user_id: currentTask.user_id,
        category_id: currentTask.category_id,
      };
      console.log("updatedTaskData", updatedTaskData);

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

  // Eliminación de una tarea
  // - Elimina la tarea del servidor
  // - Actualiza estado local y caché
  // - Maneja errores
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

  // Creación de una nueva categoría
  // - Actualiza lista de categorías en caché
  // - Recarga la página para mostrar cambios
  const handleCategoryCreated = async (newCategory) => {
    const updatedCategories = [...categories, newCategory];
    localStorage.setItem("userCategories", JSON.stringify(updatedCategories));
    window.location.reload();
  };

  // Estado de carga
  // - Muestra indicador mientras se cargan los datos
  if (loading) {
    return (
      <Box className="task-view-container">
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  // -----------------------------------------------------------------------------
  // Renderizado del Componente Principal
  // -----------------------------------------------------------------------------
  return (
    // Contenedor principal con estilos base
    <Box className="task-view-container">
      <Container maxWidth="xl">
        {/* Sección del Encabezado */}
        {/* Contiene: Avatar, nombre de usuario, título y botón de logout */}
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
          {/* Avatar y Nombre de Usuario */}
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

          {/* Título Principal */}
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

          {/* Botón de Cerrar Sesión */}
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

        {/* Contenido Principal */}
        <Grid container spacing={3}>
          {/* Sección de Formularios */}
          <Grid item xs={12} md={4}>
            <Box className="form-section">
              {/* Formulario de Creación de Tareas */}
              <TaskForm onSubmit={handleCreateTask} error={error} />

              {/* Botón para Mostrar/Ocultar Formulario de Categorías */}
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

              {/* Formulario de Categorías Colapsable */}
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

          {/* Sección de Lista de Tareas */}
          <Grid item xs={12} md={8}>
            <Box className="tasks-section">
              <Grid container spacing={2}>
                {/* Mapeo de Categorías y sus Tareas */}
                {categories.map((category) => (
                  <Grid
                    item
                    key={category.id}
                    xs={12}
                    md={12 / categories.length}
                  >
                    {/* Contenedor de Tareas por Categoría */}
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
                      {/* Título de la Categoría */}
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
                      {/* Lista de Tareas Filtradas */}
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
