import React, { useState } from "react";
import { Box, Toolbar, Typography, CssBaseline } from "@mui/material";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import { ToastContainer, toast } from "react-toastify";

const drawerWidth = 240;

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logging out...");
    setTimeout(() => (window.location.href = "/login"), 1000);
  };

  const userName = localStorage.getItem("name") || "Admin";
  const userGmail = localStorage.getItem("gmail") || "admin@jec.ac.in";

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AdminHeader
        handleDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
        userName={userName}
        userGmail={userGmail}
        handleLogout={handleLogout}
      />
      <AdminSidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        handleLogout={handleLogout}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: "#F5F9FF",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Typography variant="h4" fontWeight={700} color="#0D47A1" mb={2}>
          Welcome, {userName}!
        </Typography>
        <Typography variant="body1" mb={3}>
          Use the sidebar to manage Consultancy, Projects, and more.
        </Typography>

        <Box
          sx={{
            background: "white",
            p: 3,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h6" color="#1565C0" fontWeight={600}>
            Quick Stats
          </Typography>
          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
            <StatCard color="#E3F2FD" text="Consultancy Projects" value="32" />
            <StatCard color="#E8F5E9" text="Guided Projects" value="18" />
            <StatCard color="#FFF8E1" text="Faculty Research" value="14" />
          </Box>
        </Box>
      </Box>
      <ToastContainer position="top-center" autoClose={2000} />
    </Box>
  );
};

// Small reusable stat card
const StatCard = ({ color, text, value }) => (
  <Box
    sx={{
      flex: "1 1 200px",
      p: 2,
      borderRadius: 2,
      bgcolor: color,
      textAlign: "center",
    }}
  >
    <Typography variant="h5" fontWeight="bold" color="#1565C0">
      {value}
    </Typography>
    <Typography variant="body2">{text}</Typography>
  </Box>
);

export default AdminDashboard;
