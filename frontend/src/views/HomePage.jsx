import React from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box className="home-container">
      <Paper className="content-card" elevation={0}>
        <Typography
          variant="h1"
          className="title"
          sx={{
            fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
            fontWeight: 800,
            color: "#2c3e50",
            mb: 2,
            textAlign: "center",
          }}
        >
          TaskHub
        </Typography>
        <Typography
          variant="h4"
          className="subtitle"
          sx={{
            fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
            color: "#34495e",
            mb: 4,
            textAlign: "center",
          }}
        >
          El centro de tu productividad diaria.
        </Typography>
        <Button
          variant="contained"
          className="action-button"
          onClick={() => navigate("/login")}
          sx={{
            bgcolor: "#2B7781",
            fontSize: "1.2rem",
            py: 1.5,
            px: 4,
            borderRadius: "50px",
            "&:hover": {
              bgcolor: "#2B7781",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(43, 119, 129, 0.4)",
            },
          }}
        >
          Comenzar Ahora
        </Button>
      </Paper>
    </Box>
  );
};

export default HomePage;
