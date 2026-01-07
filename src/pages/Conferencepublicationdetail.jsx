import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Modal, Alert, LinearProgress, IconButton } from "@mui/material";
import { Table, Form, Row, Col, Card, Badge } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

/* ================================
   ACADEMIC YEARS
================================ */
const academicYears = Array.from({ length: 25 }, (_, i) => {
  const start = 2025 - i;
  return `${start}-${start + 1}`;
});

/* ================================
   API BASE
================================ */
const API = "https://service-book-backend.onrender.com/api/conference-publications";

const ConferencePublication = () => {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({});
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const gmail = localStorage.getItem("gmail");

  /* ================================
     FETCH DATA
  ================================ */
  const fetchData = async () => {
    if (!gmail) {
      setError("User not authenticated");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API}/${gmail}`);
      setRecords(res.data);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================================
     FORM HANDLERS
  ================================ */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) =>
    setForm({ ...form, [e.target.name]: e.target.files[0] });

  /* ================================
     RESET FORM
  ================================ */
  const resetForm = () => {
    setForm({});
    setIsEditing(false);
    setEditingId(null);
    setSelectedRecord(null);
  };

  /* ================================
     HANDLE VIEW
  ================================ */
  const handleView = (record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  /* ================================
     HANDLE EDIT
  ================================ */
  const handleEdit = (record) => {
    setForm({
      academicYear: record.academicYear || "",
      conferenceType: record.conferenceType || "",
      fromDate: record.fromDate || "",
      toDate: record.toDate || "",
      conferenceName: record.conferenceName || "",
      organizingInstitute: record.organizingInstitute || "",
      sponsoredBy: record.sponsoredBy || "",
      paperTitle: record.paperTitle || "",
      pageNumbers: record.pageNumbers || "",
      publishedProceedings: record.publishedProceedings || "No",
      publishedJournal: record.publishedJournal || "No",
      proceedingsDetails: record.proceedingsDetails || "",
      indexing: record.indexing || "",
      publisherName: record.publisherName || "",
      journalName: record.journalName || "",
      issn: record.issn || "",
    });
    setIsEditing(true);
    setEditingId(record._id);
    setShowModal(true);
  };

  /* ================================
     SAVE / UPDATE
  ================================ */
  const handleSave = async () => {
    // Validation
    if (!form.academicYear || !form.conferenceType || !form.conferenceName) {
      setError("Please fill in all required fields (marked with *)");
      return;
    }

    const fd = new FormData();
    fd.append("gmail", gmail);

    Object.keys(form).forEach((key) => {
      if (form[key] !== undefined && form[key] !== null) {
        fd.append(key, form[key]);
      }
    });

    try {
      if (isEditing && editingId) {
        // Update existing record
        await axios.put(`${API}/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Record updated successfully!");
      } else {
        // Create new record
        await axios.post(API, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Record added successfully!");
      }

      resetForm();
      setShowModal(false);
      fetchData();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(isEditing ? "Failed to update record" : "Failed to save record");
      console.error(err);
    }
  };

  /* ================================
     DELETE
  ================================ */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    
    try {
      await axios.delete(`${API}/${id}`);
      setSuccess("Record deleted successfully!");
      fetchData();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete record");
      console.error(err);
    }
  };

  const getBadgeVariant = (type) => {
    switch (type) {
      case "International": return "success";
      case "National": return "primary";
      default: return "secondary";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box className="container-fluid p-4">
      {/* ================= HEADER CARD ================= */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Typography variant="h5" className="fw-bold mb-1">
                Conference & Publication Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your conference participation and publications
              </Typography>
            </div>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="px-4 py-2"
            >
              Add New Record
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* ================= ALERTS ================= */}
      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" className="mb-4" onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {/* ================= LOADING INDICATOR ================= */}
      {loading && <LinearProgress className="mb-4" />}

      {/* ================= TABLE CARD ================= */}
      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">#</th>
                  <th>Academic Year</th>
                  <th>Type</th>
                  <th>Conference Name</th>
                  <th>Paper Title</th>
                  <th>Dates</th>
                  <th className="text-center pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <div className="text-muted">
                        <Typography variant="body1" className="mb-2">
                          No records found
                        </Typography>
                        <Typography variant="body2">
                          Click "Add New Record" to add your first conference or publication
                        </Typography>
                      </div>
                    </td>
                  </tr>
                ) : (
                  records.map((r, i) => (
                    <tr key={r._id}>
                      <td className="ps-4 fw-semibold">{i + 1}</td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {r.academicYear}
                        </span>
                      </td>
                      <td>
                        <Badge bg={getBadgeVariant(r.conferenceType)} className="px-3 py-1">
                          {r.conferenceType}
                        </Badge>
                      </td>
                      <td className="fw-medium">{r.conferenceName}</td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: "250px" }}>
                          {r.paperTitle || "—"}
                        </div>
                      </td>
                      <td>
                        <small className="text-muted">
                          {r.fromDate && r.toDate ? `${formatDate(r.fromDate)} to ${formatDate(r.toDate)}` : "—"}
                        </small>
                      </td>
                      <td className="pe-4">
                        <div className="d-flex justify-content-center gap-2">
                          <IconButton
                            size="small"
                            onClick={() => handleView(r)}
                            className="text-primary"
                            title="View Details"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(r)}
                            className="text-warning"
                            title="Edit Record"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(r._id)}
                            className="text-danger"
                            title="Delete Record"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* ================= ADD/EDIT MODAL ================= */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          sx={{
            width: "90%",
            maxWidth: "1200px",
            maxHeight: "90vh",
            bgcolor: "#fff",
            p: 0,
            mx: "auto",
            mt: 3,
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 24,
          }}
        >
          {/* Modal Header */}
          <Card className="border-0 rounded-bottom-0">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center">
                <Typography variant="h6" className="fw-bold mb-0">
                  {isEditing ? "Edit Conference / Publication Record" : "Add Conference / Publication Record"}
                </Typography>
                <IconButton onClick={() => setShowModal(false)} size="small">
                  <CloseIcon />
                </IconButton>
              </div>
            </Card.Body>
          </Card>

          {/* Modal Body */}
          <div className="p-4" style={{ overflowY: "auto", maxHeight: "calc(90vh - 140px)" }}>
            <Form>
              {/* SECTION 1: BASIC DETAILS */}
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <Typography variant="subtitle1" className="fw-bold mb-3 text-primary">
                    📅 Basic Details
                  </Typography>
                  
                  <Row className="mb-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Academic Year <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select 
                          name="academicYear" 
                          onChange={handleChange}
                          value={form.academicYear || ""}
                          className="py-2"
                          required
                        >
                          <option value="">Select Academic Year</option>
                          {academicYears.map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Conference Type <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select 
                          name="conferenceType" 
                          onChange={handleChange}
                          value={form.conferenceType || ""}
                          className="py-2"
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="National">National</option>
                          <option value="International">International</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={2}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">From Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="fromDate"
                          onChange={handleChange}
                          value={form.fromDate || ""}
                          className="py-2"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={2}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">To Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="toDate"
                          onChange={handleChange}
                          value={form.toDate || ""}
                          className="py-2"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* SECTION 2: CONFERENCE DETAILS */}
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <Typography variant="subtitle1" className="fw-bold mb-3 text-primary">
                    🏛️ Conference Details
                  </Typography>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Conference Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          name="conferenceName"
                          onChange={handleChange}
                          value={form.conferenceName || ""}
                          className="py-2"
                          placeholder="Enter conference name"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Organizing Institute</Form.Label>
                        <Form.Control
                          name="organizingInstitute"
                          onChange={handleChange}
                          value={form.organizingInstitute || ""}
                          className="py-2"
                          placeholder="Enter institute name"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Sponsored By</Form.Label>
                        <Form.Control
                          name="sponsoredBy"
                          onChange={handleChange}
                          value={form.sponsoredBy || ""}
                          className="py-2"
                          placeholder="e.g., IEEE, AICTE, etc."
                        />
                      </Form.Group>
                    </Col>

                    <Col md={8}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Title of Paper Presented</Form.Label>
                        <Form.Control
                          name="paperTitle"
                          onChange={handleChange}
                          value={form.paperTitle || ""}
                          className="py-2"
                          placeholder="Enter paper title"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* SECTION 3: PUBLICATION DETAILS */}
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <Typography variant="subtitle1" className="fw-bold mb-3 text-primary">
                    📄 Publication Details
                  </Typography>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Page Numbers</Form.Label>
                        <Form.Control
                          name="pageNumbers"
                          onChange={handleChange}
                          value={form.pageNumbers || ""}
                          className="py-2"
                          placeholder="e.g., 123-130 or 48-54"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Published in Proceedings?</Form.Label>
                        <Form.Select
                          name="publishedProceedings"
                          onChange={handleChange}
                          value={form.publishedProceedings || "No"}
                          className="py-2"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Published in Journal?</Form.Label>
                        <Form.Select
                          name="publishedJournal"
                          onChange={handleChange}
                          value={form.publishedJournal || "No"}
                          className="py-2"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Proceedings Details</Form.Label>
                        <Form.Control
                          name="proceedingsDetails"
                          onChange={handleChange}
                          value={form.proceedingsDetails || ""}
                          className="py-2"
                          placeholder="Enter proceedings details"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Indexing</Form.Label>
                        <Form.Control 
                          name="indexing" 
                          onChange={handleChange}
                          value={form.indexing || ""}
                          className="py-2"
                          placeholder="e.g., Scopus, Web of Science"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Publisher Name</Form.Label>
                        <Form.Control
                          name="publisherName"
                          onChange={handleChange}
                          value={form.publisherName || ""}
                          className="py-2"
                          placeholder="Enter publisher name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Published Journal</Form.Label>
                        <Form.Control
                          name="journalName"
                          onChange={handleChange}
                          value={form.journalName || ""}
                          className="py-2"
                          placeholder="Enter journal name"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">ISSN / ISBN</Form.Label>
                        <Form.Control 
                          name="issn" 
                          onChange={handleChange}
                          value={form.issn || ""}
                          className="py-2"
                          placeholder="Enter ISSN/ISBN"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* SECTION 4: UPLOAD DOCUMENTS */}
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <Typography variant="subtitle1" className="fw-bold mb-3 text-primary">
                    📎 Upload Documents
                  </Typography>
                  
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Conference Paper (PDF)</Form.Label>
                        <Form.Control
                          type="file"
                          name="paperFile"
                          onChange={handleFile}
                          className="py-2"
                          accept=".pdf,.doc,.docx"
                        />
                        <Form.Text className="text-muted">
                          {isEditing && selectedRecord?.paperFile ? 
                            `Current file: ${selectedRecord.paperFile}` : 
                            "Upload your conference paper"}
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Participation / Presentation Certificate
                        </Form.Label>
                        <Form.Control
                          type="file"
                          name="certificateFile"
                          onChange={handleFile}
                          className="py-2"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <Form.Text className="text-muted">
                          {isEditing && selectedRecord?.certificateFile ? 
                            `Current file: ${selectedRecord.certificateFile}` : 
                            "Upload your certificate"}
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* MODAL ACTIONS */}
              <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                <div>
                  <Typography variant="body2" className="text-muted">
                    <span className="text-danger">*</span> Required fields
                  </Typography>
                </div>
                <div className="d-flex gap-2">
                  <Button 
                    onClick={() => setShowModal(false)}
                    variant="outlined"
                    className="px-4"
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={handleSave}
                    className="px-4"
                    startIcon={<SaveIcon />}
                  >
                    {isEditing ? "Update Record" : "Save Record"}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </Box>
      </Modal>

      {/* ================= VIEW MODAL ================= */}
      <Modal open={showViewModal} onClose={() => setShowViewModal(false)}>
        <Box
          sx={{
            width: "90%",
            maxWidth: "800px",
            maxHeight: "90vh",
            bgcolor: "#fff",
            p: 0,
            mx: "auto",
            mt: 3,
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 24,
          }}
        >
          {/* Modal Header */}
          <Card className="border-0 rounded-bottom-0">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center">
                <Typography variant="h6" className="fw-bold mb-0">
                  Conference / Publication Details
                </Typography>
                <IconButton onClick={() => setShowViewModal(false)} size="small">
                  <CloseIcon />
                </IconButton>
              </div>
            </Card.Body>
          </Card>

          {/* Modal Body */}
          <div className="p-4" style={{ overflowY: "auto", maxHeight: "calc(90vh - 140px)" }}>
            {selectedRecord && (
              <>
                {/* BASIC INFO */}
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <Typography variant="h6" className="fw-bold mb-0">
                        {selectedRecord.conferenceName}
                      </Typography>
                      <Badge bg={getBadgeVariant(selectedRecord.conferenceType)} className="px-3 py-1">
                        {selectedRecord.conferenceType}
                      </Badge>
                    </div>
                    
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <Typography variant="body2" className="text-muted mb-1">
                          Academic Year
                        </Typography>
                        <Typography variant="body1" className="fw-medium">
                          {selectedRecord.academicYear || "—"}
                        </Typography>
                      </div>
                      <div className="col-md-6">
                        <Typography variant="body2" className="text-muted mb-1">
                          Dates
                        </Typography>
                        <Typography variant="body1" className="fw-medium">
                          {selectedRecord.fromDate && selectedRecord.toDate 
                            ? `${formatDate(selectedRecord.fromDate)} to ${formatDate(selectedRecord.toDate)}` 
                            : "—"}
                        </Typography>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <Typography variant="body2" className="text-muted mb-1">
                          Organizing Institute
                        </Typography>
                        <Typography variant="body1" className="fw-medium">
                          {selectedRecord.organizingInstitute || "—"}
                        </Typography>
                      </div>
                      <div className="col-md-6">
                        <Typography variant="body2" className="text-muted mb-1">
                          Sponsored By
                        </Typography>
                        <Typography variant="body1" className="fw-medium">
                          {selectedRecord.sponsoredBy || "—"}
                        </Typography>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12">
                        <Typography variant="body2" className="text-muted mb-1">
                          Paper Title
                        </Typography>
                        <Typography variant="body1" className="fw-medium">
                          {selectedRecord.paperTitle || "—"}
                        </Typography>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                {/* PUBLICATION DETAILS */}
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Body className="p-4">
                    <Typography variant="subtitle1" className="fw-bold mb-3">
                      Publication Information
                    </Typography>
                    
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <Typography variant="body2" className="text-muted mb-1">
                          Page Numbers
                        </Typography>
                        <Typography variant="body1" className="fw-medium">
                          {selectedRecord.pageNumbers || "—"}
                        </Typography>
                      </div>
                      <div className="col-md-4">
                        <Typography variant="body2" className="text-muted mb-1">
                          Published in Proceedings
                        </Typography>
                        <Typography variant="body1" className="fw-medium">
                          {selectedRecord.publishedProceedings || "No"}
                        </Typography>
                      </div>
                      <div className="col-md-4">
                        <Typography variant="body2" className="text-muted mb-1">
                          Published in Journal
                        </Typography>
                        <Typography variant="body1" className="fw-medium">
                          {selectedRecord.publishedJournal || "No"}
                        </Typography>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <Typography variant="body2" className="text-muted mb-1">
                          Proceedings Details
                        </Typography>
                        <Typography variant="body1" className="fw-medium">
                          {selectedRecord.proceedingsDetails || "—"}
                        </Typography>
                      </div>
                      <div className="col-md-6">
                        <Typography variant="body2" className="text-muted mb-1">
                          Indexing
                        </Typography>
                        <Typography variant="body1" className="fw-medium">
                          {selectedRecord.indexing || "—"}
                        </Typography>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <Typography variant="body2" className="text-muted mb-1">
                          Publisher Name
                        </Typography>
                        <Typography variant="body1" className="fw-medium">
                          {selectedRecord.publisherName || "—"}
                        </Typography>
                      </div>
                      <div className="col-md-6">
                        <Typography variant="body2" className="text-muted mb-1">
                          Journal Name
                        </Typography>
                        <Typography variant="body1" className="fw-medium">
                          {selectedRecord.journalName || "—"}
                        </Typography>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <Typography variant="body2" className="text-muted mb-1">
                          ISSN / ISBN
                        </Typography>
                        <Typography variant="body1" className="fw-medium">
                          {selectedRecord.issn || "—"}
                        </Typography>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                {/* DOCUMENTS */}
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Body className="p-4">
                    <Typography variant="subtitle1" className="fw-bold mb-3">
                      Documents
                    </Typography>
                    
                    <div className="row">
                      <div className="col-md-6">
                        <Typography variant="body2" className="text-muted mb-1">
                          Conference Paper
                        </Typography>
                        <Typography variant="body1" className="fw-medium">
                          {selectedRecord.paperFile ? (
                            <a 
                              href={`https://service-book-backend.onrender.com/uploads/${selectedRecord.paperFile}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                              📄 View Paper
                            </a>
                          ) : "—"}
                        </Typography>
                      </div>
                      <div className="col-md-6">
                        <Typography variant="body2" className="text-muted mb-1">
                          Certificate
                        </Typography>
                        <Typography variant="body1" className="fw-medium">
                          {selectedRecord.certificateFile ? (
                            <a 
                              href={`https://service-book-backend.onrender.com/uploads/${selectedRecord.certificateFile}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                              📜 View Certificate
                            </a>
                          ) : "—"}
                        </Typography>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                {/* ACTION BUTTONS */}
                <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                  <Button 
                    onClick={() => setShowViewModal(false)}
                    variant="outlined"
                    className="px-4"
                  >
                    Close
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={() => {
                      setShowViewModal(false);
                      handleEdit(selectedRecord);
                    }}
                    className="px-4"
                    startIcon={<EditIcon />}
                  >
                    Edit Record
                  </Button>
                </div>
              </>
            )}
          </div>
        </Box>
      </Modal>
    </Box>
  );
};

export default ConferencePublication;