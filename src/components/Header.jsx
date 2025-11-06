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
  Modal,
  TextField,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  VpnKey,
  Email,
  Person,
  Work,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Header({ handleDrawerToggle }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const open = Boolean(anchorEl);

  // 🔐 Change password form data
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 🧠 User info from localStorage
  const userName = localStorage.getItem("name") || "Guest User";
  const userRole = localStorage.getItem("role") || "Unknown Role";
  const userGmail = localStorage.getItem("gmail") || "Not available";

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleChangePasswordOpen = () => {
    setOpenModal(true);
    handleMenuClose();
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  // ✅ Handle password update (plaintext)
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    const { oldPassword, newPassword, confirmPassword } = form;

    if (!oldPassword || !newPassword || !confirmPassword)
      return toast.warning("⚠️ Please fill all fields");

    if (newPassword !== confirmPassword)
      return toast.error("❌ Passwords do not match");

    try {
      setLoading(true);

      // ✅ Correct API endpoint
      const res = await axios.put("https://service-book-backend.onrender.com/change-password", {
        gmail: userGmail,
        oldPassword,
        newPassword,
      });

      toast.success(res.data?.message || "✅ Password changed successfully!");

      setTimeout(() => {
        setOpenModal(false);
        setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 2, sm: 3 },
          }}
        >
          {/* ==== Left Section ==== */}
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
              }}
            >
              Service Book
            </Typography>
          </Box>

          {/* ==== Right Section: Profile ==== */}
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
                  minWidth: 260,
                  bgcolor: "rgba(255,255,255,0.95)",
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {/* 👤 User Info */}
              <MenuItem disabled sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <Person sx={{ color: "black" }} />
                </ListItemIcon>
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: "#000" }}
                  >
                    {userName}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 0.3,
                    }}
                  >
                    <Work sx={{ fontSize: 16, color: "gray" }} />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: "0.8rem", textTransform: "capitalize" }}
                    >
                      {userRole}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Email sx={{ fontSize: 16, color: "gray" }} />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: "0.8rem", wordBreak: "break-all" }}
                    >
                      {userGmail}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>

              <Divider sx={{ my: 1 }} />

              {/* Change Password */}
              <MenuItem onClick={handleChangePasswordOpen}>
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

      {/* 🔐 Change Password Modal */}
      <AnimatePresence>
        {openModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Modal
              open={openModal}
              onClose={handleModalClose}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "25px",
                  width: "90%",
                  maxWidth: "400px",
                  boxShadow: "0 5px 25px rgba(0,0,0,0.2)",
                }}
              >
                <Typography
                  variant="h6"
                  className="fw-bold text-center mb-3"
                  sx={{ color: "#007BFF", fontWeight: 700 }}
                >
                  Change Password
                </Typography>

                <form onSubmit={handlePasswordChange}>
                  <TextField
                    label="Old Password"
                    type="password"
                    fullWidth
                    required
                    margin="dense"
                    value={form.oldPassword}
                    onChange={(e) =>
                      setForm({ ...form, oldPassword: e.target.value })
                    }
                  />
                  <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    required
                    margin="dense"
                    value={form.newPassword}
                    onChange={(e) =>
                      setForm({ ...form, newPassword: e.target.value })
                    }
                  />
                  <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    required
                    margin="dense"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                  />

                  <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update"}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={handleModalClose}
                    >
                      Cancel
                    </Button>
                  </Box>
                </form>
              </motion.div>
            </Modal>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}

export default Header;
