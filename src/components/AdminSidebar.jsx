import React from "react";
import {
  Drawer,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Typography,
} from "@mui/material";
import {
  Dashboard,
  People,
  Work,
  School,
  Settings,
  Logout,
  AdminPanelSettings,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 260;

const AdminSidebar = ({ mobileOpen, handleDrawerToggle, handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

 // 📦 Menu Items for Admin Sidebar
const menuItems = [
  {
    text: "Dashboard",
    icon: <Dashboard />,
    path: "/adminpanel", // ✅ correct route name
  },
  {
    text: "Excel Export",
    icon: <People />, // you can change to a more fitting icon if needed
    path: "/adminexcelexport", // ✅ sample export route
  },
];


  const drawer = (
    <Box
      sx={{
        height: "100vh", // Full viewport height
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
        color: "#333",
        borderRight: "3px solid #000000",
        boxShadow: "4px 0 12px rgba(0,0,0,0.15)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 50%, #1976d2 100%)",
          zIndex: 1,
        },
      }}
    >
      {/* === Sidebar Header - Fixed Blue Background === */}
      <Box
        sx={{
          p: 2,
          textAlign: "center",
          borderBottom: "2px solid #e0e0e0",
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
          position: "relative",
          zIndex: 2,
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -2,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, transparent 0%, #000000 50%, transparent 100%)",
          },
        }}
      >
        <AdminPanelSettings sx={{ fontSize: 32, mb: 1 }} />
        <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: 0.5 }}>
          ADMIN PANEL
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9 }}>
          Service Book System
        </Typography>
      </Box>

      {/* === Menu Items - Scrollable Area === */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List sx={{ px: 1.5, mt: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  my: 0.6,
                  borderRadius: "12px",
                  border: isActive
                    ? "2px solid #1976d2"
                    : "1px solid transparent",
                  background: isActive
                    ? "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)"
                    : "transparent",
                  transition: "all 0.3s ease",
                  boxShadow: isActive ? "0 4px 12px rgba(25, 118, 210, 0.3)" : "none",
                  "&:hover": {
                    background: isActive 
                      ? "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)"
                      : "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                    transform: "translateX(8px) scale(1.02)",
                    borderColor: "#1976d2",
                    boxShadow: "0 6px 16px rgba(25, 118, 210, 0.2)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "#ffffff" : "#1976d2",
                    minWidth: 42,
                    transition: "all 0.3s ease",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    "& span": {
                      color: isActive ? "#ffffff" : "#333",
                      fontWeight: isActive ? 700 : 600,
                      letterSpacing: 0.3,
                      fontSize: "0.95rem",
                      transition: "all 0.3s ease",
                    },
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ 
        bgcolor: "#000000", 
        height: "2px",
        mx: 2,
      }} />

      {/* === Logout Button - Fixed at Bottom === */}
      <Box sx={{ p: 2, borderTop: "2px solid #e0e0e0", flexShrink: 0 }}>
        <Button
          startIcon={<Logout sx={{ fontSize: 20 }} />}
          onClick={handleLogout}
          fullWidth
          variant="outlined"
          sx={{
            color: "#d32f2f",
            borderColor: "#d32f2f",
            fontWeight: 700,
            borderRadius: "10px",
            py: 1.2,
            borderWidth: "2px",
            background: "linear-gradient(135deg, #ffffff 0%, #fff5f5 100%)",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#d32f2f",
              color: "#ffffff",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 16px rgba(211, 47, 47, 0.3)",
              borderColor: "#d32f2f",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          border: "none",
          top: 0, // Start from top of page
          height: "100vh", // Full viewport height
          position: "fixed",
          zIndex: (theme) => theme.zIndex.drawer,
          overflow: "hidden",
        },
      }}
    >
      {/* === Mobile Drawer === */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          zIndex: (theme) => theme.zIndex.modal + 1,
          "& .MuiDrawer-paper": {
            top: 0,
            height: "100vh",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* === Desktop Drawer === */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            top: 0,
            height: "100vh",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default AdminSidebar;