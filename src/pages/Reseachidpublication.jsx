import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  Stack,
} from "@mui/material";

import BadgeIcon from "@mui/icons-material/Badge";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SchoolIcon from "@mui/icons-material/School";
import ArticleIcon from "@mui/icons-material/Article";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import FingerprintIcon from "@mui/icons-material/Fingerprint";

import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL =
  localStorage.getItem("API_BASE_URL") ||
  "https://service-book-backend.onrender.com";

function ResearchIdPublication() {
  const [record, setRecord] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    gmail: "",
    googleScholar: "",
    scopus: "",
    vidwan: "",
    orcid: "",
  });

  /* ===============================
     LOAD DATA
  =============================== */
  useEffect(() => {
    const gmail =
      localStorage.getItem("gmail") ||
      localStorage.getItem("email") ||
      "";

    if (gmail) {
      setForm((prev) => ({ ...prev, gmail }));
      fetchRecord(gmail);
    }
  }, []);

  const fetchRecord = async (gmail) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/research-id/${gmail}`);
      const data = res.data.data[0];

      if (data) {
        setRecord(data);
        setEditId(data._id);
        setForm(data);
      } else {
        setShowForm(true);
      }
    } catch {
      setShowForm(true);
    }
  };

  /* ===============================
     HANDLERS
  =============================== */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`${BASE_URL}/api/research-id/${editId}`, form);
        toast.success("Research profiles updated successfully ✅");
      } else {
        await axios.post(`${BASE_URL}/api/research-id`, form);
        toast.success("Research profiles saved successfully ✅");
      }
      setShowForm(false);
      fetchRecord(form.gmail);
    } catch {
      toast.error("Operation failed ❌");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete Research ID details?"))
      return;

    try {
      await axios.delete(`${BASE_URL}/api/research-id/${editId}`);
      toast.success("Research profiles deleted 🗑️");

      setRecord(null);
      setEditId(null);
      setShowForm(true);
      setForm({
        gmail: form.gmail,
        googleScholar: "",
        scopus: "",
        vidwan: "",
        orcid: "",
      });
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  const ProfileRow = ({ icon, label, value }) => (
    <Stack direction="row" spacing={2} alignItems="flex-start" mb={2}>
      <Box mt={0.3}>{icon}</Box>
      <Box>
        <Typography fontWeight={600}>{label}</Typography>
        {value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#1976d2",
              textDecoration: "none",
              wordBreak: "break-all",
            }}
          >
            {value}
          </a>
        ) : (
          <Typography color="text.secondary">Not provided</Typography>
        )}
      </Box>
    </Stack>
  );

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <ToastContainer />

      {/* ================= HEADER ================= */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
        }}
      >
        <BadgeIcon color="primary" fontSize="large" />
        <Box>
          <Typography fontWeight={700} fontSize={18}>
            Research ID & Profile Links
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Author identifiers & research profiles
          </Typography>
        </Box>
      </Paper>

      {/* ================= VIEW MODE ================= */}
      {!showForm && record && (
        <Paper elevation={2} sx={{ p: 4 }}>
          <ProfileRow
            icon={<SchoolIcon color="primary" />}
            label="Google Scholar"
            value={record.googleScholar}
          />
          <ProfileRow
            icon={<ArticleIcon sx={{ color: "#2e7d32" }} />}
            label="Scopus"
            value={record.scopus}
          />
          <ProfileRow
            icon={<AccountTreeIcon sx={{ color: "#6a1b9a" }} />}
            label="Vidwan"
            value={record.vidwan}
          />
          <ProfileRow
            icon={<FingerprintIcon sx={{ color: "#f57c00" }} />}
            label="ORCID"
            value={record.orcid}
          />

          <Divider sx={{ my: 3 }} />

          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setShowForm(true)}
            >
              Edit
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        </Paper>
      )}

      {/* ================= FORM MODE ================= */}
      {showForm && (
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography fontWeight={700} mb={3}>
            Edit Research Profile Links
          </Typography>

          <Grid container spacing={3}>
            {[
              { name: "googleScholar", label: "Google Scholar Profile Link" },
              { name: "scopus", label: "Scopus Profile Link" },
              { name: "vidwan", label: "Vidwan Profile Link" },
              { name: "orcid", label: "ORCID Profile Link" },
            ].map((field) => (
              <Grid item xs={12} key={field.name}>
                <TextField
                  label={field.label}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            ))}

            <Grid item xs={12} textAlign="center">
              <Button
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
              >
                Save Details
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
  
}

export default ResearchIdPublication;
