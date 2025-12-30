import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  IconButton,
  Modal,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const SubjectEngaged = () => {
  const gmail =
    localStorage.getItem("gmail") || localStorage.getItem("email");

  const [subjects, setSubjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const initialForm = {
    academicYear: "",
    subjectCode: "",
    subjectName: "",
    batch: "",
    semester: "",
    courseDiary: "",
    passPercentage: "",
  };

  const [form, setForm] = useState(initialForm);

  /* ================= FETCH SUBJECTS ================= */
  const fetchSubjects = async () => {
    try {
      const res = await axios.get(
        `https://service-book-backend.onrender.com/subjects-engaged/${gmail}`
      );
      setSubjects(res.data.data || []);
    } catch {
      setSubjects([]);
    }
  };

  useEffect(() => {
    if (gmail) fetchSubjects();
    else toast.error("Please login again");
  }, [gmail]);

  /* ================= SAVE SUBJECT ================= */
  const handleSave = async () => {
    if (!form.academicYear || !form.subjectCode || !form.subjectName) {
      toast.error(
        "Academic Year, Subject Code and Subject Name are required"
      );
      return;
    }

    try {
      if (editItem) {
        await axios.put(
          `https://service-book-backend.onrender.com/subjects-engaged/${editItem._id}`,
          { ...form, gmail }
        );
        toast.success("Subject updated successfully");
      } else {
        await axios.post("https://service-book-backend.onrender.com/subjects-engaged", {
          ...form,
          gmail,
        });
        toast.success("Subject added successfully");
      }

      setOpen(false);
      setEditItem(null);
      setForm(initialForm);
      fetchSubjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  /* ================= DELETE SUBJECT ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subject?")) return;

    try {
      await axios.delete(
        `https://service-book-backend.onrender.com/subjects-engaged/${id}`
      );
      toast.success("Subject deleted");
      fetchSubjects();
    } catch {
      toast.error("Delete failed");
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
    <Box p={3}>
      <ToastContainer position="top-right" autoClose={2500} />

      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={700}>
          Subjects Engaged
        </Typography>

        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={() => {
            setEditItem(null);
            setForm(initialForm);
            setOpen(true);
          }}
        >
          Add Subject
        </Button>
      </Box>

      {/* ================= TABLE ================= */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ background: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>Academic Year</TableCell>
              <TableCell sx={{ color: "#fff" }}>Subject Code</TableCell>
              <TableCell sx={{ color: "#fff" }}>Subject Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Pass %</TableCell>
              <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {subjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No subjects found
                </TableCell>
              </TableRow>
            ) : (
              subjects.map((s) => (
                <TableRow key={s._id}>
                  <TableCell>{s.academicYear}</TableCell>
                  <TableCell>{s.subjectCode}</TableCell>
                  <TableCell>{s.subjectName}</TableCell>
                  <TableCell>
                    {s.passPercentage ? `${s.passPercentage}%` : "-"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setEditItem(s);
                        setForm(s);
                        setOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(s._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ================= MODAL ================= */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            bgcolor: "#fff",
            p: 4,
            width: 700,
            mx: "auto",
            mt: 5,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={3}>
            {editItem ? "Edit Subject" : "Add Subject"}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Academic Year *"
                placeholder="2024-2025"
                fullWidth
                value={form.academicYear}
                onChange={(e) =>
                  setForm({ ...form, academicYear: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Subject Code *"
                fullWidth
                value={form.subjectCode}
                onChange={(e) =>
                  setForm({ ...form, subjectCode: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Subject Name *"
                fullWidth
                value={form.subjectName}
                onChange={(e) =>
                  setForm({ ...form, subjectName: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Batch"
                fullWidth
                value={form.batch}
                onChange={(e) =>
                  setForm({ ...form, batch: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Semester"
                fullWidth
                value={form.semester}
                onChange={(e) =>
                  setForm({ ...form, semester: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Course Diary"
                fullWidth
                value={form.courseDiary}
                onChange={(e) =>
                  setForm({ ...form, courseDiary: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Pass Percentage"
                type="number"
                fullWidth
                value={form.passPercentage}
                onChange={(e) =>
                  setForm({ ...form, passPercentage: e.target.value })
                }
              />
            </Grid>
          </Grid>

          <Box mt={4} textAlign="right">
            <Button variant="contained" onClick={handleSave}>
              {editItem ? "Update" : "Save"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default SubjectEngaged;
