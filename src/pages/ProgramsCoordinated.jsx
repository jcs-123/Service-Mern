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
  Card,
  CardContent,
  Alert,
  LinearProgress,
  useMediaQuery,
  useTheme,
  InputAdornment,
  FormHelperText,
  CircularProgress
} from "@mui/material";
import {
  Visibility,
  Edit,
  Delete,
  Add,
  CloudUpload,
  PictureAsPdf,
  Image,
  Download,
  CalendarMonth,
  Category,
  School,
  DateRange,
  ArrowBack,
  ArrowForward,
  Save,
  Cancel,
  CheckCircle,
  Info,
  Article,
  Bookmark
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ================= CONSTANTS ================= */

const CATEGORY_OPTIONS = [
  { value: "FDP", label: "Faculty Development Program", icon: "👨‍🏫" },
  { value: "Conference", label: "Conference", icon: "🎤" },
  { value: "STTP", label: "Short Term Training Program", icon: "📚" },
  { value: "Workshop", label: "Workshop", icon: "🔧" },
  { value: "MOOC", label: "Massive Open Online Course", icon: "💻" },
  { value: "Seminar", label: "Seminar", icon: "🎓" },
  { value: "Other Programs", label: "Other Programs", icon: "📋" },
  { value: "Value Added Courses", label: "Value Added Courses", icon: "⭐" },
];

const FUNDED_BY_OPTIONS = [
  { value: "DTE", label: "DTE" },
  { value: "AICTE (ATAL)", label: "AICTE (ATAL)" },
  { value: "KTU", label: "KTU" },
  { value: "JEC", label: "JEC" },
  { value: "OTHERS", label: "Others" },
];

/* ================= ACADEMIC YEAR LOGIC ================= */

// Generate academic year options in format "1990-1991"
const generateAcademicYearOptions = () => {
  const options = [];
  const currentYear = new Date().getFullYear();
  const startYear = 2001;

  for (let year = currentYear; year >= startYear; year--) {
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
    errors.organisedBy = "Funding source is required";
  }
  
  if (!program.fromDate) {
    errors.fromDate = "Start date is required";
  } else if (new Date(program.fromDate) > new Date()) {
    errors.fromDate = "Start date cannot be in the future";
  }
  
  if (program.toDate && new Date(program.toDate) < new Date(program.fromDate)) {
    errors.toDate = "End date must be after start date";
  }
  
  // Academic year validation
  if (!program.academicYear) {
    errors.academicYear = "Academic year is required";
  }
  
  // File validation
  if (program.certificate) {
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

/* ================= COMPONENT ================= */

const ProgramsCoordinated = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const gmail = localStorage.getItem("gmail") || "";
  
  const [viewMode, setViewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [programs, setPrograms] = useState([
    {
      title: "",
      category: "",
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
    if (gmail) {
      fetchPrograms();
    } else {
      toast.error("Please login to access programs");
      navigate("/login");
    }
  }, [gmail, navigate]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://service-book-backend.onrender.com/api/programs-coordinated/${gmail}`
      );
      if (res.data.success) {
        // Add temporary fields for display
        const programsWithTempFields = res.data.data.map(program => {
          let tempFromYear = "";
          let tempToYear = "";
          
          if (program.academicYear) {
            if (program.academicYear.includes(" to ")) {
              const parts = program.academicYear.split(" to ");
              tempFromYear = parts[0];
              tempToYear = parts[1];
            } else {
              tempFromYear = program.academicYear;
              tempToYear = program.academicYear;
            }
          }
          
          return {
            ...program,
            tempFromYear,
            tempToYear
          };
        });
        
        setExistingPrograms(programsWithTempFields);
      }
    } catch (err) {
      toast.error("Failed to load programs");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORM HANDLERS ================= */

const handleChange = (index, field, value) => {
  const updated = [...programs];
  updated[index][field] = value;
  setPrograms(updated);

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
        
        // Only send fields that exist in the schema
     Object.entries(prog).forEach(([key, val]) => {
  if (val !== null && val !== undefined) {
    if (key === "certificate" && val instanceof File) {
      formData.append("certificate", val);
    } else if (key === "toDate") {
      formData.append("toDate", val || "Present");
    } else {
      formData.append(key, val);
    }
  }
});

        
        formData.append("gmail", gmail);
        
        return axios.post(
          "https://service-book-backend.onrender.com/api/programs-coordinated",
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
          organisedBy: "",
          fromDate: "",
          toDate: "",
          academicYear: "",
          certificate: null,
          tempFromYear: "",
          tempToYear: "",
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
        await axios.delete(
          `https://service-book-backend.onrender.com/api/programs-coordinated/${id}`
        );
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

  const handleDownload = async (file) => {
    try {
      const response = await axios.get(
        `https://service-book-backend.onrender.com${file}`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.split('/').pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Failed to download file");
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = (prog) => {
    // Parse academic year for edit form
    let tempFromYear = "";
    let tempToYear = "";
    
    if (prog.academicYear) {
      if (prog.academicYear.includes(" to ")) {
        const parts = prog.academicYear.split(" to ");
        tempFromYear = parts[0];
        tempToYear = parts[1];
      } else {
        tempFromYear = prog.academicYear;
        tempToYear = prog.academicYear;
      }
    }
    
    setEditData({
      ...prog,
      toDate: prog.toDate === "Present" ? "" : prog.toDate,
      certificate: null,
      tempFromYear,
      tempToYear
    });
    setEditErrors({});
    setEditDialogOpen(true);
  };

  const handleEditChange = (field, value) => {
    const updated = { ...editData };
    updated[field] = value;
    
    // Handle academic year logic
    if (field === 'tempFromYear' || field === 'tempToYear') {
      const fromYear = field === 'tempFromYear' ? value : updated.tempFromYear;
      const toYear = field === 'tempToYear' ? value : updated.tempToYear;
      
      // Update the actual academicYear field for backend
      if (fromYear && toYear) {
        if (fromYear === toYear) {
          updated.academicYear = fromYear;
        } else {
          const fromYearNum = parseInt(fromYear.split("-")[0]);
          const toYearNum = parseInt(toYear.split("-")[0]);
          
          if (toYearNum < fromYearNum) {
            updated.academicYear = `${toYear} to ${fromYear}`;
          } else {
            updated.academicYear = `${fromYear} to ${toYear}`;
          }
        }
      } else if (fromYear) {
        updated.academicYear = fromYear;
      } else if (toYear) {
        updated.academicYear = toYear;
      }
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
      
      // Only send fields that exist in the schema
      Object.entries(editData).forEach(([key, val]) => {
        if (!["_id", "__v", "createdAt", "updatedAt", "tempFromYear", "tempToYear"].includes(key)) {
          if (key === "toDate") {
            formData.append("toDate", val ? val : "Present");
          } else if (key === "certificate" && val instanceof File) {
            formData.append("certificate", val);
          } else if (val !== null && val !== undefined) {
            formData.append(key, val);
          }
        }
      });
      
      await axios.put(
        `https://service-book-backend.onrender.com/api/programs-coordinated/${editData._id}`,
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
      const firstPart = academicYear.split(" ")[0];
      return parseInt(firstPart.split("-")[0]) || 0;
    };
    
    return getYear(b.academicYear) - getYear(a.academicYear);
  });

  /* ================= RENDER FUNCTIONS ================= */

  const renderFileIcon = (filename) => {
    if (!filename) return null;
    
    if (filename.endsWith('.pdf')) {
      return <PictureAsPdf color="error" />;
    } else if (filename.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return <Image color="primary" />;
    } else {
      return <Article color="action" />;
    }
  };

  /* ================= MAIN RENDER ================= */

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'background.default',
      p: { xs: 1, sm: 2, md: 3 }
    }}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={isMobile ? 0 : 3} 
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            mb: 4
          }}>
            <Box sx={{ mb: isMobile ? 2 : 0 }}>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                gutterBottom
                sx={{ 
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Bookmark />
                Programs Coordinated
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage and track all programs you have coordinated
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

          {/* Add Mode */}
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
                    elevation={2}
                    sx={{ 
                      p: 3, 
                      mb: 3,
                      position: 'relative',
                      border: errors[index] && Object.keys(errors[index]).length > 0 ? 
                        '1px solid red' : '1px solid transparent'
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
                    
                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Program #{index + 1}
                      {Object.keys(errors[index] || {}).length === 0 && prog.title && (
                        <CheckCircle color="success" fontSize="small" />
                      )}
                    </Typography>
                    
                   <Grid container spacing={3}>
  {/* Row 1: Title, Category, Funded By */}
  <Grid item xs={12} md={4}>
    <TextField
      label="Program Title"
      fullWidth
      value={prog.title}
      onChange={(e) => handleChange(index, "title", e.target.value)}
      error={!!errors[index]?.title}
      helperText={errors[index]?.title || " "}
      required
      margin="normal"
    />
  </Grid>

  <Grid item xs={12} md={4}>
    <TextField
      select
      label="Category"
      fullWidth
      value={prog.category}
      onChange={(e) => handleChange(index, "category", e.target.value)}
      error={!!errors[index]?.category}
      helperText={errors[index]?.category || "Select program category"}
      required
      margin="normal"
    >
      {CATEGORY_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  </Grid>

  <Grid item xs={12} md={4}>
    <TextField
      select
      label="Funded By"
      fullWidth
      value={prog.organisedBy}
      onChange={(e) => handleChange(index, "organisedBy", e.target.value)}
      error={!!errors[index]?.organisedBy}
      helperText={errors[index]?.organisedBy || "Select funding organization"}
      required
      margin="normal"
    >
      {FUNDED_BY_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  </Grid>

  {/* Row 2: Academic Year Range (Spans full width on desktop, shows as row on mobile) */}
<Grid item xs={12} md={4}>
  <TextField
    select
    label="Academic Year"
    fullWidth
    value={prog.academicYear}
    onChange={(e) =>
      handleChange(index, "academicYear", e.target.value)
    }
    error={!!errors[index]?.academicYear}
    helperText={
      errors[index]?.academicYear || "Select academic year"
    }
    required
    margin="normal"
  >
    <MenuItem value="">
      <em>Select Academic Year</em>
    </MenuItem>

    {ACADEMIC_YEAR_OPTIONS.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>
</Grid>


  {/* Row 3: Start Date, End Date, Certificate (3 columns on desktop, stacked on mobile) */}
  <Grid item xs={12} md={4}>
    <TextField
      type="date"
      label="Start Date"
      InputLabelProps={{ shrink: true }}
      fullWidth
      value={prog.fromDate}
      onChange={(e) => handleChange(index, "fromDate", e.target.value)}
      error={!!errors[index]?.fromDate}
      helperText={errors[index]?.fromDate || "Program start date"}
      required
      margin="normal"
    />
  </Grid>

  <Grid item xs={12} md={4}>
    <TextField
      type="date"
      label="End Date"
      InputLabelProps={{ shrink: true }}
      fullWidth
      value={prog.toDate}
      onChange={(e) => handleChange(index, "toDate", e.target.value)}
      error={!!errors[index]?.toDate}
      helperText={errors[index]?.toDate || "Leave empty if currently ongoing"}
      margin="normal"
    />
  </Grid>

  <Grid item xs={12} md={4}>
    <Box sx={{ mt: 2 }}>
      <Button
        component="label"
        variant="outlined"
        startIcon={<CloudUpload />}
        fullWidth
        sx={{ 
          py: 1.5,
          height: '56px', // Match TextField height
          justifyContent: 'flex-start'
        }}
      >
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="body2" fontWeight="medium">
            Upload Certificate
          </Typography>
          <Typography variant="caption" color="text.secondary">
            PDF, JPG, PNG (Max 5MB)
          </Typography>
        </Box>
        <input
          hidden
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileUpload(index, e)}
        />
      </Button>
      
      {/* Certificate Feedback */}
      <Box sx={{ mt: 1, minHeight: '24px' }}>
        {prog.certificate && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle fontSize="small" color="success" />
            <Box>
              <Typography variant="caption" fontWeight="medium" color="success.main">
                {prog.certificate.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                ({Math.round(prog.certificate.size / 1024)} KB)
              </Typography>
            </Box>
          </Box>
        )}
        
        {errors[index]?.certificate && (
          <FormHelperText 
            error 
            sx={{ 
              m: 0,
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
    </Box>
  </Grid>
</Grid>
                  </Paper>
                ))}
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddRow}
                  >
                    Add Another Program
                  </Button>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* View Mode */}
          <AnimatePresence>
            {viewMode && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
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
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead sx={{ bgcolor: 'primary.main' }}>
                        <TableRow>
                          <TableCell sx={{ color: 'white' }}>#</TableCell>
                          <TableCell sx={{ color: 'white' }}>Title</TableCell>
                          <TableCell sx={{ color: 'white' }}>Category</TableCell>
                          <TableCell sx={{ color: 'white' }}>Academic Year</TableCell>
                          <TableCell sx={{ color: 'white' }}>From Date</TableCell>
                          <TableCell sx={{ color: 'white' }}>To Date</TableCell>
                          <TableCell sx={{ color: 'white' }}>Certificate</TableCell>
                          <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sortedPrograms.map((p, index) => (
                          <TableRow key={p._id} hover>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{p.title}</TableCell>
                            <TableCell>
                              <Chip
                                label={p.category}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={p.academicYear || "Not set"}
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>{p.fromDate}</TableCell>
                            <TableCell>
                              {p.toDate === "Present" ? (
                                <Chip
                                  label="Present"
                                  size="small"
                                  color="secondary"
                                />
                              ) : (
                                p.toDate
                              )}
                            </TableCell>
                            <TableCell>
                              {p.certificate && (
                                <Tooltip title="Preview Certificate">
                                  <IconButton onClick={() => handlePreview(p.certificate)}>
                                    {renderFileIcon(p.certificate)}
                                  </IconButton>
                                </Tooltip>
                              )}
                            </TableCell>
                            <TableCell>
                              <Tooltip title="Edit">
                                <IconButton onClick={() => handleEdit(p)}>
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton color="error" onClick={() => handleDelete(p._id)}>
                                  <Delete />
                                </IconButton>
                              </Tooltip>
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
            borderColor: 'divider'
          }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/Publications")}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={() => navigate("/ProgramsAttended")}
            >
              Next
            </Button>
          </Box>
        </Paper>

        {/* Preview Dialog */}
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
              previewFile.endsWith(".pdf") ? (
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
          maxWidth="sm" 
          fullWidth
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
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {/* Title */}
                <Grid item xs={12}>
                  <TextField
                    label="Title"
                    fullWidth
                    value={editData.title || ''}
                    onChange={(e) => handleEditChange('title', e.target.value)}
                    error={!!editErrors.title}
                    helperText={editErrors.title}
                    required
                  />
                </Grid>

                {/* Academic Year Range */}
          <Grid item xs={12}>
  <TextField
    select
    label="Academic Year"
    fullWidth
    value={editData.academicYear || ""}
    onChange={(e) =>
      handleEditChange("academicYear", e.target.value)
    }
    error={!!editErrors.academicYear}
    helperText={editErrors.academicYear}
    required
  >
    <MenuItem value="">
      <em>Select Academic Year</em>
    </MenuItem>

    {ACADEMIC_YEAR_OPTIONS.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>
</Grid>


                {/* From Date */}
                <Grid item xs={12} md={6}>
                  <TextField
                    type="date"
                    label="Start Date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={editData.fromDate || ''}
                    onChange={(e) => handleEditChange('fromDate', e.target.value)}
                    error={!!editErrors.fromDate}
                    helperText={editErrors.fromDate}
                    required
                  />
                </Grid>

                {/* To Date */}
                <Grid item xs={12} md={6}>
                  <TextField
                    type="date"
                    label="End Date (Leave empty = Present)"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={editData.toDate || ''}
                    onChange={(e) => handleEditChange('toDate', e.target.value)}
                    error={!!editErrors.toDate}
                    helperText={editErrors.toDate}
                  />
                </Grid>

                {/* Certificate */}
                <Grid item xs={12}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    fullWidth
                  >
                    Update Certificate
                    <input
                      hidden
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleEditChange('certificate', e.target.files[0])}
                    />
                  </Button>
                  {editErrors.certificate && (
                    <FormHelperText error>{editErrors.certificate}</FormHelperText>
                  )}
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

export default ProgramsCoordinated;