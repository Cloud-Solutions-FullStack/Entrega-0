import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import CategoryView from "./views/CategoryView";
import TaskView from "./views/TaskView";
import HomePage from "./views/HomePage";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/categorias"
          element={
            <PrivateRoute>
              <CategoryView />
            </PrivateRoute>
          }
        />
        <Route
          path="/tareas"
          element={
            <PrivateRoute>
              <TaskView />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
