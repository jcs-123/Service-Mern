import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import { Table } from "react-bootstrap";
import BadgeIcon from "@mui/icons-material/Badge";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const BASE_URL =
  localStorage.getItem("API_BASE_URL") || "https://service-book-backend.onrender.com";

function ResearchIdPublication() {
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    gmail: "",
    googleScholar: "",
    scopus: "",
    vidwan: "",
  });

  /* ===============================
     LOAD GMAIL + FETCH DATA
  =============================== */
  useEffect(() => {
    const gmail =
      localStorage.getItem("gmail") ||
      localStorage.getItem("email") ||
      "";

    if (gmail) {
      setForm((prev) => ({ ...prev, gmail }));
      fetchResearchIds(gmail);
    }
  }, []);

  const fetchResearchIds = async (gmail) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/research-id/${gmail}`
      );
      setRecords(res.data.data || []);
    } catch {
      setRecords([]);
    }
  };

  /* ===============================
     FORM HANDLERS
  =============================== */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddNew = () => {
    setEditId(null);
    setForm({
      gmail: form.gmail,
      googleScholar: "",
      scopus: "",
      vidwan: "",
    });
    setShowForm(true);
  };

  const handleEdit = (row) => {
    setEditId(row._id);
    setForm({
      gmail: row.gmail,
      googleScholar: row.googleScholar,
      scopus: row.scopus,
      vidwan: row.vidwan,
    });
    setShowForm(true);
  };

  /* ===============================
     SAVE / UPDATE
  =============================== */
  const handleSubmit = async () => {
    try {
      if (editId) {
        // ✅ UPDATE
        await axios.put(
          `${BASE_URL}/api/research-id/${editId}`,
          {
            googleScholar: form.googleScholar,
            scopus: form.scopus,
            vidwan: form.vidwan,
          }
        );
        toast.success("Research ID updated successfully ✅");
      } else {
        // ✅ ADD
        await axios.post(`${BASE_URL}/api/research-id`, form);
        toast.success("Research ID added successfully ✅");
      }

      setShowForm(false);
      setEditId(null);
      fetchResearchIds(form.gmail);
    } catch {
      toast.error("Operation failed ❌");
    }
  };

  /* ===============================
     DELETE (WITH CONFIRMATION)
  =============================== */
  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this Research ID?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`${BASE_URL}/api/research-id/${id}`);
      toast.success("Research ID deleted successfully 🗑️");
      setRecords((prev) => prev.filter((r) => r._id !== id));
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 3, px: 2 }}>
      <ToastContainer position="top-right" />

      {/* ================= HEADER ================= */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          backgroundColor: "#e3f2fd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <BadgeIcon sx={{ color: "#1976d2" }} />
          <Typography fontWeight={600} color="#0d47a1">
            Research ID & Profile Links
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
        >
          Add New
        </Button>
      </Paper>

      {/* ================= TABLE ================= */}
      {!showForm && records.length > 0 && (
        <div className="table-responsive">
          <Table bordered hover>
            <thead className="table-primary text-center">
              <tr>
                <th>#</th>
                <th>Google Scholar</th>
                <th>Scopus</th>
                <th>Vidwan</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((row, index) => (
                <tr key={row._id}>
                  <td className="text-center">{index + 1}</td>
                  <td>{row.googleScholar || "-"}</td>
                  <td>{row.scopus || "-"}</td>
                  <td>{row.vidwan || "-"}</td>
                  <td className="text-center">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => handleEdit(row)}
                    >
                      <EditIcon fontSize="small" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(row._id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* ================= FORM ================= */}
      {showForm && (
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography fontWeight={600}>
              {editId ? "Edit" : "Add"} Research Profile Links
            </Typography>

            <Button
              size="small"
              color="error"
              startIcon={<CloseIcon />}
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
            >
              Close
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Google Scholar Profile Link"
                name="googleScholar"
                value={form.googleScholar}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Scopus Profile Link"
                name="scopus"
                value={form.scopus}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Vidwan Profile Link"
                name="vidwan"
                value={form.vidwan}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} textAlign="center">
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ px: 6 }}
                onClick={handleSubmit}
              >
                {editId ? "Update" : "Save"} Details
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
}

export default ResearchIdPublication;
