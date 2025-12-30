import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

function SubjectEngaged() {
  const navigate = useNavigate();
  const gmail = localStorage.getItem("gmail");

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    academicYear: "",
    subjectCode: "",
    subjectName: "",
    batch: "",
    semester: "",
    courseDiary: "",
    passPercentage: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [existingSubjects, setExistingSubjects] = useState([]);

  // Dialog control
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [isEditingLocal, setIsEditingLocal] = useState(false);

  useEffect(() => {
    if (gmail) fetchExistingSubjects();
  }, [gmail]);

  // 🔹 Fetch from backend
  const fetchExistingSubjects = async () => {
    try {
      const res = await axios.get(
        `https://service-book-backend.onrender.com/subjects-engaged?gmail=${gmail}`
      );
      if (res.data.success && res.data.data)
        setExistingSubjects(res.data.data.subjects || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // 🔹 Handle form input
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  // 🔹 Add to local list
  const handleAddSubject = () => {
    if (!form.academicYear || !form.subjectCode || !form.subjectName) {
      alert("Please fill required fields (Academic Year, Subject Code, Subject Name)");
      return;
    }
    setSubjects([...subjects, form]);
    setForm({
      academicYear: "",
      subjectCode: "",
      subjectName: "",
      batch: "",
      semester: "",
      courseDiary: "",
      passPercentage: "",
    });
  };

  // 🔹 Edit local subject
  const handleEditLocal = (sub, index) => {
    setEditingSubject({ ...sub });
    setEditIndex(index);
    setIsEditingLocal(true);
    setEditDialogOpen(true);
  };

  // 🔹 Save edit (local)
  const handleUpdateLocal = () => {
    const updated = [...subjects];
    updated[editIndex] = editingSubject;
    setSubjects(updated);
    setEditDialogOpen(false);
  };

  // 🔹 Delete local
  const handleDeleteLocal = (index) => {
    if (!window.confirm("Remove this subject from the list?")) return;
    const updated = subjects.filter((_, i) => i !== index);
    setSubjects(updated);
  };

  // 🔹 Save all to backend
  const handleSaveAll = async () => {
    try {
      if (!gmail) {
        alert("Email not found. Please log in again.");
        return;
      }
      if (subjects.length === 0) {
        alert("Please add at least one subject!");
        return;
      }

      setLoading(true);
      const res = await axios.post("https://service-book-backend.onrender.com/subjects-engaged", {
        gmail,
        subjects,
      });
      if (res.data.success) {
        alert("Subjects saved successfully!");
        fetchExistingSubjects();
        setSubjects([]);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Edit saved subject
  const handleEditSaved = (sub, index) => {
    setEditingSubject({ ...sub });
    setEditIndex(index);
    setIsEditingLocal(false);
    setEditDialogOpen(true);
  };

  // 🔹 Save edited subject to backend
  const handleUpdateSaved = async () => {
    try {
      const res = await axios.get(
        `https://service-book-backend.onrender.com/subjects-engaged?gmail=${gmail}`
      );
      if (res.data.success && res.data.data) {
        const allSubjects = res.data.data.subjects;
        allSubjects[editIndex] = editingSubject;
        await axios.post("https://service-book-backend.onrender.com/subjects-engaged", {
          gmail,
          subjects: allSubjects,
        });
        alert("Subject updated successfully!");
        fetchExistingSubjects();
        setEditDialogOpen(false);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // 🔹 Delete from saved list
  const handleDeleteSaved = async (index) => {
    if (!window.confirm("Delete this subject permanently?")) return;
    try {
      const res = await axios.get(
        `https://service-book-backend.onrender.com/subjects-engaged?gmail=${gmail}`
      );
      if (res.data.success && res.data.data) {
        const updated = res.data.data.subjects.filter((_, i) => i !== index);
        await axios.post("https://service-book-backend.onrender.com/subjects-engaged", {
          gmail,
          subjects: updated,
        });
        alert("Deleted successfully!");
        fetchExistingSubjects();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // 🔹 View subject
  const handleView = (sub) => {
    setSelectedSubject(sub);
    setViewDialogOpen(true);
  };

  const handlePrevious = () => navigate("/qualification");
  const handleNext = () => navigate("/Patent");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#f8fbff,#dee8ff)",
        py: 5,
        px: { xs: 2, md: 5 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ width: "100%", maxWidth: "1150px" }}
      >
        <Paper elevation={8} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
          <Typography
            variant="h4"
            align="center"
            fontWeight="600"
            sx={{ color: "#1a237e", mb: 3 }}
          >
            Subjects Engaged
          </Typography>

          {/* --- One Input Form --- */}
          <Typography variant="h6" sx={{ color: "#1a237e", fontWeight: 600, mb: 2 }}>
            Add New Subject
          </Typography>

          <Paper sx={{ p: 3, mb: 3, border: "1px solid #e0e0e0", borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Academic Year *"
                  fullWidth
                  value={form.academicYear}
                  onChange={(e) => handleChange("academicYear", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Subject Code *"
                  fullWidth
                  value={form.subjectCode}
                  onChange={(e) => handleChange("subjectCode", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Subject Name *"
                  fullWidth
                  value={form.subjectName}
                  onChange={(e) => handleChange("subjectName", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Batch"
                  fullWidth
                  value={form.batch}
                  onChange={(e) => handleChange("batch", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Semester"
                  fullWidth
                  value={form.semester}
                  onChange={(e) => handleChange("semester", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Course Diary"
                  fullWidth
                  value={form.courseDiary}
                  onChange={(e) => handleChange("courseDiary", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Pass Percentage"
                  type="number"
                  fullWidth
                  value={form.passPercentage}
                  onChange={(e) => handleChange("passPercentage", e.target.value)}
                />
              </Grid>
            </Grid>
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Button variant="outlined" onClick={handleAddSubject}>
                + Add Subject to List
              </Button>
            </Box>
          </Paper>

          {/* --- Local List --- */}
          {subjects.length > 0 && (
            <>
              <Typography
                variant="h6"
                align="center"
                sx={{ color: "#1a237e", fontWeight: 600, mb: 1 }}
              >
                Subjects to be Saved ({subjects.length})
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: "#1a237e" }}>
                      <TableCell sx={{ color: "#fff" }}>Academic Year</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Subject Code</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Subject Name</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subjects.map((s, i) => (
                      <TableRow key={i}>
                        <TableCell>{s.academicYear}</TableCell>
                        <TableCell>{s.subjectCode}</TableCell>
                        <TableCell>{s.subjectName}</TableCell>
                        <TableCell>
                          <IconButton color="primary" onClick={() => handleView(s)}>
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton color="secondary" onClick={() => handleEditLocal(s, i)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteLocal(i)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Button
                  variant="contained"
                  onClick={handleSaveAll}
                  disabled={loading}
                  sx={{
                    backgroundColor: "#1a237e",
                    borderRadius: 2,
                    px: 5,
                    py: 1.2,
                    fontWeight: 600,
                  }}
                >
                  {loading ? "Saving..." : "Save All Subjects"}
                </Button>
              </Box>
            </>
          )}

          <Divider sx={{ my: 4 }} />

          {/* --- Saved Subjects --- */}
          <Typography
            variant="h6"
            align="center"
            sx={{ color: "#1a237e", fontWeight: 600, mb: 2 }}
          >
            Saved Subjects ({existingSubjects.length})
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#1a237e" }}>
                  <TableCell sx={{ color: "#fff" }}>Academic Year</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Subject Code</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Subject Name</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Pass %</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {existingSubjects.length > 0 ? (
                  existingSubjects.map((s, i) => (
                    <TableRow key={i}>
                      <TableCell>{s.academicYear}</TableCell>
                      <TableCell>{s.subjectCode}</TableCell>
                      <TableCell>{s.subjectName}</TableCell>
                      <TableCell>
                        {s.passPercentage ? (
                          <Chip
                            label={`${s.passPercentage}%`}
                            color={
                              s.passPercentage >= 75
                                ? "success"
                                : s.passPercentage >= 50
                                ? "warning"
                                : "error"
                            }
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleView(s)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton color="secondary" onClick={() => handleEditSaved(s, i)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteSaved(i)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No subjects saved yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* --- Navigation --- */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 4,
              borderTop: "1px solid #e0e0e0",
              pt: 3,
            }}
          >
            <Button variant="outlined" onClick={handlePrevious}>
              Previous
            </Button>
            <Button variant="contained" onClick={handleNext}>
              Next →
            </Button>
          </Box>
        </Paper>
      </motion.div>

      {/* --- View Dialog --- */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "#1a237e", fontWeight: 600 }}>
          Subject Details
        </DialogTitle>
        <DialogContent>
          {selectedSubject &&
            Object.entries(selectedSubject).map(([key, value]) => (
              <Typography key={key} sx={{ mb: 1 }}>
                <b>{key.charAt(0).toUpperCase() + key.slice(1)}:</b> {value || "-"}
              </Typography>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* --- Edit Dialog --- */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: "#1a237e", fontWeight: 600 }}>
          Edit Subject
        </DialogTitle>
        <DialogContent>
          {editingSubject &&
            Object.keys(editingSubject).map((key) => (
              <TextField
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                fullWidth
                sx={{ mb: 2 }}
                value={editingSubject[key]}
                onChange={(e) =>
                  setEditingSubject({ ...editingSubject, [key]: e.target.value })
                }
              />
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={isEditingLocal ? handleUpdateLocal : handleUpdateSaved}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SubjectEngaged;
