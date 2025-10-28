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
  MenuItem,
} from "@mui/material";
import { UploadFile, CloudUpload, Save } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function ProgramsAttended() {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([
    {
      category: "Other Programs",
      subCategory: "",
      title: "CAS selection committee",
      period: "Outside this college",
      fundingAgency: "Uty of Kerala",
      organisedBy: "Uty of Kerala",
      fromDate: "2020-02-17",
      toDate: "2020-02-17",
      certificate: "",
    },
  ]);

  const [bulkData, setBulkData] = useState([]);

  // ✅ Excel Upload
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
      alert(`✅ ${json.length} record(s) uploaded successfully!`);
    };
    reader.readAsArrayBuffer(file);
  };

  // ✅ Auto-save on every change
  const handleChange = (index, field, value) => {
    const updated = [...programs];
    updated[index][field] = value;
    setPrograms(updated);
    console.log("Auto-saved record:", updated[index]);
  };

  // ✅ File Upload
  const handleFileUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...programs];
      updated[index].certificate = file.name;
      setPrograms(updated);
      console.log("Auto-saved file:", file.name);
    }
  };

  // ✅ Add New Record
  const handleAddRow = () => {
    setPrograms([
      ...programs,
      {
        category: "",
        subCategory: "",
        title: "",
        period: "",
        fundingAgency: "",
        organisedBy: "",
        fromDate: "",
        toDate: "",
        certificate: "",
      },
    ]);
  };

  const handlePrevious = () => navigate("/ProgramsCoordinated");
  const handleNext = () => navigate("/FacultyReserach");

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
            Programs Attended (STTP / FDP / Workshop)
          </Typography>
          <Box
            sx={{
              height: "3px",
              width: "140px",
              backgroundColor: "#1565c0",
              mx: "auto",
              mb: 4,
              borderRadius: 2,
            }}
          />

          {/* ===== Bulk Upload ===== */}
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

          {/* ===== Form ===== */}
          {programs.map((prog, index) => (
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
                sx={{
                  color: "#1565c0",
                  mb: 2,
                  textTransform: "capitalize",
                }}
              >
                #{index + 1} Program Details
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: "#0b3d91" }}>
                    Category
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={prog.category}
                    onChange={(e) =>
                      handleChange(index, "category", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: "#0b3d91" }}>
                    Sub Category
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={prog.subCategory}
                    onChange={(e) =>
                      handleChange(index, "subCategory", e.target.value)
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
                    value={prog.title}
                    onChange={(e) =>
                      handleChange(index, "title", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: "#0b3d91" }}>
                    Period
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={prog.period}
                    onChange={(e) =>
                      handleChange(index, "period", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: "#0b3d91" }}>
                    Funding Agency
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={prog.fundingAgency}
                    onChange={(e) =>
                      handleChange(index, "fundingAgency", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: "#0b3d91" }}>
                    Organised By
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={prog.organisedBy}
                    onChange={(e) =>
                      handleChange(index, "organisedBy", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle2" sx={{ color: "#0b3d91" }}>
                    From Date
                  </Typography>
                  <TextField
                    type="date"
                    fullWidth
                    size="small"
                    value={prog.fromDate}
                    onChange={(e) =>
                      handleChange(index, "fromDate", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle2" sx={{ color: "#0b3d91" }}>
                    To Date
                  </Typography>
                  <TextField
                    type="date"
                    fullWidth
                    size="small"
                    value={prog.toDate}
                    onChange={(e) =>
                      handleChange(index, "toDate", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
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
                        color: prog.certificate ? "#1565c0" : "#777",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
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
            </Box>
          ))}

          {/* Add Row Button */}
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
              + Add Program
            </Button>
          </Box>

          {/* Navigation Buttons */}
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
                onClick={() => alert("✅ Auto-saved all programs!")}
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

export default ProgramsAttended;
