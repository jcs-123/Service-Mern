import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Modal } from "@mui/material";
import { Table, Form, Row, Col, Container, Card, Badge, Alert, Spinner } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

// Generate academic years (2024-25, 2023-24, etc.)
const academicYears = Array.from({ length: 25 }, (_, i) => {
  const start = new Date().getFullYear() - i;
  return `${start}-${start + 1}`;
});

// Generate publication years in DESCENDING order (2024, 2023, 2022, ...)
const publicationYears = Array.from({ length: 25 }, (_, i) => {
  return new Date().getFullYear() - i;
});

const API = "https://service-book-backend.onrender.com/api/book-publications";

const BookAndBookChapterPublication = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    academicYear: "",
    publicationType: "",
    year: "",
    indexedIn: "No Indexing",
    authorshipOrder: "",
    scope: "National",
    bookTitle: "",
    publisher: "",
    editor: "",
    bookLink: "",
    coAuthors: "",
    isbn: "",
    titlePageFile: null,
    contentPageFile: null,
    firstPageFile: null
  });
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [fileNames, setFileNames] = useState({
    titlePageFile: null,
    contentPageFile: null,
    firstPageFile: null
  });
  const gmail = localStorage.getItem("gmail");

  /* FETCH */
  const fetchData = async () => {
    if (!gmail) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API}/${gmail}`);
      setRecords(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* HANDLERS */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, [e.target.name]: file });
      setFileNames({ ...fileNames, [e.target.name]: file.name });
    }
  };

  /* VALIDATION */
  const validateForm = () => {
    const newErrors = {};
    if (!form.academicYear) newErrors.academicYear = "Academic year is required";
    if (!form.publicationType) newErrors.publicationType = "Publication type is required";
    if (!form.bookTitle) newErrors.bookTitle = "Book title is required";
    if (!form.publisher) newErrors.publisher = "Publisher is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* SAVE/UPDATE */
  const handleSave = async () => {
    if (!validateForm()) return;

    const fd = new FormData();
    fd.append("gmail", gmail);

    // Append all form fields
    Object.keys(form).forEach((key) => {
      if (form[key] !== null && form[key] !== undefined) {
        fd.append(key, form[key]);
      }
    });

    try {
      if (editMode) {
        // Use PUT request for update
        await axios.put(`${API}/${editId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Use POST request for create
        await axios.post(API, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      setShowFormModal(false);
      fetchData();
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save: " + (error.response?.data?.message || error.message));
    }
  };

  /* DELETE */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Failed to delete record");
    }
  };

  /* EDIT */
  const handleEdit = (record) => {
    setForm({
      academicYear: record.academicYear || "",
      publicationType: record.publicationType || "",
      year: record.year || "",
      indexedIn: record.indexedIn || "No Indexing",
      authorshipOrder: record.authorshipOrder || "",
      scope: record.scope || "National",
      bookTitle: record.bookTitle || "",
      publisher: record.publisher || "",
      editor: record.editor || "",
      bookLink: record.bookLink || "",
      coAuthors: record.coAuthors || "",
      isbn: record.isbn || "",
      titlePageFile: null,
      contentPageFile: null,
      firstPageFile: null
    });
    
    setFileNames({
      titlePageFile: record.titlePageFile ? "Previously uploaded file" : null,
      contentPageFile: record.contentPageFile ? "Previously uploaded file" : null,
      firstPageFile: record.firstPageFile ? "Previously uploaded file" : null
    });
    
    setEditMode(true);
    setEditId(record._id);
    setShowFormModal(true);
  };

  /* VIEW */
  const handleView = (record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  /* RESET FORM */
  const resetForm = () => {
    setForm({
      academicYear: "",
      publicationType: "",
      year: "",
      indexedIn: "No Indexing",
      authorshipOrder: "",
      scope: "National",
      bookTitle: "",
      publisher: "",
      editor: "",
      bookLink: "",
      coAuthors: "",
      isbn: "",
      titlePageFile: null,
      contentPageFile: null,
      firstPageFile: null
    });
    setFileNames({
      titlePageFile: null,
      contentPageFile: null,
      firstPageFile: null
    });
    setEditMode(false);
    setEditId(null);
    setErrors({});
  };

  const handleFormModalClose = () => {
    setShowFormModal(false);
    resetForm();
  };

  const handleViewModalClose = () => {
    setShowViewModal(false);
    setSelectedRecord(null);
  };

  return (
    <Container fluid className="p-4">
      {/* HEADER */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="mb-1 fw-bold">Book & Book Chapter Publications</h4>
              <p className="text-muted mb-0">Manage your academic publications and chapters</p>
            </div>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowFormModal(true)}
              className="rounded-2"
            >
              Add Publication
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* TABLE */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Loading publications...</p>
            </div>
          ) : records.length === 0 ? (
            <Alert variant="info" className="text-center">
              No publications found. Click "Add Publication" to get started.
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th width="50">#</th>
                    <th>Academic Year</th>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Publisher</th>
                    <th>Year</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => (
                    <tr key={r._id}>
                      <td className="fw-medium">{i + 1}</td>
                      <td>{r.academicYear}</td>
                      <td>
                        <Badge 
                          bg={r.publicationType === "Book" ? "primary" : "secondary"}
                          className="rounded-pill"
                        >
                          {r.publicationType}
                        </Badge>
                      </td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: "250px" }} title={r.bookTitle}>
                          {r.bookTitle}
                        </div>
                      </td>
                      <td>{r.publisher}</td>
                      <td>{r.year || "-"}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => handleView(r)}
                            title="View Details"
                          >
                            <VisibilityIcon fontSize="small" />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(r)}
                            title="Edit"
                          >
                            <EditIcon fontSize="small" />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(r._id)}
                            title="Delete"
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* FORM MODAL */}
      <Modal 
        open={showFormModal} 
        onClose={handleFormModalClose}
        aria-labelledby="publication-modal"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '95%',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflow: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 0
          }}
        >
          {/* MODAL HEADER */}
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold">
              {editMode ? "Edit Publication" : "Add New Publication"}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={handleFormModalClose}
            ></button>
          </div>

          {/* MODAL BODY */}
          <div className="modal-body p-4">
            <Form>
              {/* ROW 1 */}
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Academic Year <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select 
                      name="academicYear" 
                      value={form.academicYear}
                      onChange={handleChange}
                      className={errors.academicYear ? "is-invalid" : ""}
                    >
                      <option value="">Select Year</option>
                      {academicYears.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </Form.Select>
                    {errors.academicYear && (
                      <div className="invalid-feedback d-block">
                        {errors.academicYear}
                      </div>
                    )}
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Publication Type <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select 
                      name="publicationType" 
                      value={form.publicationType}
                      onChange={handleChange}
                      className={errors.publicationType ? "is-invalid" : ""}
                    >
                      <option value="">Select Type</option>
                      <option value="Book">Book</option>
                      <option value="Book Chapter">Book Chapter</option>
                    </Form.Select>
                    {errors.publicationType && (
                      <div className="invalid-feedback d-block">
                        {errors.publicationType}
                      </div>
                    )}
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Publication Year</Form.Label>
                    <Form.Select 
                      name="year" 
                      value={form.year}
                      onChange={handleChange}
                    >
                      <option value="">Select Year</option>
                      {publicationYears.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* ROW 2 */}
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Indexed In</Form.Label>
                    <Form.Select 
                      name="indexedIn" 
                      value={form.indexedIn}
                      onChange={handleChange}
                    >
                      <option value="No Indexing">No Indexing</option>
                      <option value="SCI">SCI</option>
                      <option value="Scopus">Scopus</option>
                      <option value="Others">Others</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Authorship Order</Form.Label>
                    <Form.Control
                      name="authorshipOrder"
                      placeholder="e.g., First, Second, Third"
                      value={form.authorshipOrder}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Scope</Form.Label>
                    <Form.Select 
                      name="scope" 
                      value={form.scope}
                      onChange={handleChange}
                    >
                      <option value="National">National</option>
                      <option value="International">International</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* ROW 3 */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Book Title <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      name="bookTitle"
                      value={form.bookTitle}
                      onChange={handleChange}
                      className={errors.bookTitle ? "is-invalid" : ""}
                    />
                    {errors.bookTitle && (
                      <div className="invalid-feedback d-block">
                        {errors.bookTitle}
                      </div>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Publisher <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      name="publisher"
                      value={form.publisher}
                      onChange={handleChange}
                      className={errors.publisher ? "is-invalid" : ""}
                    />
                    {errors.publisher && (
                      <div className="invalid-feedback d-block">
                        {errors.publisher}
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {/* ROW 4 */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Editor</Form.Label>
                    <Form.Control 
                      name="editor" 
                      value={form.editor}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Book/Chapter Link</Form.Label>
                    <Form.Control
                      name="bookLink"
                      placeholder="https://"
                      value={form.bookLink}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* ROW 5 */}
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Co-Authors</Form.Label>
                    <Form.Control 
                      name="coAuthors" 
                      value={form.coAuthors}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">ISBN</Form.Label>
                    <Form.Control 
                      name="isbn" 
                      value={form.isbn}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* FILE UPLOADS */}
              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Supporting Documents</h6>
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Title Page of the Book</Form.Label>
                      <Form.Control
                        type="file"
                        name="titlePageFile"
                        onChange={handleFile}
                        className="form-control"
                      />
                      {fileNames.titlePageFile && (
                        <small className="text-muted d-block mt-1">
                          {fileNames.titlePageFile}
                        </small>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Content / Author Page</Form.Label>
                      <Form.Control
                        type="file"
                        name="contentPageFile"
                        onChange={handleFile}
                        className="form-control"
                      />
                      {fileNames.contentPageFile && (
                        <small className="text-muted d-block mt-1">
                          {fileNames.contentPageFile}
                        </small>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>First Page of Book Chapter</Form.Label>
                      <Form.Control
                        type="file"
                        name="firstPageFile"
                        onChange={handleFile}
                        className="form-control"
                      />
                      {fileNames.firstPageFile && (
                        <small className="text-muted d-block mt-1">
                          {fileNames.firstPageFile}
                        </small>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* ACTIONS */}
              <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                <Button 
                  variant="outlined" 
                  onClick={handleFormModalClose}
                  className="me-2"
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSave}
                >
                  {editMode ? "Update Publication" : "Save Publication"}
                </Button>
              </div>
            </Form>
          </div>
        </Box>
      </Modal>

      {/* VIEW MODAL */}
      <Modal 
        open={showViewModal} 
        onClose={handleViewModalClose}
        aria-labelledby="view-publication-modal"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '95%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflow: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 0
          }}
        >
          {selectedRecord && (
            <>
              {/* MODAL HEADER */}
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  <VisibilityIcon className="me-2" />
                  Publication Details
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={handleViewModalClose}
                ></button>
              </div>

              {/* MODAL BODY */}
              <div className="modal-body p-4">
                <div className="mb-4">
                  <h4 className="fw-bold text-primary mb-2">{selectedRecord.bookTitle}</h4>
                  <Badge 
                    bg={selectedRecord.publicationType === "Book" ? "primary" : "secondary"}
                    className="rounded-pill mb-3"
                  >
                    {selectedRecord.publicationType}
                  </Badge>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <h6 className="fw-semibold text-muted mb-2">Academic Year</h6>
                      <p className="fs-5">{selectedRecord.academicYear || "-"}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <h6 className="fw-semibold text-muted mb-2">Publication Year</h6>
                      <p className="fs-5">{selectedRecord.year || "-"}</p>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <h6 className="fw-semibold text-muted mb-2">Publisher</h6>
                      <p className="fs-5">{selectedRecord.publisher || "-"}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <h6 className="fw-semibold text-muted mb-2">Editor</h6>
                      <p className="fs-5">{selectedRecord.editor || "-"}</p>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <h6 className="fw-semibold text-muted mb-2">Indexed In</h6>
                      <p className="fs-5">
                        <Badge bg="info" className="rounded-pill">
                          {selectedRecord.indexedIn || "No Indexing"}
                        </Badge>
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <h6 className="fw-semibold text-muted mb-2">Scope</h6>
                      <p className="fs-5">
                        <Badge 
                          bg={selectedRecord.scope === "International" ? "success" : "warning"}
                          className="rounded-pill"
                        >
                          {selectedRecord.scope || "National"}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <h6 className="fw-semibold text-muted mb-2">Authorship Order</h6>
                      <p className="fs-5">{selectedRecord.authorshipOrder || "-"}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <h6 className="fw-semibold text-muted mb-2">ISBN</h6>
                      <p className="fs-5">{selectedRecord.isbn || "-"}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="fw-semibold text-muted mb-2">Co-Authors</h6>
                  <p className="fs-5">{selectedRecord.coAuthors || "-"}</p>
                </div>

                {selectedRecord.bookLink && (
                  <div className="mb-3">
                    <h6 className="fw-semibold text-muted mb-2">Book/Chapter Link</h6>
                    <a 
                      href={selectedRecord.bookLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      {selectedRecord.bookLink}
                    </a>
                  </div>
                )}

                {/* FILE DOWNLOADS */}
                <div className="mt-4 pt-3 border-top">
                  <h5 className="fw-bold mb-3">Supporting Documents</h5>
                  <div className="d-flex flex-wrap gap-3">
                    {selectedRecord.titlePageFile && (
                      <a
                        href={`https://service-book-backend.onrender.com/uploads/${selectedRecord.titlePageFile}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-primary d-flex align-items-center gap-2"
                      >
                        <FileDownloadIcon fontSize="small" />
                        Title Page
                      </a>
                    )}
                    {selectedRecord.contentPageFile && (
                      <a
                        href={`https://service-book-backend.onrender.com/uploads/${selectedRecord.contentPageFile}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-success d-flex align-items-center gap-2"
                      >
                        <FileDownloadIcon fontSize="small" />
                        Content Page
                      </a>
                    )}
                    {selectedRecord.firstPageFile && (
                      <a
                        href={`https://service-book-backend.onrender.com/uploads/${selectedRecord.firstPageFile}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-info d-flex align-items-center gap-2"
                      >
                        <FileDownloadIcon fontSize="small" />
                        First Page
                      </a>
                    )}
                    {!selectedRecord.titlePageFile && !selectedRecord.contentPageFile && !selectedRecord.firstPageFile && (
                      <p className="text-muted">No files uploaded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="modal-footer border-top">
                <Button 
                  variant="outlined" 
                  onClick={handleViewModalClose}
                  className="me-2"
                >
                  Close
                </Button>
                <Button 
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    handleViewModalClose();
                    handleEdit(selectedRecord);
                  }}
                >
                  Edit
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default BookAndBookChapterPublication;