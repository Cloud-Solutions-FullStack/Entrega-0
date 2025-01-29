import api from "./api";

export const createCategory = async (categoryData) => {
  const response = await api.post("/categorias", categoryData);
  return response.data;
};

export const getUserCategories = async (userId) => {
  const response = await api.get(`/usuario/${userId}/categorias`);
  return response.data;
};
