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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const InteractionsOutsideWorld = () => {
  const navigate = useNavigate();
  const gmail = localStorage.getItem("gmail") || "jeswinjohn@jecc.ac.in";

  const [record, setRecord] = useState({
    title: "",
    academicYear: "",
    certificate: null,
  });
  const [records, setRecords] = useState([]);
  const [editId, setEditId] = useState(null);

  // 🟢 Fetch all interactions
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/interactions/${gmail}`
      );
      if (res.data.success) setRecords(res.data.data);
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  // 🟢 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecord((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Handle file upload
  const handleFileChange = (e) => {
    setRecord((prev) => ({ ...prev, certificate: e.target.files[0] }));
  };

  // 🟢 Save / Update record
  const handleSave = async () => {
    try {
      const formData = new FormData();
      for (const key in record) formData.append(key, record[key]);
      formData.append("gmail", gmail);

      if (editId) {
        await axios.put(`http://localhost:4000/api/interactions/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Interaction updated successfully!");
      } else {
        await axios.post("http://localhost:4000/api/interactions", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Interaction added successfully!");
      }

      setRecord({ title: "", academicYear: "", certificate: null });
      setEditId(null);
      fetchRecords();
    } catch (err) {
      console.error("Error saving record:", err);
      alert("❌ Failed to save record");
    }
  };

  // 🟢 Edit record
  const handleEdit = (item) => {
    setRecord({ title: item.title, academicYear: item.academicYear, certificate: null });
    setEditId(item._id);
  };

  // 🟢 Delete record
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await axios.delete(`http://localhost:4000/api/interactions/${id}`);
      fetchRecords();
    }
  };

  const handlePrevious = () => navigate("/SeminarsGuided");
  const handleNext = () => navigate("/PositionsHeld");

  return (
    <Box
      sx={{
        background: "linear-gradient(180deg,#f3f8ff 0%,#e5efff 100%)",
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
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography
            variant="h5"
            align="center"
            fontWeight="bold"
            sx={{
              color: "#0b3d91",
              mb: 3,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Interactions with Outside World
          </Typography>

          {/* Form Section */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Interaction Title / Details"
                name="title"
                value={record.title}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Academic Year"
                name="academicYear"
                value={record.academicYear}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                component="label"
                variant="outlined"
                fullWidth
                sx={{ height: "40px" }}
              >
                Upload Certificate (PDF/Image)
                <input
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: "right", mt: 3 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#0b3d91",
                textTransform: "none",
                fontWeight: "bold",
              }}
              onClick={handleSave}
            >
              {editId ? "Update" : "Save"}
            </Button>
          </Box>

          {/* Table Section */}
          <Typography
            variant="h6"
            sx={{
              mt: 5,
              mb: 2,
              color: "#0b3d91",
              fontWeight: "bold",
            }}
          >
            Saved Records
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ background: "#0b3d91" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff" }}>#</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Title / Details</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Academic Year</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Certificate</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((item, index) => (
                  <TableRow key={item._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.academicYear}</TableCell>
                    <TableCell>
                      {item.certificate ? (
                        <a
                          href={`http://localhost:4000${item.certificate}`}
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
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
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

          {/* Navigation */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 4,
              borderTop: "1px solid #ccc",
              pt: 2,
            }}
          >
            <Button variant="outlined" onClick={handlePrevious}>
              ← Previous
            </Button>
            <Button variant="contained" onClick={handleNext}>
              Next →
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default InteractionsOutsideWorld;
