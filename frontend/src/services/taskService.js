import api from "./api";

export const createTask = async (taskData) => {
  const response = await api.post("/tareas", taskData);
  return response.data;
};

export const getTasksByUser = async (userId) => {
  const response = await api.get(`/usuario/${userId}/tareas`);
  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  console.log("taskData", taskData);
  const response = await api.put(`/tareas/${taskId}`, taskData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tareas/${taskId}`);
  return response.data;
};
