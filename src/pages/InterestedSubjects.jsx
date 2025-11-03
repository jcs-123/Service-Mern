import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add,
  Save,
  Edit,
  Delete,
  Done,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function InterestedSubjects() {
  const navigate = useNavigate();
  const gmail = localStorage.getItem("gmail");
  const API_URL = "http://localhost:4000"; // ✅ Backend base URL

  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  // ✅ Fetch all subjects
  const fetchSubjects = async () => {
    if (!gmail) return;
    try {
      const res = await axios.get(`${API_URL}/getinterest/${gmail}`);
      setSubjects(res.data.data || []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setSnackbar({
        open: true,
        message: "❌ Failed to load interested subjects.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [gmail]);

  // ✅ Add new subject
  const handleAdd = async () => {
    if (!newSubject.trim()) {
      setSnackbar({
        open: true,
        message: "⚠️ Please enter a subject name.",
        severity: "warning",
      });
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/addinterestsubject`, {
        gmail,
        title: newSubject.trim(),
      });
      setSubjects([res.data.data, ...subjects]);
      setNewSubject("");
      setSnackbar({
        open: true,
        message: "✅ Subject added successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("❌ Add error:", err);
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message || "❌ Error adding subject.",
        severity: "error",
      });
    }
  };

  // ✅ Toggle edit mode
  const toggleEdit = (id) => {
    setSubjects((prev) =>
      prev.map((sub) =>
        sub._id === id ? { ...sub, isEditing: !sub.isEditing } : sub
      )
    );
  };

  // ✅ Handle field change
  const handleChange = (id, value) => {
    setSubjects((prev) =>
      prev.map((sub) => (sub._id === id ? { ...sub, title: value } : sub))
    );
  };

  // ✅ Save updated subject
  const handleSave = async (id) => {
    const sub = subjects.find((s) => s._id === id);
    if (!sub) return;

    try {
      await axios.put(`${API_URL}/updateinterest/${id}`, { title: sub.title });
      setSubjects((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, isEditing: false } : s
        )
      );
      setSnackbar({
        open: true,
        message: "✅ Subject updated successfully!",
        severity: "success",
      });
      fetchSubjects(); // refresh after update
    } catch (err) {
      console.error("❌ Update error:", err);
      setSnackbar({
        open: true,
        message: "❌ Error updating subject.",
        severity: "error",
      });
    }
  };

  // ✅ Open delete confirmation
  const confirmDelete = (id) => setDeleteDialog({ open: true, id });

  // ✅ Delete subject
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/deleteinterest/${deleteDialog.id}`);
      setSubjects((prev) =>
        prev.filter((s) => s._id !== deleteDialog.id)
      );
      setSnackbar({
        open: true,
        message: "🗑️ Subject deleted successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("❌ Delete error:", err);
      setSnackbar({
        open: true,
        message: "❌ Error deleting subject.",
        severity: "error",
      });
    }
    setDeleteDialog({ open: false, id: null });
  };

  // Navigation
  const handlePrevious = () => navigate("/Achievements");
  const handleNext = () => navigate("/ActivityLog");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#f7faff 0%,#e6eeff 100%)",
        py: 6,
        px: { xs: 2, md: 4 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "900px" }}
      >
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            backgroundColor: "#fff",
            border: "1px solid #cbd9ff",
            boxShadow: "0 8px 25px rgba(25,118,210,0.1)",
          }}
        >
          {/* Header */}
          <Typography
            variant="h5"
            align="center"
            sx={{
              fontWeight: "bold",
              color: "#0b3d91",
              textTransform: "uppercase",
              mb: 1,
              letterSpacing: 0.8,
            }}
          >
            Interested Subjects
          </Typography>
          <Box
            sx={{
              width: 230,
              height: 3,
              mx: "auto",
              mb: 4,
              backgroundColor: "#1565c0",
              borderRadius: 2,
            }}
          />

          {/* List */}
          {subjects.length === 0 ? (
            <Typography align="center" color="text.secondary" mb={3}>
              No subjects added yet.
            </Typography>
          ) : (
            subjects.map((sub, index) => (
              <Box
                key={sub._id || index}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                sx={{
                  border: "1px solid #d3e3ff",
                  borderRadius: 2,
                  p: 3,
                  mb: 3,
                  background:
                    "linear-gradient(180deg,#f9fbff 0%,#f5f8ff 100%)",
                  boxShadow: "0 4px 10px rgba(25,118,210,0.08)",
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#1565c0", fontWeight: "bold" }}
                  >
                    #{index + 1} Subject
                  </Typography>
                  <Box>
                    {sub.isEditing ? (
                      <Tooltip title="Save">
                        <IconButton
                          color="success"
                          size="small"
                          onClick={() => handleSave(sub._id)}
                        >
                          <Done />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => toggleEdit(sub._id)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => confirmDelete(sub._id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <TextField
                  label="Subject Name / Topic"
                  fullWidth
                  size="small"
                  value={sub.title}
                  disabled={!sub.isEditing}
                  onChange={(e) => handleChange(sub._id, e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      background: "#fff",
                      "& fieldset": { borderColor: "#bcd2ff" },
                      "&:hover fieldset": { borderColor: "#1565c0" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1565c0",
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Box>
            ))
          )}

          {/* Add new subject */}
          <Divider sx={{ my: 4 }} />
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ color: "#0b3d91", mb: 2 }}
          >
            ➕ Add New Subject
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={9}>
              <TextField
                label="Enter Subject / Topic"
                fullWidth
                size="small"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Add />}
                onClick={handleAdd}
                sx={{
                  background: "linear-gradient(135deg,#1565c0,#42a5f5)",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                  py: 1,
                }}
              >
                Add
              </Button>
            </Grid>
          </Grid>

          {/* Navigation */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 5,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Button variant="outlined" onClick={handlePrevious}>
              ← Back
            </Button>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" startIcon={<Save />}>
                Save
              </Button>
              <Button variant="contained" color="success" onClick={handleNext}>
                Next →
              </Button>
            </Box>
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
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this subject?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, id: null })}
            color="inherit"
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default InterestedSubjects;
