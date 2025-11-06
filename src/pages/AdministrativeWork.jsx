import React, { useState, useEffect } from "react";
import {
  Box, Grid, TextField, Button, Typography, Paper, Divider,
  IconButton, Snackbar, Alert, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle
} from "@mui/material";
import { Add, Save, Delete, Edit, ArrowBack, ArrowForward, Cancel } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdministrativeWork() {
  const navigate = useNavigate();
  const gmail = localStorage.getItem("gmail");
  const API_URL = "https://service-book-backend.onrender.com";

  const [works, setWorks] = useState([]);
  const [newWork, setNewWork] = useState({ nameOfWork: "", academicYear: "" });
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  // ✅ Fetch all administrative works
  const fetchWorks = async () => {
    if (!gmail) return;
    try {
      const res = await axios.get(`${API_URL}/getadminworks/${gmail}`);
      setWorks(res.data.data || []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setSnackbar({ open: true, message: "❌ Failed to load data.", severity: "error" });
    }
  };

  useEffect(() => {
    fetchWorks();
  }, [gmail]);

  // ✅ Add new work
  const handleAdd = async () => {
    if (!newWork.nameOfWork.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/addadminwork`, { gmail, ...newWork });
      setWorks([res.data.data, ...works]);
      setNewWork({ nameOfWork: "", academicYear: "" });
      setSnackbar({ open: true, message: "✅ Work added successfully!", severity: "success" });
    } catch (err) {
      console.error("❌ Add error:", err);
      setSnackbar({ open: true, message: "❌ Failed to add work.", severity: "error" });
    }
  };

  // ✅ Handle edit
  const handleChange = (id, field, value) => {
    setWorks((prev) => prev.map((w) => (w._id === id ? { ...w, [field]: value } : w)));
  };

  // ✅ Save updated work
  const handleSave = async (id) => {
    const work = works.find((w) => w._id === id);
    if (!work) return;
    try {
      await axios.put(`${API_URL}/updateadminwork/${id}`, work);
      setEditId(null);
      setSnackbar({ open: true, message: "✅ Work updated successfully!", severity: "success" });
      fetchWorks();
    } catch (err) {
      console.error("❌ Update error:", err);
      setSnackbar({ open: true, message: "❌ Failed to update work.", severity: "error" });
    }
  };

  // ✅ Open delete confirmation
  const confirmDeleteWork = (id) => setConfirmDelete({ open: true, id });

  // ✅ Delete work
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/deleteadminwork/${confirmDelete.id}`);
      setWorks((prev) => prev.filter((w) => w._id !== confirmDelete.id));
      setConfirmDelete({ open: false, id: null });
      setSnackbar({ open: true, message: "🗑️ Work deleted successfully!", severity: "success" });
    } catch (err) {
      console.error("❌ Delete error:", err);
      setSnackbar({ open: true, message: "❌ Failed to delete work.", severity: "error" });
    }
  };

  // ✅ Navigation
  const handlePrevious = () => navigate("/MoocCourseCompleted");
  const handleNext = () => navigate("/Professional");

  // ✅ Styles
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
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(21,101,192,0.4)"
    },
    transition: "all 0.3s ease"
  };

  return (
    <Box sx={{
      minHeight: "100vh", background: "linear-gradient(135deg,#f7faff 0%,#e6eeff 100%)",
      py: 6, px: { xs: 2, md: 4 }, display: "flex", justifyContent: "center"
    }}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "950px" }}>
        <Paper elevation={12} sx={{
          p: { xs: 3, md: 5 }, borderRadius: 4, backgroundColor: "#fff",
          boxShadow: "0 20px 40px rgba(25,118,210,0.15)"
        }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" sx={{
              fontWeight: "bold", background: "linear-gradient(135deg,#0b3d91,#1565c0)",
              WebkitBackgroundClip: "text", color: "transparent"
            }}>
              Administrative Work
            </Typography>
          </Box>

          {/* EXISTING WORKS */}
          {works.length === 0 ? (
            <Typography align="center" color="text.secondary" mb={3}>
              No administrative works added yet.
            </Typography>
          ) : (
            works.map((work, index) => (
              <motion.div key={work._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Box sx={{
                  border: "2px solid #e3f2fd", borderRadius: 3,
                  p: 3, mb: 3, background: "#f9fbff"
                }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="h6" sx={{ color: "#1565c0", fontWeight: "bold" }}>
                      #{index + 1} Work
                    </Typography>
                    <Box>
                      {editId === work._id ? (
                        <IconButton color="error" onClick={() => setEditId(null)}><Cancel /></IconButton>
                      ) : (
                        <IconButton color="primary" onClick={() => setEditId(work._id)}><Edit /></IconButton>
                      )}
                      <IconButton color="error" onClick={() => confirmDeleteWork(work._id)}><Delete /></IconButton>
                    </Box>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField label="Name of Work / Responsibility" fullWidth multiline minRows={2}
                        value={work.nameOfWork}
                        onChange={(e) => handleChange(work._id, "nameOfWork", e.target.value)}
                        sx={textFieldStyles}
                        disabled={editId !== work._id}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="During Academic Year" fullWidth
                        value={work.academicYear}
                        onChange={(e) => handleChange(work._id, "academicYear", e.target.value)}
                        sx={textFieldStyles}
                        disabled={editId !== work._id}
                      />
                    </Grid>

                    {editId === work._id && (
                      <Grid item xs={12}>
                        <Button variant="contained" sx={buttonStyles}
                          onClick={() => handleSave(work._id)}>
                          <Save sx={{ mr: 1 }} /> Save Changes
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </motion.div>
            ))
          )}

          {/* ADD NEW WORK */}
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0b3d91", mb: 2 }}>
            ➕ Add New Work
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField label="Name of Work / Responsibility" fullWidth multiline minRows={2}
                value={newWork.nameOfWork}
                onChange={(e) => setNewWork({ ...newWork, nameOfWork: e.target.value })}
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="During Academic Year" fullWidth
                value={newWork.academicYear}
                onChange={(e) => setNewWork({ ...newWork, academicYear: e.target.value })}
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" startIcon={<Add />} onClick={handleAdd}
                disabled={!newWork.nameOfWork.trim()} sx={buttonStyles}>
                Add Work
              </Button>
            </Grid>
          </Grid>

          {/* NAVIGATION */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 5 }}>
            <Button variant="outlined" startIcon={<ArrowBack />} onClick={handlePrevious}>
              Back
            </Button>
            <Button variant="contained" endIcon={<ArrowForward />} onClick={handleNext} color="success">
              Next
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

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, id: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this administrative work? This action cannot be undone.
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

export default AdministrativeWork;
