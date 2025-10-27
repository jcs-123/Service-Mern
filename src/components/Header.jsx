import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  VpnKey,
  Badge,
  Person,
} from "@mui/icons-material";

function Header({ handleDrawerToggle }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const userName = localStorage.getItem("name") || "John Smith";
  const department = localStorage.getItem("department") || "Computer Science";

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleChangePassword = () => {
    alert("🔒 Change Password feature coming soon!");
  };

  const handleChangePosition = () => {
    alert("⚙️ Change Position feature coming soon!");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        height: "64px",
        background:
          "linear-gradient(135deg, #07a7f1 0%, #81D4FA 50%, #4FC3F7 100%)",
        borderBottom: "2px solid rgba(0,0,0,0.7)",
        boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, sm: 3 },
          height: "64px",
        }}
      >
        {/* ==== Left Section: Menu Icon + Title ==== */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" },
              color: "black",
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.15rem", sm: "1.35rem" },
              letterSpacing: 0.7,
              textTransform: "uppercase",
              color: "#000",
              textShadow: "0 1px 2px rgba(255,255,255,0.4)",
              userSelect: "none",
            }}
          >
            Service Book
          </Typography>
        </Box>

        {/* ==== Right Section: Profile Menu ==== */}
        <Box>
          <Button
            color="inherit"
            onClick={handleMenuOpen}
            sx={{
              minWidth: "auto",
              p: 0.8,
              borderRadius: "50%",
              border: "2px solid rgba(0,0,0,0.7)",
              transition: "all 0.3s ease",
              backgroundColor: "rgba(255,255,255,0.4)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.6)",
                transform: "scale(1.05)",
                boxShadow: "0 0 8px rgba(0,0,0,0.2)",
              },
            }}
          >
            <AccountCircle sx={{ fontSize: 28, color: "black" }} />
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 4,
              sx: {
                mt: 1.5,
                borderRadius: 2,
                border: "1.5px solid rgba(0,0,0,0.5)",
                overflow: "visible",
                minWidth: 230,
                bgcolor: "rgba(255,255,255,0.95)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {/* User Info */}
            <MenuItem disabled>
              <ListItemIcon>
                <Person sx={{ color: "black" }} />
              </ListItemIcon>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {userName}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.75rem" }}
                >
                  {department}
                </Typography>
              </Box>
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            {/* Options */}
            <MenuItem onClick={handleChangePosition}>
              <ListItemIcon>
                <Badge fontSize="small" sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText primary="Change Position" />
            </MenuItem>

            <MenuItem onClick={handleChangePassword}>
              <ListItemIcon>
                <VpnKey fontSize="small" sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText primary="Change Password" />
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            {/* Logout */}
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
