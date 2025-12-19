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

const Publications = () => {
  const navigate = useNavigate();
  const gmail = localStorage.getItem("gmail") || "jeswinjohn@jecc.ac.in";

  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [publications, setPublications] = useState([
    {
      category: "",
      title: "",
      nameOfPublication: "",
      patentNo: "",
      indexing: "",
      academicYear: "",
      date: "",
      period: "",
      document: null,
    },
  ]);

  const [existingPublications, setExistingPublications] = useState([]);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  // 🟢 Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const res = await axios.get(`https://service-book-backend.onrender.com/api/publications/${gmail}`);
      if (res.data.success) setExistingPublications(res.data.data);
    } catch (error) {
      console.error("Error fetching publications:", error);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...publications];
    updated[index][field] = value;
    setPublications(updated);
  };

  const handleFileUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...publications];
      updated[index].document = file;
      setPublications(updated);
    }
  };

  const handleAddRow = () => {
    setPublications([
      ...publications,
      {
        category: "",
        title: "",
        nameOfPublication: "",
        patentNo: "",
        indexing: "",
        academicYear: "",
        date: "",
        period: "",
        document: null,
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const updated = publications.filter((_, i) => i !== index);
    setPublications(updated);
  };

  // 🔹 Save new publication(s)
  const handleSubmit = async () => {
    try {
      setLoading(true);
      for (const pub of publications) {
        const formData = new FormData();
        for (const key in pub) formData.append(key, pub[key]);
        formData.append("gmail", gmail);

        await axios.post("https://service-book-backend.onrender.com/api/publications", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      alert("✅ Publications saved successfully!");
      fetchPublications();
      setPublications([
        {
          category: "",
          title: "",
          nameOfPublication: "",
          patentNo: "",
          indexing: "",
          academicYear: "",
          date: "",
          period: "",
          document: null,
        },
      ]);
    } catch (error) {
      console.error("Error saving publications:", error);
      alert("Error saving publications");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete publication
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this publication?")) {
      await axios.delete(`https://service-book-backend.onrender.com/api/publications/${id}`);
      fetchPublications();
    }
  };

  // 🔹 Preview document
  const handlePreview = (docPath) => {
    setPreviewFile(`https://service-book-backend.onrender.com${docPath}`);
    setPreviewDialog(true);
  };

  // 🟢 Handle open edit dialog
  const handleEdit = (pub) => {
    setEditData({ ...pub });
    setEditDialogOpen(true);
  };

  // 🟢 Handle update save
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      for (const key in editData) {
        if (key !== "document") formData.append(key, editData[key]);
      }
      if (editData.newFile) formData.append("document", editData.newFile);

      await axios.put(`https://service-book-backend.onrender.com/api/publications/${editData._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Publication updated successfully!");
      setEditDialogOpen(false);
      fetchPublications();
    } catch (error) {
      console.error("Error updating publication:", error);
      alert("Failed to update publication");
    }
  };

  const handlePrevious = () => navigate("/SubjectEngaged");
  const handleNext = () => navigate("/Patent");

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
            📘 Publications
          </Typography>

          {/* View / Add Toggle */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            {!viewMode ? (
              <Button variant="outlined" startIcon={<Visibility />} onClick={() => setViewMode(true)}>
                View All Publications
              </Button>
            ) : (
              <Button variant="outlined" startIcon={<Add />} onClick={() => setViewMode(false)}>
                Add New Publication
              </Button>
            )}
          </Box>

          {/* ==================== ADD MODE ==================== */}
          {!viewMode &&
            publications.map((pub, index) => (
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
                  Publication {index + 1}
                </Typography>
                <Grid container spacing={2}>
                  {[
                    ["Category", "category"],
                    ["Title", "title"],
                    ["Name of Publication", "nameOfPublication"],
                    ["Publication Number.", "patentNo"],
                    ["Indexing", "indexing"],
                    ["Academic Year", "academicYear"],
                    ["Date", "date", "date"],
                    ["Period", "period"],
                  ].map(([label, name, type]) => (
                    <Grid item xs={12} sm={6} md={3} key={name}>
                      <TextField
                        label={label}
                        type={type || "text"}
                        fullWidth
                        value={pub[name]}
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
                          color: pub.document ? "#1565c0" : "#777",
                          maxWidth: "150px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {pub.document ? pub.document.name : "No file selected"}
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

                {publications.length > 1 && (
                  <Box sx={{ textAlign: "right", mt: 2 }}>
                    <Button color="error" onClick={() => handleRemoveRow(index)}>
                      Remove
                    </Button>
                  </Box>
                )}
              </Paper>
            ))}

          {!viewMode && (
            <>
              <Box sx={{ textAlign: "center", my: 3 }}>
                <Button variant="outlined" onClick={handleAddRow}>
                  + Add Another Publication
                </Button>
              </Box>
              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Button variant="contained" onClick={handleSubmit} disabled={loading} sx={{ px: 6, py: 1.2 }}>
                  {loading ? "Saving..." : "Save Publications"}
                </Button>
              </Box>
            </>
          )}

          {/* ==================== VIEW MODE ==================== */}
          {viewMode && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ color: "#1a237e", mb: 2, textAlign: "center" }}>
                Your Publications ({existingPublications.length})
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#1a237e" }}>
                    <TableRow>
                      <TableCell sx={{ color: "#fff" }}>Title</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Category</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Academic Year</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Document</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {existingPublications.map((pub, index) => (
                      <TableRow key={index}>
                        <TableCell>{pub.title}</TableCell>
                        <TableCell>{pub.category}</TableCell>
                        <TableCell>{pub.academicYear}</TableCell>
                        <TableCell>
                          {pub.document ? (
                            <Tooltip title="View File">
                              <IconButton color="primary" onClick={() => handlePreview(pub.document)}>
                                {pub.document.endsWith(".pdf") ? <PictureAsPdf /> : <Image />}
                              </IconButton>
                            </Tooltip>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton color="secondary" onClick={() => handleEdit(pub)}>
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton color="error" onClick={() => handleDelete(pub._id)}>
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
              Previous
            </Button>
            <Button variant="contained" onClick={handleNext}>
              Next →
            </Button>
          </Box>
        </Paper>

        {/* ==================== FILE PREVIEW MODAL ==================== */}
        <Dialog open={previewDialog} onClose={() => setPreviewDialog(false)} maxWidth="lg" fullWidth>
          <DialogTitle>Document Preview</DialogTitle>
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

        {/* 🟢 EDIT DIALOG */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Publication</DialogTitle>
          <DialogContent>
            {editData && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {Object.entries(editData)
                  .filter(([k]) => !["_id", "__v", "gmail", "createdAt", "updatedAt"].includes(k))
                  .map(([key, value]) => (
                    <Grid item xs={12} sm={6} key={key}>
                      {key === "document" ? (
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Current: {editData.document || "No file"}
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

export default Publications;
