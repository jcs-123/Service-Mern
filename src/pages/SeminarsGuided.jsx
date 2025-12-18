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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Link,
} from "@mui/material";
import { Edit, Delete, Visibility, Download, PictureAsPdf, Image, InsertDriveFile } from "@mui/icons-material";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SeminarsGuided = () => {
  const navigate = useNavigate();
  const gmail = localStorage.getItem("gmail") || "jeswinjohn@jecc.ac.in";

  const [seminars, setSeminars] = useState({
    category: "",
    title: "",
    programme: "",
    batch: "",
    studentName: "",
    rollNo: "",
    academicYear: "",
    certificate: null,
  });

  const [seminarList, setSeminarList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSeminar, setSelectedSeminar] = useState(null);
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // 🟢 Fetch saved seminars
  useEffect(() => {
    fetchSeminars();
  }, []);

  const fetchSeminars = async () => {
    try {
      const res = await axios.get(
        `https://service-book-backend.onrender.com/api/seminars-guided/${gmail}`
      );
      if (res.data.success) setSeminarList(res.data.data);
    } catch (error) {
      console.error("Error fetching seminars:", error);
    }
  };

  // 🟢 Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeminars((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 File upload
  const handleFileChange = (e) => {
    setSeminars((prev) => ({ ...prev, certificate: e.target.files[0] }));
  };

  // 🟢 Save / Update seminar
  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      for (const key in seminars) {
        if (seminars[key] !== null && seminars[key] !== undefined) {
          formData.append(key, seminars[key]);
        }
      }
      formData.append("gmail", gmail);

      if (editId) {
        await axios.put(
          `https://service-book-backend.onrender.com/api/seminars-guided/${editId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("✅ Seminar updated successfully!");
      } else {
        await axios.post("https://service-book-backend.onrender.com/api/seminars-guided", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Seminar saved successfully!");
      }

      setSeminars({
        category: "",
        title: "",
        programme: "",
        batch: "",
        studentName: "",
        rollNo: "",
        academicYear: "",
        certificate: null,
      });
      setEditId(null);
      fetchSeminars();
    } catch (error) {
      console.error("Error saving seminar:", error);
      alert("❌ Error saving seminar");
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Edit seminar
  const handleEdit = (seminar) => {
    setSeminars({ 
      category: seminar.category || "",
      title: seminar.title || "",
      programme: seminar.programme || "",
      batch: seminar.batch || "",
      studentName: seminar.studentName || "",
      rollNo: seminar.rollNo || "",
      academicYear: seminar.academicYear || "",
      certificate: null,
    });
    setEditId(seminar._id);
  };

  // 🟢 Delete seminar
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await axios.delete(`https://service-book-backend.onrender.com/api/seminars-guided/${id}`);
      fetchSeminars();
    }
  };

  // 🟢 View seminar details
  const handleViewDetails = (seminar) => {
    setSelectedSeminar(seminar);
    setViewDialogOpen(true);
  };

  // 🟢 View file
  const handleViewFile = (fileName) => {
    if (!fileName) {
      alert("No certificate uploaded for this seminar");
      return;
    }
    
    const fileUrl = `https://service-book-backend.onrender.com${fileName}`;
    setSelectedFile({
      name: fileName.split('/').pop(),
      url: fileUrl,
      type: getFileType(fileName)
    });
    setFilePreviewOpen(true);
  };

  // 🟢 Download file
  const handleDownloadFile = (fileName) => {
    if (!fileName) {
      alert("No certificate to download");
      return;
    }
    
    const fileUrl = `https://service-book-backend.onrender.com${fileName}`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🟢 Get file type
  const getFileType = (fileName) => {
    if (!fileName) return 'unknown';
    const extension = fileName.split('.').pop().toLowerCase();
    if (['pdf'].includes(extension)) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image';
    return 'document';
  };

  // 🟢 Get file icon
  const getFileIcon = (fileName) => {
    if (!fileName) return <InsertDriveFile />;
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <PictureAsPdf />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image />;
      default:
        return <InsertDriveFile />;
    }
  };

  const handlePrevious = () => navigate("/ProjectGuided");
  const handleNext = () => navigate("/InteractionsOutsideWorld");

  return (
    <Box
      sx={{
        background: "linear-gradient(180deg, #f3f8ff 0%, #e5efff 100%)",
        minHeight: "100vh",
        py: 5,
        px: { xs: 2, md: 6 },
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
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: "0 8px 25px rgba(30,90,180,0.1)" }}>
          {/* Header */}
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            sx={{
              color: "#0b3d91",
              mb: 3,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Faculty Guided Seminars / Mini Projects
          </Typography>

          {/* ===== FORM SECTION ===== */}
          <Typography variant="h6" sx={{ color: "#1565c0", mb: 3 }}>
            {editId ? "Edit Seminar/Project" : "Add New Seminar/Project"}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Seminar / Project Title *"
                value={seminars.title}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="programme"
                label="Programme *"
                value={seminars.programme}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="batch"
                label="Batch"
                value={seminars.batch}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="studentName"
                label="Student Name *"
                value={seminars.studentName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="rollNo"
                label="Roll No. *"
                value={seminars.rollNo}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="academicYear"
                label="Academic Year *"
                value={seminars.academicYear}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="category"
                label="Category"
                value={seminars.category}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<InsertDriveFile />}
                fullWidth
                sx={{ height: "56px", borderStyle: "dashed" }}
              >
                {seminars.certificate ? seminars.certificate.name : "Upload Certificate (PDF/Image)"}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </Button>
            </Grid>
          </Grid>

          {/* Save Button */}
          <Box sx={{ textAlign: "center", mt: 3, display: "flex", gap: 2, justifyContent: "center" }}>
            {editId && (
              <Button
                variant="outlined"
                onClick={() => {
                  setEditId(null);
                  setSeminars({
                    category: "",
                    title: "",
                    programme: "",
                    batch: "",
                    studentName: "",
                    rollNo: "",
                    academicYear: "",
                    certificate: null,
                  });
                }}
              >
                Cancel Edit
              </Button>
            )}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#0b3d91",
                textTransform: "none",
                fontWeight: "bold",
                px: 4,
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : (editId ? "Update" : "Save Seminar")}
            </Button>
          </Box>

          {/* ===== TABLE SECTION ===== */}
          {seminarList.length > 0 && (
            <>
              <Typography
                variant="h5"
                sx={{
                  mt: 6,
                  mb: 3,
                  color: "#0b3d91",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Saved Seminars & Projects ({seminarList.length})
              </Typography>

              <TableContainer component={Paper} elevation={3}>
                <Table>
                  <TableHead sx={{ background: "#0b3d91" }}>
                    <TableRow>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>#</TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Title</TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Programme</TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Student</TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Roll No</TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Academic Year</TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Certificate</TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {seminarList.map((item, index) => (
                      <TableRow key={item._id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {item.title}
                          </Typography>
                        </TableCell>
                        <TableCell>{item.programme}</TableCell>
                        <TableCell>{item.studentName}</TableCell>
                        <TableCell>{item.rollNo}</TableCell>
                        <TableCell>
                          <Chip 
                            label={item.academicYear} 
                            color="primary" 
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {item.certificate ? (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              {getFileIcon(item.certificate)}
                              <Typography variant="body2">
                                Available
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              No certificate
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton
                              color="primary"
                              onClick={() => handleViewDetails(item)}
                              size="small"
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              color="secondary"
                              onClick={() => handleEdit(item)}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(item._id)}
                              size="small"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {seminarList.length === 0 && (
            <Typography 
              variant="body1" 
              align="center" 
              sx={{ 
                color: "text.secondary", 
                py: 4,
                fontStyle: 'italic'
              }}
            >
              No seminars or projects added yet. Add your first one above.
            </Typography>
          )}

          {/* Navigation */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 4,
              borderTop: "1px solid #e0e0e0",
              pt: 3,
            }}
          >
            <Button variant="outlined" onClick={handlePrevious}>
              ← Previous
            </Button>
            <Button variant="contained" onClick={handleNext} sx={{ backgroundColor: "#0b3d91" }}>
              Next →
            </Button>
          </Box>
        </Paper>

        {/* View Seminar Details Dialog */}
        <Dialog 
          open={viewDialogOpen} 
          onClose={() => setViewDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold" color="#0b3d91">
              Seminar/Project Details
            </Typography>
          </DialogTitle>
          <DialogContent>
            {selectedSeminar && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Title
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
                    {selectedSeminar.title}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Programme
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
                    {selectedSeminar.programme}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Batch
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
                    {selectedSeminar.batch || 'Not specified'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Student Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
                    {selectedSeminar.studentName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Roll No.
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
                    {selectedSeminar.rollNo}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Academic Year
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
                    {selectedSeminar.academicYear}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Category
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
                    {selectedSeminar.category || 'Not specified'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Certificate
                  </Typography>
                  {selectedSeminar.certificate ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, border: "1px solid #e0e0e0", borderRadius: 2, background: "#f9f9f9" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
                        {getFileIcon(selectedSeminar.certificate)}
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedSeminar.certificate.split('/').pop()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => handleViewFile(selectedSeminar.certificate)}
                          size="small"
                        >
                          View
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<Download />}
                          onClick={() => handleDownloadFile(selectedSeminar.certificate)}
                          size="small"
                        >
                          Download
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                      No certificate uploaded
                    </Typography>
                  )}
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* File Preview Dialog */}
        <Dialog 
          open={filePreviewOpen} 
          onClose={() => setFilePreviewOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold">
              Certificate Preview: {selectedFile?.name}
            </Typography>
          </DialogTitle>
          <DialogContent>
            {selectedFile && (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                {selectedFile.type === 'image' ? (
                  <img 
                    src={selectedFile.url} 
                    alt={selectedFile.name}
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '70vh', 
                      objectFit: 'contain',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px'
                    }}
                  />
                ) : (
                  <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: '8px', background: '#f5f5f5' }}>
                    {selectedFile.type === 'pdf' ? (
                      <PictureAsPdf sx={{ fontSize: 64, color: '#f44336', mb: 2 }} />
                    ) : (
                      <InsertDriveFile sx={{ fontSize: 64, color: '#757575', mb: 2 }} />
                    )}
                    <Typography variant="h6" gutterBottom>
                      {selectedFile.type === 'pdf' ? 'PDF Document' : 'Document File'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {selectedFile.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                      {selectedFile.type === 'pdf' 
                        ? 'This is a preview of the PDF file. Click download to get the full file.'
                        : 'This file type cannot be previewed in the browser. Click download to get the file.'
                      }
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      onClick={() => handleDownloadFile(selectedFile.url.replace('https://service-book-backend.onrender.com', ''))}
                    >
                      Download File
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFilePreviewOpen(false)}>
              Close
            </Button>
            {selectedFile && (
              <Button 
                variant="contained" 
                startIcon={<Download />}
                onClick={() => handleDownloadFile(selectedFile.url.replace('https://service-book-backend.onrender.com', ''))}
              >
                Download
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </motion.div>
    </Box>
  );
};

export default SeminarsGuided;