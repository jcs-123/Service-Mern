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

function ActivityLog() {
  const navigate = useNavigate();
  const gmail = localStorage.getItem("gmail");
  const API_URL = "http://localhost:4000";

  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    title: "", academicYear: "", fromDate: "", toDate: "", cost: ""
  });
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  // ✅ Fetch existing activities
  const fetchActivities = async () => {
    if (!gmail) return;
    try {
      const res = await axios.get(`${API_URL}/getactivities/${gmail}`);
      setActivities(res.data.data || []);
    } catch (err) {
      console.error("❌ Error fetching:", err);
      setSnackbar({ open: true, message: "❌ Failed to load activities", severity: "error" });
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [gmail]);

  // ✅ Add new activity
  const handleAdd = async () => {
    if (!newActivity.title.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/addactivity`, { gmail, ...newActivity });
      setActivities([res.data.data, ...activities]);
      setNewActivity({ title: "", academicYear: "", fromDate: "", toDate: "", cost: "" });
      setSnackbar({ open: true, message: "✅ Activity added successfully!", severity: "success" });
    } catch (err) {
      console.error("❌ Error adding:", err);
      setSnackbar({ open: true, message: "❌ Failed to add activity", severity: "error" });
    }
  };

  // ✅ Edit field locally
  const handleChange = (id, field, value) => {
    setActivities((prev) =>
      prev.map((a) => (a._id === id ? { ...a, [field]: value } : a))
    );
  };

  // ✅ Save edited activity
  const handleSave = async (id) => {
    const act = activities.find((a) => a._id === id);
    if (!act) return;
    try {
      await axios.put(`${API_URL}/updateactivity/${id}`, act);
      setEditId(null);
      setSnackbar({ open: true, message: "✅ Activity updated successfully!", severity: "success" });
      fetchActivities();
    } catch (err) {
      console.error("❌ Update error:", err);
      setSnackbar({ open: true, message: "❌ Failed to update activity", severity: "error" });
    }
  };

  // ✅ Open confirmation before delete
  const confirmDeleteActivity = (id) => {
    setConfirmDelete({ open: true, id });
  };

  // ✅ Delete activity after confirmation
  const handleDelete = async () => {
    const id = confirmDelete.id;
    try {
      await axios.delete(`${API_URL}/deleteactivity/${id}`);
      setActivities((prev) => prev.filter((a) => a._id !== id));
      setConfirmDelete({ open: false, id: null });
      setSnackbar({ open: true, message: "🗑️ Activity deleted successfully!", severity: "success" });
    } catch (err) {
      console.error("❌ Delete error:", err);
      setSnackbar({ open: true, message: "❌ Failed to delete activity", severity: "error" });
    }
  };

  // Navigation
  const handlePrevious = () => navigate("/InterestedSubjects");
  const handleNext = () => navigate("/Patent");

  // Styles
  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#fff",
      "& fieldset": { borderColor: "#e3f2fd", borderWidth: 2 },
      "&:hover fieldset": { borderColor: "#bbdefb" },
      "&.Mui-focused fieldset": {
        borderColor: "#1565c0",
        borderWidth: 2,
        boxShadow: "0 0 0 4px rgba(21,101,192,0.1)",
      },
    },
    "& .MuiInputLabel-root": { color: "#1565c0", fontWeight: "500" },
  };

  const buttonStyles = {
    background: "linear-gradient(135deg, #1565c0, #42a5f5)",
    borderRadius: "12px",
    fontWeight: "bold",
    textTransform: "none",
    px: 4,
    py: 1.5,
    fontSize: "16px",
    boxShadow: "0 4px 12px rgba(21,101,192,0.3)",
    "&:hover": {
      background: "linear-gradient(135deg, #0b3d91, #1565c0)",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(21,101,192,0.4)",
    },
    transition: "all 0.3s ease",
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f7faff 0%, #e6eeff 100%)",
      py: 6, px: { xs: 2, md: 4 },
      display: "flex", justifyContent: "center", position: "relative"
    }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "950px" }}
      >
        <Paper elevation={12} sx={{
          p: { xs: 3, md: 5 }, borderRadius: 4,
          boxShadow: "0 20px 40px rgba(25,118,210,0.15)"
        }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" sx={{
              fontWeight: "bold",
              background: "linear-gradient(135deg, #0b3d91, #1565c0)",
              WebkitBackgroundClip: "text", color: "transparent"
            }}>Activity Log</Typography>
          </Box>

          {/* EXISTING LIST */}
          {activities.map((act, index) => (
            <motion.div key={act._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Box sx={{
                border: "2px solid #e3f2fd", borderRadius: 3,
                p: 3, mb: 3, background: "#f9fbff"
              }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="h6" sx={{ color: "#1565c0", fontWeight: "bold" }}>
                    #{index + 1} Activity
                  </Typography>
                  <Box>
                    {editId === act._id ? (
                      <IconButton onClick={() => setEditId(null)} color="error"><Cancel /></IconButton>
                    ) : (
                      <IconButton onClick={() => setEditId(act._id)} color="primary"><Edit /></IconButton>
                    )}
                    <IconButton onClick={() => confirmDeleteActivity(act._id)} color="error"><Delete /></IconButton>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Title / Description"
                      fullWidth multiline minRows={2}
                      value={act.title}
                      onChange={(e) => handleChange(act._id, "title", e.target.value)}
                      sx={textFieldStyles}
                      disabled={editId !== act._id}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField label="Academic Year" fullWidth value={act.academicYear}
                      onChange={(e) => handleChange(act._id, "academicYear", e.target.value)}
                      sx={textFieldStyles} disabled={editId !== act._id} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField label="From Date" type="date" fullWidth InputLabelProps={{ shrink: true }}
                      value={act.fromDate?.slice(0, 10) || ""}
                      onChange={(e) => handleChange(act._id, "fromDate", e.target.value)}
                      sx={textFieldStyles} disabled={editId !== act._id} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField label="To Date" type="date" fullWidth InputLabelProps={{ shrink: true }}
                      value={act.toDate?.slice(0, 10) || ""}
                      onChange={(e) => handleChange(act._id, "toDate", e.target.value)}
                      sx={textFieldStyles} disabled={editId !== act._id} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField label="Cost (₹)" fullWidth type="number"
                      value={act.cost || ""}
                      onChange={(e) => handleChange(act._id, "cost", e.target.value)}
                      sx={textFieldStyles} disabled={editId !== act._id} />
                  </Grid>

                  {editId === act._id && (
                    <Grid item xs={12}>
                      <Button variant="contained" sx={buttonStyles}
                        onClick={() => handleSave(act._id)}>
                        <Save sx={{ mr: 1 }} /> Save Changes
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </motion.div>
          ))}

          {/* ADD NEW */}
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0b3d91", mb: 2 }}>
            ➕ Add New Activity
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField label="Title / Description" fullWidth multiline minRows={2}
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                sx={textFieldStyles} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Academic Year" fullWidth
                value={newActivity.academicYear}
                onChange={(e) => setNewActivity({ ...newActivity, academicYear: e.target.value })}
                sx={textFieldStyles} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="From Date" type="date" fullWidth InputLabelProps={{ shrink: true }}
                value={newActivity.fromDate}
                onChange={(e) => setNewActivity({ ...newActivity, fromDate: e.target.value })}
                sx={textFieldStyles} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="To Date" type="date" fullWidth InputLabelProps={{ shrink: true }}
                value={newActivity.toDate}
                onChange={(e) => setNewActivity({ ...newActivity, toDate: e.target.value })}
                sx={textFieldStyles} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Cost (₹)" fullWidth type="number"
                value={newActivity.cost}
                onChange={(e) => setNewActivity({ ...newActivity, cost: e.target.value })}
                sx={textFieldStyles} />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" startIcon={<Add />} onClick={handleAdd} sx={buttonStyles}>
                Add Activity
              </Button>
            </Grid>
          </Grid>

          {/* Navigation */}
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
            Are you sure you want to delete this activity? This action cannot be undone.
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

export default ActivityLog;
