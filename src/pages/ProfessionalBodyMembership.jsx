import React, { useState, useEffect } from "react";
import {
  Box, Grid, TextField, Button, Typography, Paper, Divider,
  IconButton, Snackbar, Alert, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle
} from "@mui/material";
import { Add, Save, Delete, Edit, Cancel, ArrowBack } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProfessionalBodyMembership() {
  const navigate = useNavigate();
  const gmail = localStorage.getItem("gmail");
  const API_URL = "http://localhost:4000";

  const [memberships, setMemberships] = useState([]);
  const [newMembership, setNewMembership] = useState({
    bodyName: "", type: "", memberId: "", memberSince: "", description: ""
  });
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  // ✅ Fetch memberships from backend
  const fetchMemberships = async () => {
    if (!gmail) return;
    try {
      const res = await axios.get(`${API_URL}/getmemberships/${gmail}`);
      setMemberships(res.data.data || []);
    } catch (err) {
      console.error("❌ Error fetching memberships:", err);
      setSnackbar({ open: true, message: "❌ Failed to load data.", severity: "error" });
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, [gmail]);

  // ✅ Add new membership
  const handleAdd = async () => {
    if (!newMembership.bodyName.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/addmembership`, { gmail, ...newMembership });
      setMemberships([res.data.data, ...memberships]);
      setNewMembership({ bodyName: "", type: "", memberId: "", memberSince: "", description: "" });
      setSnackbar({ open: true, message: "✅ Membership added successfully!", severity: "success" });
    } catch (err) {
      console.error("❌ Error adding membership:", err);
      setSnackbar({ open: true, message: "❌ Failed to add membership.", severity: "error" });
    }
  };

  // ✅ Edit handler
  const handleChange = (id, field, value) => {
    setMemberships((prev) =>
      prev.map((m) => (m._id === id ? { ...m, [field]: value } : m))
    );
  };

  // ✅ Save changes
  const handleSave = async (id) => {
    const mem = memberships.find((m) => m._id === id);
    if (!mem) return;
    try {
      await axios.put(`${API_URL}/updatemembership/${id}`, mem);
      setEditId(null);
      setSnackbar({ open: true, message: "✅ Membership updated successfully!", severity: "success" });
      fetchMemberships();
    } catch (err) {
      console.error("❌ Update error:", err);
      setSnackbar({ open: true, message: "❌ Failed to update membership.", severity: "error" });
    }
  };

  // ✅ Delete with confirmation
  const confirmDeleteMembership = (id) => setConfirmDelete({ open: true, id });

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/deletemembership/${confirmDelete.id}`);
      setMemberships((prev) => prev.filter((m) => m._id !== confirmDelete.id));
      setConfirmDelete({ open: false, id: null });
      setSnackbar({ open: true, message: "🗑️ Membership deleted successfully!", severity: "success" });
    } catch (err) {
      console.error("❌ Delete error:", err);
      setSnackbar({ open: true, message: "❌ Failed to delete membership.", severity: "error" });
    }
  };

  // ✅ Fields configuration
  const membershipFields = [
    { label: "Name of Professional Body", value: "bodyName", xs: 12, sm: 6 },
    { label: "Type of Membership", value: "type", xs: 12, sm: 6 },
    { label: "Membership ID", value: "memberId", xs: 12, sm: 4 },
    { label: "Member Since", value: "memberSince", xs: 12, sm: 4 },
    { label: "Description / Details", value: "description", xs: 12, multiline: true, minRows: 3 },
  ];

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px", backgroundColor: "#fff",
      "& fieldset": { borderColor: "#e3f2fd", borderWidth: 2 },
      "&:hover fieldset": { borderColor: "#bbdefb" },
      "&.Mui-focused fieldset": {
        borderColor: "#1565c0", borderWidth: 2,
        boxShadow: "0 0 0 4px rgba(21,101,192,0.1)"
      }
    },
    "& .MuiInputLabel-root": { color: "#1565c0", fontWeight: "500" }
  };

  const buttonStyles = {
    background: "linear-gradient(135deg, #1565c0, #42a5f5)",
    borderRadius: "12px", fontWeight: "bold", textTransform: "none",
    px: 4, py: 1.5, fontSize: "16px",
    boxShadow: "0 4px 12px rgba(21,101,192,0.3)",
    "&:hover": {
      background: "linear-gradient(135deg, #0b3d91, #1565c0)",
      transform: "translateY(-2px)"
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh", background: "linear-gradient(135deg,#f7faff 0%,#e6eeff 100%)",
      py: 6, px: { xs: 2, md: 4 }, display: "flex", justifyContent: "center"
    }}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "1000px" }}>
        <Paper elevation={12} sx={{
          p: { xs: 3, md: 5 }, borderRadius: 4, backgroundColor: "#fff",
          boxShadow: "0 20px 40px rgba(25,118,210,0.15)"
        }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" sx={{
              fontWeight: "bold", background: "linear-gradient(135deg,#0b3d91,#1565c0)",
              WebkitBackgroundClip: "text", color: "transparent"
            }}>
              Professional Body Membership
            </Typography>
          </Box>

          {/* Memberships */}
          {memberships.map((mem, index) => (
            <motion.div key={mem._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Box sx={{
                border: "2px solid #e3f2fd", borderRadius: 3, p: 3, mb: 3, background: "#f9fbff"
              }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="h6" sx={{ color: "#1565c0", fontWeight: "bold" }}>
                    #{index + 1} Membership
                  </Typography>
                  <Box>
                    {editId === mem._id ? (
                      <IconButton color="error" onClick={() => setEditId(null)}><Cancel /></IconButton>
                    ) : (
                      <IconButton color="primary" onClick={() => setEditId(mem._id)}><Edit /></IconButton>
                    )}
                    <IconButton color="error" onClick={() => confirmDeleteMembership(mem._id)}><Delete /></IconButton>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  {membershipFields.map((field, i) => (
                    <Grid item xs={field.xs} sm={field.sm} key={i}>
                      <TextField
                        label={field.label}
                        fullWidth
                        multiline={field.multiline}
                        minRows={field.minRows}
                        value={mem[field.value] || ""}
                        onChange={(e) => handleChange(mem._id, field.value, e.target.value)}
                        sx={textFieldStyles}
                        disabled={editId !== mem._id}
                      />
                    </Grid>
                  ))}
                  {editId === mem._id && (
                    <Grid item xs={12}>
                      <Button variant="contained" sx={buttonStyles}
                        onClick={() => handleSave(mem._id)}>
                        <Save sx={{ mr: 1 }} /> Save Changes
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </motion.div>
          ))}

          {/* Add New */}
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0b3d91", mb: 2 }}>
            ➕ Add New Membership
          </Typography>

          <Grid container spacing={3}>
            {membershipFields.map((field, i) => (
              <Grid item xs={field.xs} sm={field.sm} key={i}>
                <TextField
                  label={field.label}
                  fullWidth
                  multiline={field.multiline}
                  minRows={field.minRows}
                  value={newMembership[field.value]}
                  onChange={(e) => setNewMembership({ ...newMembership, [field.value]: e.target.value })}
                  sx={textFieldStyles}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button variant="contained" startIcon={<Add />} onClick={handleAdd}
                disabled={!newMembership.bodyName.trim()} sx={buttonStyles}>
                Add Membership
              </Button>
            </Grid>
          </Grid>

          {/* Back Button */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate("/AdministrativeWork")}>
              Back
            </Button>
          </Box>
        </Paper>
      </motion.div>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      {/* Delete Confirmation */}
      <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, id: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this membership? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, id: null })}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProfessionalBodyMembership;
