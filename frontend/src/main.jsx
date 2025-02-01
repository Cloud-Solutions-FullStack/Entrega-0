// -----------------------------------------------------------------------------
// Autor: Santiago Bobadilla Suarez
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Bibliotecas
// -----------------------------------------------------------------------------

// React: Biblioteca principal para construir interfaces de usuario
// - React: Funcionalidad core de React
// - ReactDOM: Renderizado de componentes en el DOM
import React from "react";
import ReactDOM from "react-dom/client";

// MUI (Material-UI): Biblioteca de componentes de interfaz
// - LocalizationProvider: Proveedor de localización para fechas
// - AdapterDayjs: Adaptador para trabajar con fechas usando dayjs
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// React-Toastify: Biblioteca para mostrar notificaciones
// - ToastContainer: Contenedor para las notificaciones
import { ToastContainer } from "react-toastify";

// Componentes y Estilos Locales
// - App: Componente principal de la aplicación
// - index.css: Estilos globales
// - ReactToastify.css: Estilos para las notificaciones
import App from "./App";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

// -----------------------------------------------------------------------------
// Renderizado de la Aplicación
// -----------------------------------------------------------------------------
// Renderiza la aplicación en el elemento root
// Usa StrictMode para detectar problemas potenciales
// Configura el proveedor de fechas y el contenedor de notificaciones
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <App />
      <ToastContainer />
    </LocalizationProvider>
  </React.StrictMode>
);
