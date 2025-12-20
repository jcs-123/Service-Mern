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
  MenuItem,
  Chip,
  Alert,
  LinearProgress,
  CircularProgress,
  FormHelperText,
  Select,
  InputLabel,
  FormControl,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Visibility,
  Edit,
  Delete,
  Add,
  CloudUpload,
  PictureAsPdf,
  Image,
  Save,
  Cancel,
  CheckCircle,
  Info,
  Download,
  ErrorOutline,
  Bookmark,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ================= CONSTANTS ================= */

// Category options as per your request
const CATEGORY_OPTIONS = [
  { value: "FDP", label: "Faculty Development Program" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "STTP", label: "Short Term Training Program" },
  { value: "Conference", label: "Conference" },
  { value: "Seminar", label: "Seminar" },
  { value: "Other programs", label: "Other Programs" },
  { value: "Industrial Training", label: "Industrial Training" },
];

// Period options as per your request
const PERIOD_OPTIONS = [
  { value: "In This College", label: "In This College" },
  { value: "In career (Other than those while in this college)", label: "In career (Other than those while in this college)" },
];

// Organised By options as per your request
const ORGANISED_BY_OPTIONS = [
  { value: "AICTE", label: "AICTE" },
  { value: "IITs / NITs / IIITs", label: "IITs / NITs / IIITs" },
  { value: "NITTTR", label: "NITTTR" },
  { value: "JEC", label: "JEC" },
  { value: "Others", label: "Others" },
];

/* ================= ACADEMIC YEAR LOGIC ================= */

// Generate academic year options in format "2025-2026"
const generateAcademicYearOptions = () => {
  const options = [];
  const currentYear = new Date().getFullYear();
  const startYear = 2000;

  for (let year = currentYear + 5; year >= startYear; year--) {
    const academicYear = `${year}-${year + 1}`;
    options.push({
      value: academicYear,
      label: academicYear,
    });
  }

  return options;
};

const ACADEMIC_YEAR_OPTIONS = generateAcademicYearOptions();

/* ================= VALIDATION ================= */

const validateProgram = (program) => {
  const errors = {};
  
  if (!program.title?.trim()) {
    errors.title = "Title is required";
  } else if (program.title.length < 3) {
    errors.title = "Title must be at least 3 characters";
  }
  
  if (!program.category) {
    errors.category = "Category is required";
  }
  
  if (!program.organisedBy) {
    errors.organisedBy = "Organised By is required";
  }
  
  if (!program.academicYear) {
    errors.academicYear = "Academic year is required";
  }
  
  if (!program.fromDate) {
    errors.fromDate = "From date is required";
  }
  
  if (program.toDate && new Date(program.toDate) < new Date(program.fromDate)) {
    errors.toDate = "To date must be after from date";
  }
  
  // File validation
  if (program.certificate instanceof File) {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(program.certificate.type)) {
      errors.certificate = "File must be PDF, JPEG, or PNG";
    }
    
    if (program.certificate.size > maxSize) {
      errors.certificate = "File size must be less than 5MB";
    }
  }
  
  return errors;
};

/* ================= MAIN COMPONENT ================= */

const ProgramsAttended = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const gmail = localStorage.getItem("gmail") || "jeswinjohn@jecc.ac.in";

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [programs, setPrograms] = useState([
    {
      title: "",
      category: "",
      period: "",
      fundingAgency: "",
      organisedBy: "",
      fromDate: "",
      toDate: "",
      academicYear: "",
      certificate: null,
    },
  ]);

  const [errors, setErrors] = useState([{}]);
  const [existingPrograms, setExistingPrograms] = useState([]);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editErrors, setEditErrors] = useState({});

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://service-book-backend.onrender.com/api/programs-attended/${gmail}`);
      if (res.data.success) {
        console.log("Fetched programs:", res.data.data);
        setExistingPrograms(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load programs");
      console.error("Error fetching programs:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORM HANDLERS ================= */

  const handleChange = (index, field, value) => {
    const updated = [...programs];
    updated[index][field] = value;
    
    // Auto-calculate academic year from dates if both are present
    if ((field === "fromDate" || field === "toDate") && updated[index].fromDate && updated[index].toDate) {
      const fromYear = new Date(updated[index].fromDate).getFullYear();
      const toYear = new Date(updated[index].toDate).getFullYear();
      updated[index].academicYear = `${fromYear}-${toYear + 1}`;
    }
    
    setPrograms(updated);
    
    // Clear error for this field
    if (errors[index]?.[field]) {
      const updatedErrors = [...errors];
      delete updatedErrors[index][field];
      setErrors(updatedErrors);
    }
  };

  const handleFileUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...programs];
      updated[index].certificate = file;
      setPrograms(updated);
      
      const validationErrors = validateProgram(updated[index]);
      if (validationErrors.certificate) {
        const updatedErrors = [...errors];
        updatedErrors[index] = { ...updatedErrors[index], certificate: validationErrors.certificate };
        setErrors(updatedErrors);
        toast.error(validationErrors.certificate);
      }
    }
  };

  const handleAddRow = () => {
    setPrograms([
      ...programs,
      {
        title: "",
        category: "",
        period: "",
        fundingAgency: "",
        organisedBy: "",
        fromDate: "",
        toDate: "",
        academicYear: "",
        certificate: null,
      },
    ]);
    setErrors([...errors, {}]);
  };

  const handleRemoveRow = (index) => {
    if (programs.length > 1) {
      const updated = programs.filter((_, i) => i !== index);
      const updatedErrors = errors.filter((_, i) => i !== index);
      setPrograms(updated);
      setErrors(updatedErrors);
    }
  };

  /* ================= VALIDATION ================= */

  const validateAllPrograms = () => {
    const allErrors = [];
    let isValid = true;
    
    programs.forEach((program, index) => {
      const programErrors = validateProgram(program);
      allErrors[index] = programErrors;
      
      if (Object.keys(programErrors).length > 0) {
        isValid = false;
      }
    });
    
    setErrors(allErrors);
    return isValid;
  };

  /* ================= SAVE ================= */

  const handleSubmit = async () => {
    if (!validateAllPrograms()) {
      toast.error("Please fix all errors before saving");
      return;
    }
    
    try {
      setSubmitting(true);
      const savePromises = programs.map(async (prog) => {
        const formData = new FormData();
        
        Object.entries(prog).forEach(([key, val]) => {
          if (val !== null && val !== undefined) {
            if (key === "certificate" && val instanceof File) {
              formData.append("certificate", val);
            } else if (val !== "") {
              formData.append(key, val);
            }
          }
        });
        
        formData.append("gmail", gmail);
        
        return axios.post(
          "https://service-book-backend.onrender.com/api/programs-attended",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      });
      
      await Promise.all(savePromises);
      
      toast.success("Programs saved successfully!");
      fetchPrograms();
      setPrograms([
        {
          title: "",
          category: "",
          period: "",
          fundingAgency: "",
          organisedBy: "",
          fromDate: "",
          toDate: "",
          academicYear: "",
          certificate: null,
        },
      ]);
      setErrors([{}]);
      setViewMode(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving programs");
      console.error("Save error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      try {
        await axios.delete(`https://service-book-backend.onrender.com/api/programs-attended/${id}`);
        toast.success("Program deleted successfully");
        fetchPrograms();
      } catch (err) {
        toast.error("Failed to delete program");
      }
    }
  };

  /* ================= PREVIEW ================= */

  const handlePreview = (file) => {
    const fullUrl = `https://service-book-backend.onrender.com${file}`;
    setPreviewFile(fullUrl);
    setPreviewDialog(true);
  };

  /* ================= EDIT ================= */

  const handleEdit = (prog) => {
    console.log("Editing program:", prog);
    setEditData({
      ...prog,
      certificate: null, // Reset file input
    });
    setEditErrors({});
    setEditDialogOpen(true);
  };

  const handleEditChange = (field, value) => {
    const updated = { ...editData };
    updated[field] = value;
    
    // Auto-calculate academic year
    if ((field === "fromDate" || field === "toDate") && updated.fromDate && updated.toDate) {
      const fromYear = new Date(updated.fromDate).getFullYear();
      const toYear = new Date(updated.toDate).getFullYear();
      updated.academicYear = `${fromYear}-${toYear + 1}`;
    }
    
    setEditData(updated);
    
    // Clear error
    if (editErrors[field]) {
      setEditErrors({ ...editErrors, [field]: "" });
    }
  };

  const handleUpdate = async () => {
    const validationErrors = validateProgram(editData);
    if (Object.keys(validationErrors).length > 0) {
      setEditErrors(validationErrors);
      toast.error("Please fix errors before updating");
      return;
    }
    
    try {
      const formData = new FormData();
      
      Object.entries(editData).forEach(([key, val]) => {
        if (!["_id", "__v", "createdAt", "updatedAt"].includes(key)) {
          if (key === "certificate" && val instanceof File) {
            formData.append("certificate", val);
          } else if (val !== null && val !== undefined) {
            formData.append(key, val);
          }
        }
      });
      
      await axios.put(
        `https://service-book-backend.onrender.com/api/programs-attended/${editData._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      toast.success("Program updated successfully");
      setEditDialogOpen(false);
      fetchPrograms();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update program");
      console.error("Update error:", err);
    }
  };

  /* ================= SORT ================= */

  const sortedPrograms = [...existingPrograms].sort((a, b) => {
    const getYear = (academicYear) => {
      if (!academicYear) return 0;
      const firstPart = academicYear.split("-")[0];
      return parseInt(firstPart) || 0;
    };
    
    return getYear(b.academicYear || b.fromDate) - getYear(a.academicYear || a.fromDate);
  });

  /* ================= RENDER FUNCTIONS ================= */

  const renderFileIcon = (filename) => {
    if (!filename) return null;
    
    if (filename.includes('.pdf')) {
      return <PictureAsPdf color="error" />;
    } else {
      return <Image color="primary" />;
    }
  };

  /* ================= MAIN RENDER ================= */

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
      <ToastContainer position="top-right" autoClose={3000} />
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "1400px" }}
      >
        <Paper sx={{ 
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
          overflow: 'hidden'
        }}>
          {/* Header Section - FIXED VERSION */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            mb: 4,
            gap: 2
          }}>
            <Box>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                fontWeight="bold"
                sx={{ 
                  color: "#1a237e",
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Bookmark />
                Programs Attended
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                STTP / FDP / Workshop / Seminar / Conference / Industrial Training
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              flexWrap: 'wrap',
              width: isMobile ? '100%' : 'auto'
            }}>
              <Button
                variant={viewMode ? "outlined" : "contained"}
                startIcon={viewMode ? <Add /> : <Visibility />}
                onClick={() => setViewMode(!viewMode)}
                fullWidth={isMobile}
              >
                {viewMode ? "Add New" : "View All"}
              </Button>
              
              {!viewMode && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Save />}
                  onClick={handleSubmit}
                  disabled={submitting}
                  fullWidth={isMobile}
                >
                  {submitting ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Saving...
                    </>
                  ) : (
                    "Save All"
                  )}
                </Button>
              )}
            </Box>
          </Box>

          {/* Loading State */}
          {loading && (
            <Box sx={{ width: '100%', mb: 3 }}>
              <LinearProgress />
              <Typography align="center" sx={{ mt: 1 }}>
                Loading programs...
              </Typography>
            </Box>
          )}

          {/* ADD MODE */}
          <AnimatePresence>
            {!viewMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {programs.map((prog, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 3,
                      mb: 3,
                      backgroundColor: "#f9f9f9",
                      border: errors[index] && Object.keys(errors[index]).length > 0 ? 
                        '2px solid #ff4444' : '1px solid #ddd',
                      borderRadius: 2,
                      position: 'relative',
                    }}
                  >
                    {programs.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveRow(index)}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      >
                        <Cancel fontSize="small" />
                      </IconButton>
                    )}
                    
                    <Typography 
                      variant="h6" 
                      color="primary" 
                      mb={3} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        borderBottom: '1px solid #e0e0e0',
                        pb: 1
                      }}
                    >
                      Program {index + 1}
                      {Object.keys(errors[index] || {}).length === 0 && prog.title && (
                        <CheckCircle color="success" fontSize="small" />
                      )}
                    </Typography>

                    <Grid container spacing={3}>
                      {/* Row 1: Title (Full width on mobile, 2/3 on desktop) */}
                      <Grid item xs={12} md={8}>
                        <TextField
                          label="Program Title *"
                          fullWidth
                          value={prog.title}
                          onChange={(e) => handleChange(index, "title", e.target.value)}
                          error={!!errors[index]?.title}
                          helperText={errors[index]?.title || "Enter the complete program title"}
                          required
                          multiline
                          minRows={1}
                          maxRows={3}
                          sx={{
                            '& .MuiInputBase-root': {
                              minHeight: '56px',
                            }
                          }}
                        />
                      </Grid>

                      {/* Row 1: Category (Full width on mobile, 1/3 on desktop) */}
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth error={!!errors[index]?.category}>
                          <InputLabel>Category *</InputLabel>
                          <Select
                            value={prog.category}
                            label="Category *"
                            onChange={(e) => handleChange(index, "category", e.target.value)}
                            sx={{
                              '& .MuiSelect-select': {
                                display: 'flex',
                                alignItems: 'center',
                                minHeight: '56px',
                              }
                            }}
                          >
                            {CATEGORY_OPTIONS.map((option) => (
                              <MenuItem 
                                key={option.value} 
                                value={option.value}
                                sx={{ minHeight: '48px' }}
                              >
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors[index]?.category && (
                            <FormHelperText>{errors[index]?.category}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>

                      {/* Row 2: Period, Organised By */}
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Period</InputLabel>
                          <Select
                            value={prog.period}
                            label="Period"
                            onChange={(e) => handleChange(index, "period", e.target.value)}
                          >
                            {PERIOD_OPTIONS.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={!!errors[index]?.organisedBy}>
                          <InputLabel>Organised By *</InputLabel>
                          <Select
                            value={prog.organisedBy}
                            label="Organised By *"
                            onChange={(e) => handleChange(index, "organisedBy", e.target.value)}
                          >
                            {ORGANISED_BY_OPTIONS.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors[index]?.organisedBy && (
                            <FormHelperText>{errors[index]?.organisedBy}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>

                      {/* Row 3: Funding Agency, Academic Year */}
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Funding Agency"
                          fullWidth
                          value={prog.fundingAgency}
                          onChange={(e) => handleChange(index, "fundingAgency", e.target.value)}
                          helperText="Optional - Leave blank if not applicable"
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={!!errors[index]?.academicYear}>
                          <InputLabel>Academic Year *</InputLabel>
                          <Select
                            value={prog.academicYear}
                            label="Academic Year *"
                            onChange={(e) => handleChange(index, "academicYear", e.target.value)}
                          >
                            <MenuItem value="">
                              <em>Select Academic Year</em>
                            </MenuItem>
                            {ACADEMIC_YEAR_OPTIONS.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors[index]?.academicYear && (
                            <FormHelperText>{errors[index]?.academicYear}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>

                      {/* Row 4: From Date, To Date */}
                      <Grid item xs={12} md={6}>
                        <TextField
                          type="date"
                          label="From Date *"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          value={prog.fromDate}
                          onChange={(e) => handleChange(index, "fromDate", e.target.value)}
                          error={!!errors[index]?.fromDate}
                          helperText={errors[index]?.fromDate || "Program start date"}
                          required
                          sx={{
                            '& .MuiInputBase-root': {
                              minHeight: '56px',
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          type="date"
                          label="To Date"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          value={prog.toDate}
                          onChange={(e) => handleChange(index, "toDate", e.target.value)}
                          error={!!errors[index]?.toDate}
                          helperText={errors[index]?.toDate || "Leave blank if still ongoing"}
                          sx={{
                            '& .MuiInputBase-root': {
                              minHeight: '56px',
                            }
                          }}
                        />
                      </Grid>

                      {/* Row 5: Certificate Upload */}
                      <Grid item xs={12}>
                        <Box sx={{ 
                          border: '1px dashed #90caf9', 
                          borderRadius: 2,
                          p: 2,
                          backgroundColor: '#f8fbff',
                          mt: 1
                        }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Certificate Upload
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button
                              component="label"
                              variant="outlined"
                              startIcon={<CloudUpload />}
                              sx={{ flexShrink: 0 }}
                            >
                              Choose File
                              <input
                                hidden
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileUpload(index, e)}
                              />
                            </Button>
                            
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              {prog.certificate ? (
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 1,
                                  bgcolor: '#e8f5e9',
                                  p: 1,
                                  borderRadius: 1
                                }}>
                                  <CheckCircle fontSize="small" color="success" />
                                  <Box sx={{ minWidth: 0 }}>
                                    <Typography 
                                      variant="body2" 
                                      fontWeight="medium"
                                      noWrap
                                      sx={{ 
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                      }}
                                    >
                                      {prog.certificate.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {Math.round(prog.certificate.size / 1024)} KB
                                    </Typography>
                                  </Box>
                                </Box>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  No file selected (PDF, JPG, PNG up to 5MB)
                                </Typography>
                              )}
                            </Box>
                          </Box>
                          
                          {errors[index]?.certificate && (
                            <FormHelperText 
                              error 
                              sx={{ 
                                mt: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                              }}
                            >
                              <ErrorOutline fontSize="small" />
                              {errors[index].certificate}
                            </FormHelperText>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}

                {/* Add Another Program Button */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: 2, 
                  my: 3,
                  flexWrap: 'wrap'
                }}>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddRow}
                    size="large"
                  >
                    Add Another Program
                  </Button>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* VIEW MODE */}
          <AnimatePresence>
            {viewMode && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: "#1a237e", 
                    mb: 3, 
                    textAlign: "center",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1
                  }}
                >
                  Your Programs Attended 
                  <Chip 
                    label={existingPrograms.length} 
                    color="primary" 
                    size="small" 
                  />
                </Typography>
                
                {existingPrograms.length === 0 ? (
                  <Alert 
                    severity="info" 
                    icon={<Info />}
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      py: 4
                    }}
                  >
                    <Typography>No programs found. Add your first program!</Typography>
                  </Alert>
                ) : (
                  <TableContainer 
                    component={Paper}
                    sx={{ 
                      maxHeight: '70vh',
                      overflow: 'auto'
                    }}
                  >
                    <Table stickyHeader>
                      <TableHead sx={{ backgroundColor: "#1a237e" }}>
                        <TableRow>
                          <TableCell sx={{ color: "#fff", fontWeight: 'bold', width: '50px' }}>#</TableCell>
                          <TableCell sx={{ color: "#fff", fontWeight: 'bold', minWidth: '200px' }}>Title</TableCell>
                          <TableCell sx={{ color: "#fff", fontWeight: 'bold', width: '120px' }}>Category</TableCell>
                          <TableCell sx={{ color: "#fff", fontWeight: 'bold', width: '150px' }}>Period</TableCell>
                          <TableCell sx={{ color: "#fff", fontWeight: 'bold', width: '150px' }}>Organised By</TableCell>
                          <TableCell sx={{ color: "#fff", fontWeight: 'bold', width: '120px' }}>Academic Year</TableCell>
                          <TableCell sx={{ color: "#fff", fontWeight: 'bold', width: '100px' }}>Certificate</TableCell>
                          <TableCell sx={{ color: "#fff", fontWeight: 'bold', width: '100px' }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sortedPrograms.map((prog, index) => (
                          <TableRow 
                            key={index} 
                            hover
                            sx={{ 
                              '&:hover': { backgroundColor: '#f5f5f5' }
                            }}
                          >
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">
                                {index + 1}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ maxWidth: '300px' }}>
                                <Typography 
                                  variant="body2" 
                                  fontWeight="medium"
                                  sx={{ 
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word'
                                  }}
                                >
                                  {prog.title}
                                </Typography>
                                {prog.fundingAgency && (
                                  <Typography 
                                    variant="caption" 
                                    color="text.secondary"
                                    sx={{ 
                                      display: 'block',
                                      mt: 0.5
                                    }}
                                  >
                                    Funded by: {prog.fundingAgency}
                                  </Typography>
                                )}
                                <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                                  <Typography variant="caption" color="text.secondary">
                                    From: {prog.fromDate || 'N/A'}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    To: {prog.toDate || 'N/A'}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={prog.category || "N/A"}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ fontWeight: 'medium' }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {prog.period || "Not specified"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {prog.organisedBy || "N/A"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={prog.academicYear || "Not set"}
                                size="small"
                                color="success"
                                variant="outlined"
                                sx={{ fontWeight: 'medium' }}
                              />
                            </TableCell>
                            <TableCell>
                              {prog.certificate ? (
                                <Tooltip title="View Certificate">
                                  <IconButton 
                                    color="primary" 
                                    onClick={() => handlePreview(prog.certificate)}
                                    size="small"
                                  >
                                    {renderFileIcon(prog.certificate)}
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <Typography variant="caption" color="text.secondary">
                                  No file
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <Tooltip title="Edit">
                                  <IconButton 
                                    color="secondary" 
                                    onClick={() => handleEdit(prog)}
                                    size="small"
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton 
                                    color="error" 
                                    onClick={() => handleDelete(prog._id)}
                                    size="small"
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 4, 
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/ProgramsCoordinated")}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={() => navigate("/MoocCourseCompleted")}
            >
              Next
            </Button>
          </Box>
        </Paper>

        {/* File Preview Dialog */}
        <Dialog 
          open={previewDialog} 
          onClose={() => setPreviewDialog(false)} 
          maxWidth="lg" 
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>
            Certificate Preview
            <IconButton
              aria-label="close"
              onClick={() => setPreviewDialog(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <Cancel />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {previewFile ? (
              previewFile.includes(".pdf") ? (
                <iframe 
                  src={previewFile} 
                  width="100%" 
                  height={isMobile ? "400px" : "600px"}
                  title="PDF Preview"
                  style={{ border: 'none' }}
                />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <img 
                    src={previewFile} 
                    alt="Certificate Preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '70vh',
                      objectFit: 'contain' 
                    }}
                  />
                </Box>
              )
            ) : (
              <Typography>No file to preview</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewDialog(false)}>Close</Button>
            {previewFile && (
              <Button 
                variant="contained" 
                onClick={() => window.open(previewFile, '_blank')}
                startIcon={<Download />}
              >
                Download
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog 
          open={editDialogOpen} 
          onClose={() => setEditDialogOpen(false)} 
          maxWidth="md" 
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>
            Edit Program
            <IconButton
              aria-label="close"
              onClick={() => setEditDialogOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <Cancel />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {editData && (
              <Grid container spacing={3} sx={{ mt: 1, pt: 1 }}>
                {/* Title - Full width */}
                <Grid item xs={12}>
                  <TextField
                    label="Program Title *"
                    fullWidth
                    value={editData.title || ""}
                    onChange={(e) => handleEditChange("title", e.target.value)}
                    error={!!editErrors.title}
                    helperText={editErrors.title || "Enter the complete program title"}
                    required
                    multiline
                    minRows={1}
                    maxRows={3}
                  />
                </Grid>

                {/* Category and Organised By */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!editErrors.category}>
                    <InputLabel>Category *</InputLabel>
                    <Select
                      value={editData.category || ""}
                      label="Category *"
                      onChange={(e) => handleEditChange("category", e.target.value)}
                    >
                      {CATEGORY_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {editErrors.category && (
                      <FormHelperText>{editErrors.category}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!editErrors.organisedBy}>
                    <InputLabel>Organised By *</InputLabel>
                    <Select
                      value={editData.organisedBy || ""}
                      label="Organised By *"
                      onChange={(e) => handleEditChange("organisedBy", e.target.value)}
                    >
                      {ORGANISED_BY_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {editErrors.organisedBy && (
                      <FormHelperText>{editErrors.organisedBy}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Period and Academic Year */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Period</InputLabel>
                    <Select
                      value={editData.period || ""}
                      label="Period"
                      onChange={(e) => handleEditChange("period", e.target.value)}
                    >
                      {PERIOD_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!editErrors.academicYear}>
                    <InputLabel>Academic Year *</InputLabel>
                    <Select
                      value={editData.academicYear || ""}
                      label="Academic Year *"
                      onChange={(e) => handleEditChange("academicYear", e.target.value)}
                    >
                      <MenuItem value="">
                        <em>Select Academic Year</em>
                      </MenuItem>
                      {ACADEMIC_YEAR_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {editErrors.academicYear && (
                      <FormHelperText>{editErrors.academicYear}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Funding Agency */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Funding Agency"
                    fullWidth
                    value={editData.fundingAgency || ""}
                    onChange={(e) => handleEditChange("fundingAgency", e.target.value)}
                    helperText="Optional"
                  />
                </Grid>

                {/* Dates */}
                <Grid item xs={12} md={6}>
                  <TextField
                    type="date"
                    label="From Date *"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={editData.fromDate || ""}
                    onChange={(e) => handleEditChange("fromDate", e.target.value)}
                    error={!!editErrors.fromDate}
                    helperText={editErrors.fromDate}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="date"
                    label="To Date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={editData.toDate || ""}
                    onChange={(e) => handleEditChange("toDate", e.target.value)}
                    error={!!editErrors.toDate}
                    helperText={editErrors.toDate}
                  />
                </Grid>

                {/* Certificate Upload */}
                <Grid item xs={12}>
                  <Box sx={{ 
                    border: '1px dashed #90caf9', 
                    borderRadius: 2,
                    p: 2,
                    backgroundColor: '#f8fbff'
                  }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Update Certificate
                    </Typography>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUpload />}
                      sx={{ mb: 1 }}
                    >
                      Choose New File
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleEditChange("certificate", e.target.files[0])}
                      />
                    </Button>
                    {editData.certificate && typeof editData.certificate === 'string' && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Current: {editData.certificate.split('/').pop()}
                      </Typography>
                    )}
                    {editErrors.certificate && (
                      <FormHelperText error>{editErrors.certificate}</FormHelperText>
                    )}
                  </Box>
                </Grid>
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