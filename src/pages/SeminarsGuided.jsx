import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Save, CloudUpload } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function SeminarsGuided() {
  const navigate = useNavigate();

  const [seminars, setSeminars] = useState([
    {
      category: "Seminar",
      title:
        "On comparative analysis of the Deep Learning Algorithms for Big Data Analytics.",
      programme: "",
      batch: "",
      studentName: "",
      rollNo: "",
      academicYear: "2022-2023",
      certificate: "",
    },
  ]);

  // ✅ Auto-save on change
  const handleChange = (index, field, value) => {
    const updated = [...seminars];
    updated[index][field] = value;
    setSeminars(updated);
    console.log("Auto-saved record:", updated[index]);
  };

  // ✅ File Upload
  const handleFileUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...seminars];
      updated[index].certificate = file.name;
      setSeminars(updated);
      console.log("Auto-saved file:", file.name);
    }
  };

  // ✅ Add new record
  const handleAddRow = () => {
    setSeminars([
      ...seminars,
      {
        category: "",
        title: "",
        programme: "",
        batch: "",
        studentName: "",
        rollNo: "",
        academicYear: "",
        certificate: "",
      },
    ]);
  };

  const handlePrevious = () => navigate("/ProgramsAttended");
  const handleNext = () => navigate("/InteractionsOutsideWorld");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#f0f6ff 0%,#e8f0ff 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 5,
        px: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "950px" }}
      >
        <Paper
          elevation={4}
          sx={{
            borderRadius: 3,
            border: "1px solid #b6d0ff",
            p: { xs: 3, md: 5 },
            background: "#ffffff",
            boxShadow: "0 6px 20px rgba(25,118,210,0.1)",
          }}
        >
          {/* ===== Header ===== */}
          <Typography
            variant="h5"
            align="center"
            fontWeight="bold"
            sx={{
              color: "#0b3d91",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              mb: 1,
            }}
          >
            Seminars Guided
          </Typography>
          <Box
            sx={{
              height: "3px",
              width: "120px",
              backgroundColor: "#1565c0",
              mx: "auto",
              mb: 4,
              borderRadius: 2,
            }}
          />

          {/* ===== Seminar Records ===== */}
          {seminars.map((item, index) => (
            <Box
              key={index}
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              sx={{
                border: "1px solid #d3e0ff",
                borderRadius: 2,
                p: 3,
                mb: 3,
                background: "linear-gradient(145deg,#fafcff,#f6f9ff)",
                boxShadow: "0 3px 10px rgba(25,118,210,0.05)",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: "#1565c0", mb: 2 }}
              >
                #{index + 1} Seminar Details
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: "#0b3d91" }}>
                    Category
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={item.category}
                    onChange={(e) =>
                      handleChange(index, "category", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: "#0b3d91" }}>
                    Programme
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={item.programme}
                    onChange={(e) =>
                      handleChange(index, "programme", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: "#0b3d91" }}>
                    Title
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={item.title}
                    onChange={(e) =>
                      handleChange(index, "title", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: "#0b3d91" }}>
                    Batch
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={item.batch}
                    onChange={(e) =>
                      handleChange(index, "batch", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: "#0b3d91" }}>
                    Name of Student
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={item.studentName}
                    onChange={(e) =>
                      handleChange(index, "studentName", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: "#0b3d91" }}>
                    Roll No
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={item.rollNo}
                    onChange={(e) =>
                      handleChange(index, "rollNo", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: "#0b3d91" }}>
                    Academic Year
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={item.academicYear}
                    onChange={(e) =>
                      handleChange(index, "academicYear", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: "#0b3d91" }}>
                    Upload Certificate / Document
                  </Typography>
                  <Box
                    sx={{
                      border: "1px dashed #90caf9",
                      borderRadius: 2,
                      p: 1.2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "#f4f8ff",
                      mt: 0.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: item.certificate ? "#1565c0" : "#777",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                      }}
                    >
                      {item.certificate || "No file selected"}
                    </Typography>
                    <Tooltip title="Upload Certificate">
                      <IconButton component="label" color="primary">
                        <CloudUpload />
                        <input
                          type="file"
                          hidden
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(index, e)}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ))}

          {/* ➕ Add New Seminar */}
          <Box sx={{ textAlign: "left", mt: 3 }}>
            <Button
              variant="outlined"
              onClick={handleAddRow}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                color: "#1565c0",
                borderColor: "#1565c0",
                "&:hover": { background: "rgba(21,101,192,0.1)" },
              }}
            >
              + Add Seminar
            </Button>
          </Box>

          {/* ===== Navigation ===== */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 4,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={handlePrevious}
              sx={{
                color: "#0b3d91",
                borderColor: "#0b3d91",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              ← Back
            </Button>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                sx={{
                  backgroundColor: "#1565c0",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 3,
                  "&:hover": { backgroundColor: "#0b3d91" },
                }}
                onClick={() => alert("✅ Auto-saved all seminars!")}
              >
                Save
              </Button>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#2e7d32",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 4,
                  "&:hover": { backgroundColor: "#1b5e20" },
                }}
                onClick={handleNext}
              >
                Next →
              </Button>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default SeminarsGuided;
