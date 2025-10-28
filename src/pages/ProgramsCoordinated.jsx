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
import { UploadFile, CloudUpload } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function ProgramsCoordinated() {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([
    {
      slNo: "1",
      title:
        "Two weeks FDP FOR THE TEACHERS OF AFFILIATED COLLEGES UNDER MG UTY, sponsored by UGC. (BEFORE JOINING THIS COLLEGE)",
      category: "FDP",
      organisedBy: "MGU-UGC",
      fromDate: "2017-01-16",
      toDate: "2017-01-31",
      academicYear: "2022-2023",
      certificate: "",
    },
  ]);

  const [bulkData, setBulkData] = useState([]);

  // ✅ Excel upload
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      setBulkData(json);
      setPrograms(json);
      alert(`✅ ${json.length} program record(s) uploaded successfully!`);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleChange = (index, field, value) => {
    const updated = [...programs];
    updated[index][field] = value;
    setPrograms(updated);
  };

  const handleFileUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...programs];
      updated[index].certificate = file.name;
      setPrograms(updated);
    }
  };

  const handleAddRow = () => {
    setPrograms([
      ...programs,
      {
        slNo: programs.length + 1,
        title: "",
        category: "",
        organisedBy: "",
        fromDate: "",
        toDate: "",
        academicYear: "",
        certificate: "",
      },
    ]);
  };

  const handlePrevious = () => navigate("/Publications");
  const handleNext = () => navigate("/ProgramsAttended");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(180deg, #f3f8ff 0%, #e5efff 100%)",
        overflowY: "auto",
        py: 6,
        px: { xs: 2, md: 4 },
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "1250px" }}
      >
        <Paper
          elevation={5}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            backgroundColor: "#fff",
            border: "1px solid #d3e0ff",
            boxShadow: "0 8px 25px rgba(30,90,180,0.1)",
            mb: 8,
          }}
        >
          <Typography
            variant="h5"
            align="center"
            fontWeight="bold"
            sx={{
              color: "#0b3d91",
              letterSpacing: 0.8,
              mb: 4,
              textTransform: "uppercase",
            }}
          >
            🎓 Programs Coordinated (STTP / FDP / Workshop)
          </Typography>

          {/* Excel Upload */}
          <Box
            sx={{
              mb: 4,
              p: 3,
              border: "2px dashed #1976d2",
              borderRadius: 3,
              textAlign: "center",
              background: "linear-gradient(135deg,#f8fbff 0%,#f1f7ff 100%)",
              transition: "0.3s",
              "&:hover": { boxShadow: "0 0 10px rgba(25,118,210,0.2)" },
            }}
          >
            <Typography sx={{ mb: 1, color: "#0b3d91", fontWeight: 500 }}>
              Upload Excel File (Bulk Upload)
            </Typography>
            <IconButton
              component="label"
              color="primary"
              sx={{
                border: "1px solid #1976d2",
                borderRadius: 2,
                "&:hover": { backgroundColor: "#1976d220" },
              }}
            >
              <UploadFile />
              <input
                type="file"
                accept=".xls,.xlsx"
                hidden
                onChange={handleExcelUpload}
              />
            </IconButton>
            {bulkData.length > 0 && (
              <Typography sx={{ mt: 1, color: "green" }}>
                {bulkData.length} records uploaded successfully!
              </Typography>
            )}
          </Box>

          {/* Program Rows */}
          {programs.map((prog, index) => (
            <Paper
              key={index}
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                border: "1px solid #e0e8ff",
                background: "linear-gradient(145deg,#fafcff 0%,#f6f9ff 100%)",
                boxShadow: "0 4px 12px rgba(25,118,210,0.06)",
                "&:hover": {
                  boxShadow: "0 6px 18px rgba(25,118,210,0.15)",
                },
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{
                  color: "#1565c0",
                  mb: 2,
                  textTransform: "capitalize",
                }}
              >
                #{index + 1} Program Details
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Title"
                    value={prog.title}
                    onChange={(e) =>
                      handleChange(index, "title", e.target.value)
                    }
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    label="Category"
                    value={prog.category}
                    onChange={(e) =>
                      handleChange(index, "category", e.target.value)
                    }
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    label="Organised By"
                    value={prog.organisedBy}
                    onChange={(e) =>
                      handleChange(index, "organisedBy", e.target.value)
                    }
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    label="From Date"
                    type="date"
                    value={prog.fromDate}
                    onChange={(e) =>
                      handleChange(index, "fromDate", e.target.value)
                    }
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    label="To Date"
                    type="date"
                    value={prog.toDate}
                    onChange={(e) =>
                      handleChange(index, "toDate", e.target.value)
                    }
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    label="Academic Year"
                    value={prog.academicYear}
                    onChange={(e) =>
                      handleChange(index, "academicYear", e.target.value)
                    }
                    fullWidth
                    size="small"
                  />
                </Grid>

                {/* File Upload Field */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box
                    sx={{
                      border: "1px dashed #90caf9",
                      borderRadius: 2,
                      p: 1.2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "#f4f8ff",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: prog.certificate ? "#1565c0" : "#777",
                        maxWidth: "150px",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {prog.certificate || "No file selected"}
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
            </Paper>
          ))}

          {/* Add Program Button */}
          <Box sx={{ textAlign: "left", mb: 3 }}>
            <Button
              variant="outlined"
              onClick={handleAddRow}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: 2,
                color: "#1565c0",
                borderColor: "#1565c0",
                "&:hover": { background: "rgba(21,101,192,0.1)" },
              }}
            >
              + Add Program
            </Button>
          </Box>

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 4,
            }}
          >
            <Button
              variant="outlined"
              onClick={handlePrevious}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: "bold",
                px: 4,
                py: 1,
                color: "#1976d2",
                borderColor: "#1976d2",
                "&:hover": { background: "rgba(25,118,210,0.1)" },
              }}
            >
              ← Previous
            </Button>

            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: "bold",
                px: 5,
                py: 1.2,
                fontSize: "1rem",
                background: "linear-gradient(135deg,#1976d2,#42a5f5)",
                boxShadow: "0 4px 12px rgba(25,118,210,0.3)",
              }}
            >
              Next →
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default ProgramsCoordinated;
