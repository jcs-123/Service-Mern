import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function ProgramsAttended() {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([
    {
      slNo: "1",
      category: "Other Programs",
      subCategory: "",
      title: "CAS selection committee",
      period: "Outside this college",
      fundingAgency: "Uty of Kerala",
      organisedBy: "Uty of Kerala",
      fromDate: "2020-02-17",
      toDate: "2020-02-17",
      certificate: "View",
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

  // ✅ Field update
  const handleChange = (index, field, value) => {
    const updated = [...programs];
    updated[index][field] = value;
    setPrograms(updated);
  };

  const handleAddRow = () => {
    setPrograms([
      ...programs,
      {
        slNo: programs.length + 1,
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
        height: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #e6eeff, #ffffff)",
        overflowY: "auto",
        py: 6,
        px: { xs: 2, md: 4 },
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ width: "100%", maxWidth: "1250px" }}
      >
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            backgroundColor: "#fff",
            boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
            mb: 10,
          }}
        >
          <Typography
            variant="h5"
            align="center"
            fontWeight="bold"
            sx={{ color: "#0b2154", letterSpacing: 1, mb: 4 }}
          >
            🎓 Programs Attended (eg. STTP / FDP / Workshop)
          </Typography>

          {/* Excel Upload */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{
                mb: 4,
                p: 2.5,
                border: "1px dashed #1976d2",
                borderRadius: 2,
                textAlign: "center",
                backgroundColor: "#f9fbff",
              }}
            >
              <Typography variant="body1" sx={{ mb: 1, color: "#0b2154" }}>
                Upload Excel File (Bulk Upload)
              </Typography>
              <IconButton
                component="label"
                color="primary"
                sx={{
                  border: "1px solid #1976d2",
                  borderRadius: 2,
                  transition: "0.3s",
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
          </motion.div>

          {/* Program Rows */}
          {programs.map((prog, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                mb: 3,
                backgroundColor: "#fafcff",
                borderRadius: 2,
                border: "1px solid #e0e0e0",
              }}
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{ color: "#1A4DA1", mb: 1 }}
              >
                #{index + 1} Program Details
              </Typography>

              <Grid container spacing={2}>
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
                    label="Sub Category"
                    value={prog.subCategory}
                    onChange={(e) =>
                      handleChange(index, "subCategory", e.target.value)
                    }
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
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
                    label="Period"
                    value={prog.period}
                    onChange={(e) =>
                      handleChange(index, "period", e.target.value)
                    }
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    label="Funding Agency"
                    value={prog.fundingAgency}
                    onChange={(e) =>
                      handleChange(index, "fundingAgency", e.target.value)
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
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Certificate Link / Remarks"
                    value={prog.certificate}
                    onChange={(e) =>
                      handleChange(index, "certificate", e.target.value)
                    }
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}

          {/* ➕ Add Row */}
          <Box sx={{ textAlign: "left", mb: 3 }}>
            <Button
              variant="outlined"
              onClick={handleAddRow}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                fontWeight: "bold",
              }}
            >
              + Add Program
            </Button>
          </Box>

          {/* Navigation */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 4,
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={handlePrevious}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: "bold",
                px: 4,
                py: 1.1,
              }}
            >
              ← Previous
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: "bold",
                px: 5,
                py: 1.2,
                fontSize: "1rem",
                boxShadow: "0 4px 10px rgba(25,118,210,0.3)",
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

export default ProgramsAttended;
