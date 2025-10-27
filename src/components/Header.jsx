import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { Menu as MenuIcon, AccountCircle } from "@mui/icons-material";

function Header({ handleDrawerToggle }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        height: "64px",
        background: "linear-gradient(135deg, #07a7f1ff 0%, #81D4FA 50%, #4FC3F7 100%)",
        borderBottom: "2px solid rgba(0,0,0,0.7)", // subtle black border line
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
          {/* Mobile menu toggle */}
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

          {/* Title */}
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

        {/* ==== Right Section: Profile Button ==== */}
        <Button
          color="inherit"
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
      </Toolbar>
    </AppBar>
  );
}

export default Header;
