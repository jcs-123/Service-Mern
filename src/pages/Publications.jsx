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

const Publications = () => {
  const navigate = useNavigate();

  const [publications, setPublications] = useState([
    {
      slNo: 1,
      category: "International Journal papers with impact factor <1.5",
      title:
        "Optimization driven generative adversarial network for course recommendation in E-Learning",
      nameOfPublication: "International Journal of Wireless and Mobile Computing",
      patentNo: "1741-1092",
      indexing: "SCOPUS",
      academicYear: "2023-2024",
      date: "2023-11-01",
      period: "Outside this college",
      document: "",
    },
  ]);

  const [bulkData, setBulkData] = useState([]);

  // ===== Excel Upload =====
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      setPublications(json);
      setBulkData(json);
    };
    reader.readAsArrayBuffer(file);
  };

  // ===== Field Change =====
  const handleChange = (index, field, value) => {
    const updated = [...publications];
    updated[index][field] = value;
    setPublications(updated);
  };

  // ===== File Upload =====
  const handleFileUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...publications];
      updated[index].document = file.name;
      setPublications(updated);
    }
  };

  // ===== Add New Row =====
  const handleAddRow = () => {
    setPublications([
      ...publications,
      {
        slNo: publications.length + 1,
        category: "",
        title: "",
        nameOfPublication: "",
        patentNo: "",
        indexing: "",
        academicYear: "",
        date: "",
        period: "",
        document: "",
      },
    ]);
  };

  const handlePrevious = () => navigate("/SubjectEngaged");
  const handleNext = () => navigate("/ProgramsCoordinated");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#f4f8ff 0%,#e9f1ff 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 6,
        px: { xs: 2, md: 4 },
        overflowY: "auto",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "1250px" }}
      >
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            background: "#fff",
            border: "1px solid #d4e1ff",
            boxShadow: "0 8px 25px rgba(30,90,180,0.1)",
            mb: 8,
          }}
        >
          {/* ===== Header ===== */}
          <Typography
            variant="h5"
            align="center"
            sx={{
              color: "#0B2154",
              fontWeight: 700,
              letterSpacing: 1,
              mb: 4,
              textTransform: "uppercase",
            }}
          >
            📘 Publications
          </Typography>

          {/* ===== Bulk Upload ===== */}
          <Box
            sx={{
              mb: 4,
              p: 3,
              border: "2px dashed #1976d2",
              borderRadius: 3,
              background: "linear-gradient(135deg,#f8fbff 0%,#f1f7ff 100%)",
              textAlign: "center",
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
                {bulkData.length} record(s) uploaded successfully!
              </Typography>
            )}
          </Box>

          {/* ===== Publication Rows ===== */}
          {publications.map((pub, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Paper
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 3,
                  border: "1px solid #e0e8ff",
                  background:
                    "linear-gradient(145deg,#fafcff 0%,#f6f9ff 100%)",
                  boxShadow: "0 4px 12px rgba(25,118,210,0.06)",
                  "&:hover": {
                    boxShadow: "0 6px 18px rgba(25,118,210,0.15)",
                  },
                  transition: "0.3s",
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  sx={{
                    color: "#1565c0",
                    mb: 2,
                    textTransform: "capitalize",
                  }}
                >
                  #{index + 1} Publication Details
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Category"
                      value={pub.category}
                      onChange={(e) =>
                        handleChange(index, "category", e.target.value)
                      }
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Title of Paper / Patent"
                      value={pub.title}
                      onChange={(e) =>
                        handleChange(index, "title", e.target.value)
                      }
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Name of Publication"
                      value={pub.nameOfPublication}
                      onChange={(e) =>
                        handleChange(index, "nameOfPublication", e.target.value)
                      }
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      label="Patent No."
                      value={pub.patentNo}
                      onChange={(e) =>
                        handleChange(index, "patentNo", e.target.value)
                      }
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      label="Indexing"
                      value={pub.indexing}
                      onChange={(e) =>
                        handleChange(index, "indexing", e.target.value)
                      }
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      label="Academic Year"
                      value={pub.academicYear}
                      onChange={(e) =>
                        handleChange(index, "academicYear", e.target.value)
                      }
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      label="Date"
                      type="date"
                      value={pub.date}
                      onChange={(e) =>
                        handleChange(index, "date", e.target.value)
                      }
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Period"
                      value={pub.period}
                      onChange={(e) =>
                        handleChange(index, "period", e.target.value)
                      }
                      fullWidth
                      size="small"
                    />
                  </Grid>

                  {/* ===== Document Upload ===== */}
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
                          color: pub.document ? "#1565c0" : "#777",
                          maxWidth: "150px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {pub.document || "No file selected"}
                      </Typography>
                      <Tooltip title="Upload Document">
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
            </motion.div>
          ))}

          {/* ===== Add Button ===== */}
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
              + Add Publication
            </Button>
          </Box>

          {/* ===== Navigation Buttons ===== */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 5,
            }}
          >
            <Button
              variant="outlined"
              onClick={handlePrevious}
              sx={{
                px: 4,
                py: 1,
                fontWeight: 600,
                borderRadius: 2,
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
                px: 5,
                py: 1.2,
                fontWeight: 600,
                borderRadius: 2,
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
};

export default Publications;
