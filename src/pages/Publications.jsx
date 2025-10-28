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

function Publications() {
  const navigate = useNavigate();

  const [publications, setPublications] = useState([
    {
      slNo: "1",
      category: "International Journal papers with impact factor<1.5",
      title:
        "Optimization driven generative adversarial network for course recommendation in E-Learning",
      nameOfPublication: "International Journal of Wireless and Mobile Computing",
      patentNo: "1741-1092",
      indexing: "SCOPUS",
      academicYear: "2023-2024",
      date: "2023-11-01",
      period: "Outside this college",
      document: "View",
    },
  ]);

  const [bulkData, setBulkData] = useState([]);

  // Excel upload
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
      setPublications(json);
      alert(`✅ ${json.length} publication record(s) uploaded successfully!`);
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle value change
  const handleChange = (index, field, value) => {
    const updated = [...publications];
    updated[index][field] = value;
    setPublications(updated);
  };

  // Add new row
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
            📚 Publications
          </Typography>

          {/* Bulk Upload */}
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

          {/* Publication Entries */}
          {publications.map((pub, index) => (
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
                    label="Title of Paper/Patent"
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
                    label="Patent No"
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
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Document / Facing Sheet"
                    value={pub.document}
                    onChange={(e) =>
                      handleChange(index, "document", e.target.value)
                    }
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}

          {/* Add New Publication */}
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
              + Add Publication
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
                boxShadow: "0 4px 10px rgba(25, 118, 210, 0.3)",
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

export default Publications;
