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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import {
  Visibility,
  Edit,
  Delete,
  Add,
  CloudUpload,
  PictureAsPdf,
  Image,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const ProgramsAttended = () => {
  const navigate = useNavigate();
  const gmail = localStorage.getItem("gmail") || "jeswinjohn@jecc.ac.in";

  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [programs, setPrograms] = useState([
    {
      category: "",
      // subCategory: "",
      title: "",
      period: "",
      fundingAgency: "",
      organisedBy: "",
      fromDate: "",
      toDate: "",
      certificate: null,
    },
  ]);

  const [existingPrograms, setExistingPrograms] = useState([]);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Fetch programs on mount
  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await axios.get(`https://service-book-backend.onrender.com/api/programs-attended/${gmail}`);
      if (res.data.success) setExistingPrograms(res.data.data);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
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
      updated[index].certificate = file;
      setPrograms(updated);
    }
  };

  const handleAddRow = () => {
    setPrograms([
      ...programs,
      {
        category: "",
        // subCategory: "",
        title: "",
        period: "",
        fundingAgency: "",
        organisedBy: "",
        fromDate: "",
        toDate: "",
        certificate: null,
      },
    ]);
  };

  // ✅ Submit to backend
  const handleSubmit = async () => {
    try {
      setLoading(true);
      for (const prog of programs) {
        const formData = new FormData();
        for (const key in prog) formData.append(key, prog[key]);
        formData.append("gmail", gmail);

        await axios.post("https://service-book-backend.onrender.com/api/programs-attended", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      alert("✅ Programs Attended saved successfully!");
      fetchPrograms();
      setPrograms([
        {
          category: "",
          // subCategory: "",
          title: "",
          period: "",
          fundingAgency: "",
          organisedBy: "",
          fromDate: "",
          toDate: "",
          certificate: null,
        },
      ]);
    } catch (error) {
      console.error("Error saving programs:", error);
      alert("Error saving programs");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      await axios.delete(`https://service-book-backend.onrender.com/api/programs-attended/${id}`);
      fetchPrograms();
    }
  };

  // ✅ Preview
  const handlePreview = (filePath) => {
    setPreviewFile(`https://service-book-backend.onrender.com${filePath}`);
    setPreviewDialog(true);
  };

  // ✅ Edit
  const handleEdit = (prog) => {
    setEditData({ ...prog });
    setEditDialogOpen(true);
  };

  // ✅ Update
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      for (const key in editData) {
        if (key !== "certificate") formData.append(key, editData[key]);
      }
      if (editData.newFile) formData.append("certificate", editData.newFile);

      await axios.put(
        `https://service-book-backend.onrender.com/api/programs-attended/${editData._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("✅ Program updated successfully!");
      setEditDialogOpen(false);
      fetchPrograms();
    } catch (error) {
      console.error("Error updating program:", error);
      alert("Failed to update program");
    }
  };

  const handlePrevious = () => navigate("/ProgramsCoordinated");
  const handleNext = () => navigate("/MoocCourseCompleted");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#f5f7fa 0%,#c3cfe2 100%)",
        py: 4,
        px: { xs: 2, md: 4 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "1200px" }}
      >
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            sx={{ color: "#1a237e", mb: 4 }}
          >
            🧑‍🏫 Programs Attended (STTP / FDP / Workshop)
          </Typography>

          {/* Toggle View/Add */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            {!viewMode ? (
              <Button variant="outlined" startIcon={<Visibility />} onClick={() => setViewMode(true)}>
                View All Programs
              </Button>
            ) : (
              <Button variant="outlined" startIcon={<Add />} onClick={() => setViewMode(false)}>
                Add New Program
              </Button>
            )}
          </Box>

          {/* ADD MODE */}
          {!viewMode &&
            programs.map((prog, index) => (
              <Paper
                key={index}
                sx={{
                  p: 3,
                  mb: 3,
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #ddd",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="primary" mb={2}>
                  Program {index + 1}
                </Typography>

                <Grid container spacing={2}>
                  {[
                    ["Category", "category"],
                    // ["Sub Category", "subCategory"],
                    ["Title", "title"],
                    ["Period", "period"],
                    ["Funding Agency", "fundingAgency"],
                    ["Organised By", "organisedBy"],
                    ["From Date", "fromDate", "date"],
                    ["To Date", "toDate", "date"],
                  ].map(([label, name, type]) => (
                    <Grid item xs={12} sm={6} md={3} key={name}>
                      <TextField
                        label={label}
                        type={type || "text"}
                        fullWidth
                        value={prog[name]}
                        onChange={(e) => handleChange(index, name, e.target.value)}
                        InputLabelProps={type === "date" ? { shrink: true } : {}}
                      />
                    </Grid>
                  ))}

                  {/* File Upload */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box
                      sx={{
                        border: "1px dashed #90caf9",
                        p: 1.2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#f4f8ff",
                        borderRadius: 2,
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
                        {prog.certificate ? prog.certificate.name : "No file selected"}
                      </Typography>
                      <IconButton component="label" color="primary">
                        <CloudUpload />
                        <input
                          type="file"
                          hidden
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(index, e)}
                        />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}

          {!viewMode && (
            <>
              <Box sx={{ textAlign: "center", my: 3 }}>
                <Button variant="outlined" onClick={handleAddRow}>
                  + Add Another Program
                </Button>
              </Box>
              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{ px: 6, py: 1.2 }}
                >
                  {loading ? "Saving..." : "Save Programs"}
                </Button>
              </Box>
            </>
          )}

          {/* VIEW MODE */}
          {viewMode && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ color: "#1a237e", mb: 2, textAlign: "center" }}>
                Your Programs Attended ({existingPrograms.length})
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#1a237e" }}>
                    <TableRow>
                      <TableCell sx={{ color: "#fff" }}>Title</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Category</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Organised By</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Certificate</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {existingPrograms.map((prog, index) => (
                      <TableRow key={index}>
                        <TableCell>{prog.title}</TableCell>
                        <TableCell>{prog.category}</TableCell>
                        <TableCell>{prog.organisedBy}</TableCell>
                        <TableCell>
                          {prog.certificate ? (
                            <Tooltip title="View Certificate">
                              <IconButton color="primary" onClick={() => handlePreview(prog.certificate)}>
                                {prog.certificate.endsWith(".pdf") ? <PictureAsPdf /> : <Image />}
                              </IconButton>
                            </Tooltip>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton color="secondary" onClick={() => handleEdit(prog)}>
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton color="error" onClick={() => handleDelete(prog._id)}>
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Navigation */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, borderTop: "1px solid #ccc", pt: 3 }}>
            <Button variant="outlined" onClick={handlePrevious}>
              ← Previous
            </Button>
            <Button variant="contained" onClick={handleNext}>
              Next →
            </Button>
          </Box>
        </Paper>

        {/* File Preview */}
        <Dialog open={previewDialog} onClose={() => setPreviewDialog(false)} maxWidth="lg" fullWidth>
          <DialogTitle>Certificate Preview</DialogTitle>
          <DialogContent>
            {previewFile && previewFile.endsWith(".pdf") ? (
              <iframe src={previewFile} width="100%" height="600px" title="PDF Preview"></iframe>
            ) : (
              <img src={previewFile} alt="Preview" style={{ width: "100%", borderRadius: "8px" }} />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Program</DialogTitle>
          <DialogContent>
            {editData && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {Object.entries(editData)
                  .filter(([k]) => !["_id", "__v", "gmail", "createdAt", "updatedAt"].includes(k))
                  .map(([key, value]) => (
                    <Grid item xs={12} sm={6} key={key}>
                      {key === "certificate" ? (
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Current: {editData.certificate || "No file"}
                          </Typography>
                          <Button component="label" variant="outlined" startIcon={<CloudUpload />}>
                            Upload New
                            <input
                              type="file"
                              hidden
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) =>
                                setEditData({ ...editData, newFile: e.target.files[0] })
                              }
                            />
                          </Button>
                        </Box>
                      ) : (
                        <TextField
                          label={key}
                          value={value || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, [key]: e.target.value })
                          }
                          fullWidth
                        />
                      )}
                    </Grid>
                  ))}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdate}>
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Box>
  );
};

export default ProgramsAttended;
