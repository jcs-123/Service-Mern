import React, { useState, useEffect } from "react";
import {
  Box, Grid, TextField, Button, Typography, Paper, Divider,
  IconButton, Fade, Tooltip
} from "@mui/material";
import { Add, Save, Delete, ArrowBack, ArrowForward, Edit } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MoocCourseCompleted() {
  const navigate = useNavigate();
  const gmail = localStorage.getItem("gmail") || "jeswinjohn@jecc.ac.in";

  const [showSuccess, setShowSuccess] = useState(false);
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: "", conductedBy: "", fromDate: "", toDate: "", duration: "", sort: ""
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  // 🟢 Fetch from backend
  const fetchCourses = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/mooc/${gmail}`);
      if (res.data.success) setCourses(res.data.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  // 🟢 Add / Update Course
  const handleAdd = async () => {
    if (!newCourse.title.trim()) return alert("Please enter a Course Title");
    try {
      if (editId) {
        await axios.put(`http://localhost:4000/api/mooc/${editId}`, {
          ...newCourse, gmail,
        });
        alert("✅ Course updated successfully!");
      } else {
        await axios.post("http://localhost:4000/api/mooc", {
          ...newCourse, gmail,
        });
        alert("✅ Course added successfully!");
      }
      setNewCourse({ title: "", conductedBy: "", fromDate: "", toDate: "", duration: "", sort: "" });
      setEditId(null);
      fetchCourses();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      console.error("Error saving course:", err);
      alert("❌ Failed to save course");
    }
  };

  // 🟢 Edit Course
  const handleEdit = (course) => {
    setNewCourse({
      title: course.title,
      conductedBy: course.conductedBy,
      fromDate: course.fromDate,
      toDate: course.toDate,
      duration: course.duration,
      sort: course.sort,
    });
    setEditId(course._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🟢 Delete Course
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await axios.delete(`http://localhost:4000/api/mooc/${id}`);
      fetchCourses();
    }
  };

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

  const courseFields = [
    { label: "Course Title", value: "title", xs: 12 },
    { label: "Conducted By", value: "conductedBy", xs: 12, multiline: true },
    { label: "From Date", value: "fromDate", xs: 6, type: "date" },
    { label: "To Date", value: "toDate", xs: 6, type: "date" },
    { label: "Duration", value: "duration", xs: 6 },
    { label: "Sort / Type", value: "sort", xs: 6 },
  ];

  return (
    <Box sx={{
      minHeight: "100vh", background: "linear-gradient(135deg, #f7faff 0%, #e6eeff 100%)",
      py: 6, px: { xs: 2, md: 4 }, display: "flex", justifyContent: "center", position: "relative"
    }}>
      <Box sx={{
        position: "absolute", top: 0, left: 0, right: 0, height: "300px",
        background: "linear-gradient(135deg, rgba(21,101,192,0.1) 0%, rgba(66,165,245,0.05) 100%)", zIndex: 0
      }}/>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "950px", position: "relative", zIndex: 1 }}>

        {/* ✅ Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Box sx={{
                background: "linear-gradient(135deg, #4caf50, #66bb6a)", color: "white", p: 2, borderRadius: 2,
                textAlign: "center", mb: 3, boxShadow: "0 4px 12px rgba(76,175,80,0.3)"
              }}>
                <Typography variant="body1" fontWeight="bold">✅ Course Saved Successfully!</Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        <Paper elevation={12} sx={{
          p: { xs: 3, md: 5 }, borderRadius: 4, backgroundColor: "#fff",
          boxShadow: "0 20px 40px rgba(25,118,210,0.15)", border: "1px solid #e3f2fd"
        }}>

          {/* 🧭 Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" sx={{
              fontWeight: "bold", background: "linear-gradient(135deg, #0b3d91, #1565c0)",
              backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", mb: 2
            }}>
              MOOC Course Completed
            </Typography>
            <Box sx={{
              width: 120, height: 4, mx: "auto",
              background: "linear-gradient(135deg, #1565c0, #42a5f5)", borderRadius: 2
            }}/>
          </Box>

          {/* 🟩 Form (Add / Edit) */}
          <Fade in timeout={800}>
            <Box>
              <Divider sx={{ my: 3, "&::before, &::after": { borderColor: "#e3f2fd" } }}>
                <Box sx={{
                  px: 3, py: 1, background: "linear-gradient(135deg, #1565c0, #42a5f5)", color: "white",
                  borderRadius: 20, fontSize: "14px", fontWeight: "bold"
                }}>
                  {editId ? "EDIT COURSE" : "ADD NEW COURSE"}
                </Box>
              </Divider>

              <Grid container spacing={3}>
                {courseFields.map((field, i) => (
                  <Grid item xs={field.xs} key={i}>
                    <TextField
                      label={field.label}
                      fullWidth
                      multiline={field.multiline}
                      minRows={field.multiline ? 2 : undefined}
                      type={field.type}
                      InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
                      value={newCourse[field.value]}
                      onChange={(e) => setNewCourse({ ...newCourse, [field.value]: e.target.value })}
                      sx={textFieldStyles}
                    />
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Button variant="contained" startIcon={<Add />} onClick={handleAdd} disabled={!newCourse.title.trim()}
                    sx={{
                      background: "linear-gradient(135deg, #1565c0, #42a5f5)", borderRadius: "12px",
                      fontWeight: "bold", textTransform: "none", px: 4, py: 1.5, fontSize: "16px"
                    }}>
                    {editId ? "Update Course" : "Add Course"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Fade>

          {/* 📋 Saved Courses */}
          <Typography variant="h6" sx={{ mt: 5, mb: 2, color: "#0b3d91", fontWeight: "bold" }}>
            Saved Courses
          </Typography>

          <AnimatePresence>
            {courses.map((course, index) => (
              <motion.div key={course._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: index * 0.1 }}>
                <Box sx={{
                  border: "2px solid #e3f2fd", borderRadius: 3, p: 3, mb: 3,
                  background: "linear-gradient(135deg, #f9fbff 0%, #f5f8ff 100%)",
                  boxShadow: "0 4px 16px rgba(25,118,210,0.08)",
                  "&:hover": { borderColor: "#bbdefb", boxShadow: "0 6px 20px rgba(25,118,210,0.12)", transform: "translateY(-2px)" }
                }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1565c0", display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{
                        width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #1565c0, #42a5f5)",
                        display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px", fontWeight: "bold"
                      }}>{index + 1}</Box>
                      Course #{index + 1}
                    </Typography>
                    <Box>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(course)} sx={{ color: "#1565c0" }}><Edit /></IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(course._id)} sx={{ color: "#f44336" }}><Delete /></IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Typography><strong>Title:</strong> {course.title}</Typography>
                  <Typography><strong>Conducted By:</strong> {course.conductedBy}</Typography>
                  <Typography><strong>From:</strong> {course.fromDate}</Typography>
                  <Typography><strong>To:</strong> {course.toDate}</Typography>
                  <Typography><strong>Duration:</strong> {course.duration}</Typography>
                  <Typography><strong>Type:</strong> {course.sort}</Typography>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* 🧭 Navigation */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 6, pt: 4, borderTop: "2px solid #e3f2fd" }}>
            <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate("/Patent")}
              sx={{ borderColor: "#1565c0", color: "#1565c0", textTransform: "none", fontWeight: "bold" }}>
              Back
            </Button>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" startIcon={<Save />} onClick={() => setShowSuccess(true)}
                sx={{ background: "linear-gradient(135deg, #1565c0, #42a5f5)", textTransform: "none", fontWeight: "bold" }}>
                Save
              </Button>
              <Button variant="contained" endIcon={<ArrowForward />} onClick={() => navigate("/AdministrativeWork")}
                sx={{ background: "linear-gradient(135deg, #2e7d32, #4caf50)", textTransform: "none", fontWeight: "bold" }}>
                Next
              </Button>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default MoocCourseCompleted;
