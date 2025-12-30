import React, { useEffect, useState } from "react";
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
  MenuItem,
  Chip,
  CircularProgress,
  FormHelperText,
  Divider,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { Edit, Delete, CloudUpload, ArrowForward, ArrowBack } from "@mui/icons-material";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

/* ================= ACADEMIC YEAR OPTIONS ================= */

const generateAcademicYears = () => {
  const years = [];
  const startYear = 1950;
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= startYear; y--) {
    years.push(`${y}-${y + 1}`);
  }
  return years;
};

const ACADEMIC_YEAR_OPTIONS = generateAcademicYears();

/* ================= VALIDATION ================= */

const validateRecord = (record) => {
  const errors = {};
  if (!record.title?.trim()) errors.title = "Title is required";
  if (!record.description?.trim()) errors.description = "Description is required";
if (!record.academicYear)
  errors.academicYear = "Academic year is required";

  if (!record.fromDate) errors.fromDate = "Start date required";
  return errors;
};

/* ================= COMPONENT ================= */

const InteractionsOutsideWorld = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const gmail = localStorage.getItem("gmail") || "";

const initialState = {
  title: "",
  description: "",
  academicYear: "",
  fromDate: "",
  toDate: "",
  certificate: null
};


  const [record, setRecord] = useState(initialState);
  const [records, setRecords] = useState([]);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const res = await axios.get(
      `https://service-book-backend.onrender.com/api/interactions/${gmail}`
    );
    if (res.data.success) setRecords(res.data.data);
  };

  /* ================= HANDLERS ================= */

const handleChange = (e) => {
  const { name, value } = e.target;

  setRecord((prev) => ({
    ...prev,
    [name]: value,
  }));

  // clear validation error instantly
  if (errors[name]) {
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }
};


  const handleFileChange = (e) => {
    setRecord({ ...record, certificate: e.target.files[0] });
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    const validationErrors = validateRecord(record);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      toast.error("Fix errors before saving");
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();

      Object.entries(record).forEach(([k, v]) => {
        if (k === "toDate") {
          formData.append("toDate", v || "Present");
        } else if (k === "certificate" && v) {
          formData.append("certificate", v);
        } else if (!["fromYear", "toYear"].includes(k)) {
          formData.append(k, v);
        }
      });

      formData.append("gmail", gmail);

      if (editId) {
        await axios.put(
          `https://service-book-backend.onrender.com/api/interactions/${editId}`,
          formData
        );
        toast.success("Updated successfully");
      } else {
        await axios.post(
          "https://service-book-backend.onrender.com/api/interactions",
          formData
        );
        toast.success("Saved successfully");
      }

      setRecord(initialState);
      setEditId(null);
      fetchRecords();
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================= EDIT / DELETE ================= */

const handleEdit = (item) => {
  setRecord({
    title: item.title || "",
    description: item.description || "",
    academicYear: item.academicYear || "",
    fromDate: item.fromDate || "",
    toDate: item.toDate === "Present" ? "" : item.toDate || "",
    certificate: null // file cannot be prefilled
  });

  setEditId(item._id);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};


  const handleDelete = async (id) => {
    if (window.confirm("Delete this record?")) {
      await axios.delete(
        `https://service-book-backend.onrender.com/api/interactions/${id}`
      );
      toast.success("Deleted");
      fetchRecords();
    }
  };
const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB"); // dd/mm/yyyy
};

  /* ================= UI ================= */

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <ToastContainer />

      {/* HEADER */}
      <Typography variant="h5" fontWeight={700} mb={2}>
        Interactions with Outside World
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* FORM CARD */}
      <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="h6" mb={2}>
          {editId ? "Edit Interaction" : "Add Interaction"}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title *"
              name="title"
              value={record.title}
              onChange={handleChange}
              fullWidth
              error={!!errors.title}
              helperText={errors.title}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description *"
              name="description"
              value={record.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>

        <Grid item xs={12} md={6}>
  <TextField
    select
    label="Academic Year *"
    name="academicYear"
    value={record.academicYear}
    onChange={handleChange}
    fullWidth
    error={!!errors.academicYear}
    helperText={errors.academicYear}
  >
    <MenuItem value="">
      <em>Select Academic Year</em>
    </MenuItem>
    {ACADEMIC_YEAR_OPTIONS.map((yr) => (
      <MenuItem key={yr} value={yr}>
        {yr}
      </MenuItem>
    ))}
  </TextField>
</Grid>


        

          <Grid item xs={12} md={6}>
            <TextField
              type="date"
              label="From Date"
              name="fromDate"
              InputLabelProps={{ shrink: true }}
              value={record.fromDate}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              type="date"
              label="To Date"
              name="toDate"
              InputLabelProps={{ shrink: true }}
              value={record.toDate}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Button component="label" variant="outlined" fullWidth>
              <CloudUpload sx={{ mr: 1 }} />
              Upload Certificate
              <input hidden type="file" onChange={handleFileChange} />
            </Button>
          </Grid>
        </Grid>

        <Box textAlign="right" mt={3}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <CircularProgress size={20} /> : editId ? "Update" : "Save"}
          </Button>
        </Box>
      </Paper>

      {/* TABLE */}
    {/* ================= TABLE ================= */}
<Paper sx={{ p: { xs: 1, md: 2 }, borderRadius: 2 }}>
  <TableContainer>
    <Table size={isMobile ? "small" : "medium"}>
      <TableHead sx={{ backgroundColor: "#0b3d91" }}>
        <TableRow>
          <TableCell sx={{ color: "#fff" }}>#</TableCell>
          <TableCell sx={{ color: "#fff" }}>Title & Description</TableCell>
          <TableCell sx={{ color: "#fff" }}>Academic Year</TableCell>
          <TableCell sx={{ color: "#fff" }}>Period</TableCell>
           <TableCell sx={{ color: "#fff" }}>view File</TableCell>
          <TableCell sx={{ color: "#fff", width: 120 }}>Actions</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {records.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} align="center">
              <Typography color="text.secondary">
                No records found
              </Typography>
            </TableCell>
          </TableRow>
        ) : (
          records.map((r, index) => (
            <TableRow key={r._id} hover>
              {/* SL NO */}
              <TableCell>{index + 1}</TableCell>

              {/* TITLE + DESCRIPTION */}
              <TableCell>
                <Typography fontWeight={600}>
                  {r.title}
                </Typography>
                {r.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 0.5,
                      maxWidth: 400,
                      whiteSpace: "normal",
                      wordBreak: "break-word"
                    }}
                  >
                    {r.description}
                  </Typography>
                )}
              </TableCell>

              {/* ACADEMIC YEAR */}
              <TableCell>
                <Chip
                  label={r.academicYear}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </TableCell>

              {/* PERIOD */}
          <TableCell>
  <Typography variant="body2" fontWeight={600}>
    {formatDate(r.fromDate)}
  </Typography>

  {r.toDate === "Present" ? (
    <Chip
      label="Present"
      size="small"
      color="success"
      sx={{ mt: 0.5 }}
    />
  ) : (
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ mt: 0.3 }}
    >
      to {formatDate(r.toDate)}
    </Typography>
  )}
</TableCell>

 <TableCell>
                      {r.certificate ? (
                        <a
                          href={`https://service-book-backend.onrender.com${r.certificate}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#1565c0", textDecoration: "none" }}
                        >
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
              {/* ACTIONS */}
              <TableCell>
                <IconButton
                  size="small"
                  onClick={() => handleEdit(r)}
                >
                  <Edit fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(r._id)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </TableContainer>
</Paper>
{/* ================= NAVIGATION BUTTONS ================= */}
<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    mt: 4,
    pt: 3,
    borderTop: "1px solid #e0e0e0",
  }}
>
  <Button
    variant="outlined"
    startIcon={<ArrowBack />}
    component={Link}
    to="/SeminarsGuided"
  >
    Back
  </Button>

  <Button
    variant="contained"
    endIcon={<ArrowForward />}
    component={Link}
    to="/PositionsHeld"
  >
    Next
  </Button>
</Box>

    </Box>
  );
};

export default InteractionsOutsideWorld;
