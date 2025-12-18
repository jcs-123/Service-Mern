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
  Delete,
  Edit,
  Done,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Achievements() {
  const navigate = useNavigate();
  const gmail = localStorage.getItem("gmail");

  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({
    title: "",
    academicYear: "",
    remarks: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
  });

  const API_URL = "https://service-book-backend.onrender.com/achievements";

  // ✅ Fetch all achievements
  useEffect(() => {
    if (!gmail) return;
    axios
      .get(`${API_URL}/${gmail}`)
      .then((res) => setAchievements(res.data.data || []))
      .catch(() =>
        setSnackbar({
          open: true,
          message: "❌ Failed to load achievements",
          severity: "error",
        })
      );
  }, [gmail]);

  // ✅ Toggle edit mode
  const toggleEdit = (id) => {
    setAchievements((prev) =>
      prev.map((ach) =>
        ach._id === id ? { ...ach, isEditing: !ach.isEditing } : ach
      )
    );
  };

  // ✅ Handle input change
  const handleChange = (id, field, value) => {
    setAchievements((prev) =>
      prev.map((ach) => (ach._id === id ? { ...ach, [field]: value } : ach))
    );
  };

  // ✅ Add new record
  const handleAdd = async () => {
    if (!newAchievement.title.trim()) return;

    try {
      const res = await axios.post(API_URL, {
        gmail,
        title: newAchievement.title,
        academicYear: newAchievement.academicYear,
        remarks: newAchievement.remarks,
      });

      setAchievements([res.data.data, ...achievements]);
      setNewAchievement({ title: "", academicYear: "", remarks: "" });
      setSnackbar({
        open: true,
        message: "✅ Achievement added successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "❌ Failed to add achievement",
        severity: "error",
      });
    }
  };

  // ✅ Save edited record
  const handleSave = async (id) => {
    const ach = achievements.find((a) => a._id === id);
    try {
      await axios.put(`${API_URL}/${id}`, {
        title: ach.title,
        academicYear: ach.academicYear,
        remarks: ach.remarks,
      });
      setAchievements((prev) =>
        prev.map((a) => (a._id === id ? { ...a, isEditing: false } : a))
      );
      setSnackbar({
        open: true,
        message: "✅ Achievement updated successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "❌ Error updating achievement",
        severity: "error",
      });
    }
  };

  // ✅ Confirm delete popup
  const confirmDelete = (id) => {
    setDeleteDialog({ open: true, id });
  };

  // ✅ Delete record
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${deleteDialog.id}`);
      setAchievements((prev) =>
        prev.filter((a) => a._id !== deleteDialog.id)
      );
      setSnackbar({
        open: true,
        message: "🗑️ Achievement deleted successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "❌ Error deleting achievement",
        severity: "error",
      });
    }
    setDeleteDialog({ open: false, id: null });
  };

  const handlePrevious = () => navigate("/ResearchInterests");
  const handleNext = () => navigate("/ActivityLog");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f9fc",
        py: 5,
        px: { xs: 2, md: 4 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={5}
        sx={{
          width: "100%",
          maxWidth: 900,
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          background: "#fff",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary"
          align="center"
          mb={1}
        >
          Achievements
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          mb={4}
        >
          Record and edit your academic or professional achievements.
        </Typography>

        {/* Existing Achievements */}
        {achievements.map((ach, index) => (
          <Box
            key={ach._id}
            sx={{
              border: "1px solid #e3f2fd",
              borderRadius: 2,
              p: 3,
              mb: 2,
              bgcolor: "#fafcff",
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="primary.main"
              >
                #{index + 1} Achievement
              </Typography>

              <Box sx={{ display: "flex", gap: 1 }}>
                {ach.isEditing ? (
                  <Tooltip title="Save Changes">
                    <IconButton
                      onClick={() => handleSave(ach._id)}
                      color="success"
                      size="small"
                    >
                      <Done />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => toggleEdit(ach._id)}
                      color="primary"
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Delete">
                  <IconButton
                    onClick={() => confirmDelete(ach._id)}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Title / Description"
                  fullWidth
                  multiline
                  minRows={2}
                  value={ach.title}
                  disabled={!ach.isEditing}
                  onChange={(e) =>
                    handleChange(ach._id, "title", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="During Academic Year"
                  fullWidth
                  value={ach.academicYear}
                  disabled={!ach.isEditing}
                  onChange={(e) =>
                    handleChange(ach._id, "academicYear", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Remarks"
                  fullWidth
                  value={ach.remarks}
                  disabled={!ach.isEditing}
                  onChange={(e) =>
                    handleChange(ach._id, "remarks", e.target.value)
                  }
                />
              </Grid>
            </Grid>
          </Box>
        ))}

        {/* Add New Achievement */}
        <Divider sx={{ my: 4 }} />
        <Typography variant="h6" fontWeight="bold" mb={2} color="primary">
          Add New Achievement
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title / Description"
              fullWidth
              multiline
              minRows={2}
              value={newAchievement.title}
              onChange={(e) =>
                setNewAchievement({ ...newAchievement, title: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="During Academic Year"
              fullWidth
              value={newAchievement.academicYear}
              onChange={(e) =>
                setNewAchievement({
                  ...newAchievement,
                  academicYear: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Remarks"
              fullWidth
              value={newAchievement.remarks}
              onChange={(e) =>
                setNewAchievement({
                  ...newAchievement,
                  remarks: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAdd}
              disabled={!newAchievement.title.trim()}
              sx={{
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              Add Achievement
            </Button>
          </Grid>
        </Grid>

        {/* Navigation */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 5,
            pt: 3,
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handlePrevious}
          >
            Back
          </Button>

          <Button
            variant="contained"
            color="success"
            endIcon={<ArrowForward />}
            onClick={handleNext}
          >
            Next
          </Button>
        </Box>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
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

        {/* Delete Confirmation */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, id: null })}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this achievement?
            </Typography>
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
      </Paper>
    </Box>
  );
}

export default Achievements;
