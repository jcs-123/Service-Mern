import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Divider,
  Modal,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { Email, Logout, VpnKey, Menu as MenuIcon } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const AdminHeader = ({
  handleDrawerToggle,
  drawerWidth,
  userName,
  userGmail,
  handleLogout,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = form;
    if (!oldPassword || !newPassword || !confirmPassword)
      return toast.warning("Please fill all fields");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    try {
      setLoading(true);
      await axios.put("http://localhost:4000/change-password", {
        gmail: userGmail,
        oldPassword,
        newPassword,
      });
      toast.success("Password changed successfully!");
      setOpenModal(false);
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: "linear-gradient(135deg, #07a7f1 0%, #4FC3F7 100%)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          height: "64px",
          display: "flex",
          justifyContent: "center",
          borderBottom: "2px solid #000",
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: "64px",
          }}
        >
          {/* === Menu Icon for Mobile === */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" }, color: "#000" }}
          >
            <MenuIcon />
          </IconButton>

          {/* === Title - Removed Service Book text === */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              color: "#000",
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
         
          </Typography>

          {/* === Profile Avatar === */}
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              border: "2px solid rgba(0,0,0,0.7)",
              backgroundColor: "rgba(255,255,255,0.7)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.85)",
                transform: "scale(1.05)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <Avatar sx={{ bgcolor: "#0D47A1", fontWeight: "bold" }}>
              {userName?.charAt(0)?.toUpperCase() || "A"}
            </Avatar>
          </IconButton>

          {/* === Profile Menu === */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 4,
              sx: {
                mt: 1.5,
                borderRadius: 2,
                minWidth: 250,
                bgcolor: "rgba(255,255,255,0.98)",
              },
            }}
          >
            <MenuItem disabled>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "#1565C0" }}>
                  {userName?.charAt(0)?.toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <Box>
                <Typography fontWeight={600}>{userName}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "gray",
                  }}
                >
                  <Email sx={{ fontSize: 15 }} /> {userGmail}
                </Typography>
              </Box>
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={() => {
                setOpenModal(true);
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                <VpnKey fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Change Password" />
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              <ListItemIcon>
                <Logout color="error" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* ===== Change Password Modal ===== */}
      <AnimatePresence>
        {openModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: "white",
                  borderRadius: 16,
                  padding: 24,
                  width: "90%",
                  maxWidth: 400,
                  margin: "10% auto",
                  boxShadow: "0 5px 25px rgba(0,0,0,0.3)",
                }}
              >
                <Typography
                  variant="h6"
                  align="center"
                  mb={2}
                  sx={{ color: "#0D47A1", fontWeight: 700 }}
                >
                  Change Password
                </Typography>

                <form onSubmit={handlePasswordChange}>
                  <TextField
                    label="Old Password"
                    type="password"
                    fullWidth
                    margin="dense"
                    required
                    value={form.oldPassword}
                    onChange={(e) =>
                      setForm({ ...form, oldPassword: e.target.value })
                    }
                  />
                  <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    margin="dense"
                    required
                    value={form.newPassword}
                    onChange={(e) =>
                      setForm({ ...form, newPassword: e.target.value })
                    }
                  />
                  <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    margin="dense"
                    required
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                  />

                  <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update"}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={() => setOpenModal(false)}
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
    </>
  );
};

export default AdminHeader;