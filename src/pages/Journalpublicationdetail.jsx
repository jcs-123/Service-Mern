import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Modal,
  Form,
  Badge,
  Card,
  Toast,
  ToastContainer,
  Accordion,
} from "react-bootstrap";
import {
  Article as ArticleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  Description as DescriptionIcon,
  LibraryBooks as JournalIcon,
  Assessment as GraphIcon,
  Business as BuildingIcon,
  Link as LinkIcon,
  People as PeopleIcon,
  ChatBubbleOutline as ChatIcon,
  AttachFile as AttachIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CalendarToday as CalendarIcon,
  QuestionMark as QuestionIcon,
  Image as ImageIcon,
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Sort as SortIcon,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";

function JournalPublicationDetails() {
  const [showModal, setShowModal] = useState(false);
  const [records, setRecords] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [academicYears, setAcademicYears] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
const API_URL = "https://service-book-backend.onrender.com/journal-publication/api";
const [editId, setEditId] = useState(null);

  // Get user email from localStorage
  const userEmail = localStorage.getItem("email") || localStorage.getItem("gmail") || "user@example.com";

  /* ================= FORM STATE ================= */
const [formData, setFormData] = useState({
  academicYear: "",
  publicationStatus: "",
  year: "",
  month: "",
  authorshipOrder: "",
  journalIndexing: "",
  title: "",
  journalName: "",
  publisher: "",
  publicationId: "",
  doi: "",
  citations: "",
  volume: "",
  issue: "",
  impactFactor: "",
  quartile: "",
  pageNumbers: "",
  coAuthors: "",
  jecAffiliation: "",
  correspondingAuthor: "",
  fullPaper: null,
  indexProof: null,
  journalPaper: null,
  comments: "",

  // ✅ ADD THIS
  gmail: localStorage.getItem("email") || localStorage.getItem("gmail") || "",
});


  /* ================= RESPONSIVE HANDLING ================= */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setFilteredRecords(records);
  }, [records]);

  /* ================= INITIALIZE ACADEMIC YEARS ================= */
  useEffect(() => {
    generateAcademicYears();
  }, []);

  const generateAcademicYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 2001;
    const years = [];
    
    for (let year = currentYear; year >= startYear; year--) {
      years.push(`${year}-${year + 1}`);
    }
    
    setAcademicYears(years);
  };

  /* ================= HELPERS ================= */
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const journalIndexingOptions = ["SCI", "SCIE", "SCOPUS", "SSCI", "OTHER"];
  const quartileOptions = ["Q1", "Q2", "Q3", "Q4"];
  const yesNoOptions = ["Y", "N"];
  const publicationStatusOptions = ["Published", "Accepted"];

  /* ================= TOAST HANDLER ================= */
  const showToastMessage = (message, variant = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };
const fetchPublications = async () => {
  try {
    const gmail =
      localStorage.getItem("gmail") ||
      localStorage.getItem("email");

    if (!gmail) return;

    const res = await axios.get(
      `${API_URL}/gmail/${gmail}`
    );



    setRecords(res.data);
    setFilteredRecords(res.data);
  } catch (error) {
    console.error(error);
    showToastMessage("Failed to fetch publications", "danger");
  }
};
    useEffect(() => {
  fetchPublications();
}, []);
  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    });
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const gmail =
      localStorage.getItem("gmail") ||
      localStorage.getItem("email");

    if (!gmail) {
      showToastMessage("User not logged in", "danger");
      return;
    }

    const formDataObj = new FormData();

    // ✅ append NON-file fields (gmail excluded)
    Object.keys(formData).forEach((key) => {
      if (
        key !== "journalPaper" &&
        key !== "fullPaper" &&
        key !== "indexProof" &&
        key !== "gmail"
      ) {
        formDataObj.append(key, formData[key] ?? "");
      }
    });

    // ✅ append files ONLY if user selected new ones
    if (formData.journalPaper) {
      formDataObj.append("journalPaper", formData.journalPaper);
    }

    if (formData.fullPaper) {
      formDataObj.append("fullPaper", formData.fullPaper);
    }

    if (formData.indexProof) {
      formDataObj.append("indexProof", formData.indexProof);
    }

    /* ================= ADD ================= */
    if (!editId) {
      formDataObj.append("gmail", gmail);

      await axios.post(API_URL, formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToastMessage("Journal publication added successfully", "success");
    }

    /* ================= UPDATE ================= */
    else {
      await axios.put(`${API_URL}/${editId}`, formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToastMessage("Journal publication updated successfully", "success");
    }

    // refresh UI
    await fetchPublications();
    resetForm();
    setShowModal(false);

  } catch (error) {
    console.error("Submit error:", error);
    showToastMessage("Something went wrong", "danger");
  }
};





const handleEdit = (record) => {
  if (!record || !record._id) {
    showToastMessage("Record not found", "danger");
    return;
  }

  setEditId(record._id);

  setFormData({
    academicYear: record.academicYear || "",
    publicationStatus: record.publicationStatus || "",
    year: record.year || "",
    month: record.month || "",

    title: record.title || "",
    authorshipOrder: record.authorshipOrder || "",
    coAuthors: record.coAuthors || "",

    journalName: record.journalName || "",
    journalIndexing: record.journalIndexing || "",
    publisher: record.publisher || "",
    publicationId: record.publicationId || "",

    citations: record.citations || 0,
    volume: record.volume || "",
    issue: record.issue || "",
    impactFactor: record.impactFactor || "",
    quartile: record.quartile || "",
    pageNumbers: record.pageNumbers || "",

    jecAffiliation: record.jecAffiliation || "",
    correspondingAuthor: record.correspondingAuthor || "",
    doi: record.doi || "",
    comments: record.comments || "",

    // ⚠️ browser rule – MUST be null
    journalPaper: null,
    fullPaper: null,
    indexProof: null,
  });

  setShowModal(true);
};




const handleDelete = async (index) => {
  const record = records[index];

  if (!record?._id) {
    showToastMessage("Invalid record selected", "danger");
    return;
  }

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this publication?"
  );
  if (!confirmDelete) return;

  try {
    await axios.delete(`${API_URL}/${record._id}`);

    showToastMessage("Publication deleted successfully", "warning");

    // refresh data from DB
    fetchPublications();
  } catch (error) {
    console.error("Delete error:", error);
    showToastMessage("Failed to delete publication", "danger");
  }
};

const handleView = (index) => {
  setViewRecord({
    ...records[index],
    _rowIndex: index + 1, // ✅ ADD THIS
  });
  setShowViewModal(true);
};


  const resetForm = () => {
    setFormData({
      academicYear: "",
      publicationStatus: "",
      year: "",
      month: "",
      authorshipOrder: "",
      journalIndexing: "",
      title: "",
      journalName: "",
      publisher: "",
      publicationId: "",
      doi: "",
      citations: "",
      volume: "",
      issue: "",
      impactFactor: "",
      quartile: "",
      pageNumbers: "",
      coAuthors: "",
      jecAffiliation: "",
      correspondingAuthor: "",
      fullPaper: null,
      indexProof: null,
      journalPaper: null,
      comments: "",
    });
    setEditIndex(null);
  };

  // Helper function to format DOI/URL
  const formatDoiUrl = (doi) => {
    if (!doi) return null;
    if (doi.startsWith('http://') || doi.startsWith('https://')) {
      return doi;
    }
    if (doi.startsWith('doi.org/') || doi.startsWith('www.doi.org/')) {
      return `https://${doi}`;
    }
    if (doi.includes('doi.org')) {
      return `https://${doi}`;
    }
    return `https://doi.org/${doi}`;
  };

  // Helper function to simulate file download
const handleDownload = (filePath) => {
  if (!filePath) {
    showToastMessage("File not available", "warning");
    return;
  }

  const BASE_URL =
    localStorage.getItem("API_BASE_URL") ||
    "https://service-book-backend.onrender.com";

  // ✅ ALWAYS extract filename (critical fix)
  const fileName = filePath.replace(/^.*[\\/]/, "");

  const fileUrl = `${BASE_URL}/uploads/${fileName}`;

  window.open(fileUrl, "_blank");
};





  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term) {
      setFilteredRecords(records);
      return;
    }
    
  const filtered = records.filter(record =>
  record.title?.toLowerCase().includes(term) ||
  record.journalName?.toLowerCase().includes(term) ||
  record.academicYear?.toLowerCase().includes(term) ||
  record.publicationStatus?.toLowerCase().includes(term)
);

    setFilteredRecords(filtered);
  };

  /* ================= UI ================= */
  return (
    <Container fluid className="py-3 px-md-4 px-2">
      {/* ===== TOAST NOTIFICATION ===== */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={3000} 
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* ===== HEADER ===== */}
      <Row className="mb-4 align-items-center">
        <Col xs={12} md={8}>
          <h4 className="mb-1 d-flex align-items-center">
            <ArticleIcon className="me-2" />
            Journal Publication Details
          </h4>
          <small className="text-muted d-block">
            User: {userEmail.split('@')[0]} | Total Records: {records.length}
            {searchTerm && ` | Found: ${filteredRecords.length}`}
          </small>
        </Col>
        <Col xs={12} md={4} className="text-start text-md-end mt-2 mt-md-0">
          <Button 
            variant="primary" 
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            size="sm"
            className="w-100 w-md-auto"
          >
            <ArticleIcon className="me-2" />
            Add Publication
          </Button>
        </Col>
      </Row>

      {/* ===== SEARCH BAR ===== */}
      <Card className="shadow-sm mb-4">
        <Card.Body className="p-3">
          <div className="d-flex align-items-center">
            <SearchIcon className="me-2 text-muted" />
            <Form.Control
              type="text"
              placeholder="Search publications by title, journal, ID, or status..."
              value={searchTerm}
              onChange={handleSearch}
              className="border-0 shadow-none"
            />
            {searchTerm && (
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setFilteredRecords(records);
                }}
                className="text-decoration-none"
              >
                Clear
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* ===== RESPONSIVE DATA TABLE (DESKTOP) / CARDS (MOBILE) ===== */}
      {!isMobile ? (
        // Desktop View - Table
        <Card className="shadow-sm">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table bordered hover className="mb-0" responsive>
             <thead className="table-dark">
  <tr>
    <th width="120" className="text-center">Academic Year</th>
    <th width="100" className="text-center">Status</th>
    <th width="80" className="text-center">Year</th>
    <th width="90" className="text-center">Month</th>
    <th width="90" className="text-center">Auth Order</th>
    <th width="100" className="text-center">Indexing</th>
    <th width="200" className="text-center">Title of Paper</th>
    <th width="150" className="text-center">Journal Name</th>
    <th width="100" className="text-center">Actions</th>
  </tr>
</thead>

                <tbody>
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="text-center py-4 text-muted">
                        <ArticleIcon style={{ fontSize: 48, opacity: 0.3 }} />
                        <p className="mt-2 mb-0">No publications found</p>
                        <small>{searchTerm ? "Try different search terms" : 'Click "Add Publication" to add your first record'}</small>
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record, index) => (
                <tr key={record._id || index} className="align-middle">
  <td className="text-center">{record.academicYear}</td>

  <td className="text-center">
    <Badge
      bg={record.publicationStatus === "Published" ? "success" : "warning"}
      className="w-100"
    >
      {record.publicationStatus}
    </Badge>
  </td>

  <td className="text-center">{record.year || "-"}</td>

  <td className="text-center">{record.month || "-"}</td>

  <td className="text-center">{record.authorshipOrder || "-"}</td>

  <td className="text-center">
    <Badge bg="info" className="w-100">
      {record.journalIndexing || "-"}
    </Badge>
  </td>

  <td>
    <div
      className="text-truncate"
      style={{ maxWidth: "200px" }}
      title={record.title}
    >
      {record.title}
    </div>
  </td>

  <td>
    <div
      className="text-truncate"
      style={{ maxWidth: "150px" }}
      title={record.journalName}
    >
      {record.journalName}
    </div>
  </td>

  {/* ===== ACTIONS (IMPORTANT – KEPT) ===== */}
  <td className="text-center">
    <div className="d-flex justify-content-center gap-1 flex-wrap">
      <Tooltip title="View Details">
        <Button
          variant="outline-info"
          size="sm"
          onClick={() => handleView(index)}
          className="d-flex align-items-center"
        >
          <MoreVertIcon fontSize="small" className="me-1" />
          View
        </Button>
      </Tooltip>

      <Tooltip title="Edit">
        <IconButton
          size="small"
          color="warning"
     onClick={() => handleEdit(record)}

        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete">
        <IconButton
          size="small"
          color="error"
          onClick={() => handleDelete(index)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
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
      ) : (
        // Mobile View - Cards
        <div className="row g-3">
          {filteredRecords.length === 0 ? (
            <Col xs={12}>
              <Card className="shadow-sm text-center py-5">
                <Card.Body>
                  <ArticleIcon style={{ fontSize: 64, opacity: 0.3 }} className="mb-3" />
                  <h5 className="text-muted">No publications found</h5>
                  <p className="text-muted mb-0">
                    {searchTerm ? "Try different search terms" : 'Tap "Add Publication" to add your first record'}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ) : (
            filteredRecords.map((record, index) => (
              <Col xs={12} key={record.jecId || index}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <Badge bg="dark" className="mb-2">
                          {record.jecId}
                        </Badge>
                        <h6 className="mb-1 text-truncate" style={{ maxWidth: '250px' }} title={record.title}>
                          {record.title}
                        </h6>
                        <small className="text-muted">SL No: {record.slNo}</small>
                      </div>
                      <div className="dropdown">
                        <Button 
                          variant="link" 
                          className="text-dark p-0"
                          id={`dropdown-${record.jecId}`}
                        >
                          <MoreVertIcon />
                        </Button>
                      </div>
                    </div>
                    
                    <Row className="g-2 mb-3">
                      <Col xs={6}>
                        <small className="text-muted d-block">Academic Year</small>
                        <span className="fw-semibold">{record.academicYear}</span>
                      </Col>
                      <Col xs={6}>
                        <small className="text-muted d-block">Status</small>
                        <Badge bg={record.publicationStatus === "Published" ? "success" : "warning"}>
                          {record.publicationStatus}
                        </Badge>
                      </Col>
                      <Col xs={6}>
                        <small className="text-muted d-block">Year/Month</small>
                        <span>{record.year} {record.month ? `- ${record.month}` : ''}</span>
                      </Col>
                      <Col xs={6}>
                        <small className="text-muted d-block">Indexing</small>
                        <Badge bg="info">{record.journalIndexing}</Badge>
                      </Col>
                    </Row>
                    
                    <div className="mb-3">
                      <small className="text-muted d-block">Journal</small>
                      <span className="text-truncate d-block" style={{ maxWidth: '100%' }} title={record.journalName}>
                        {record.journalName}
                      </span>
                    </div>
                    
                    <div className="d-flex justify-content-between gap-2">
                      <Button 
                        variant="outline-info" 
                        size="sm" 
                        onClick={() => handleView(index)}
                        className="flex-fill"
                      >
                        <ViewIcon fontSize="small" className="me-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline-warning" 
                        size="sm" 
                        onClick={() => handleEdit(index)}
                        className="flex-fill"
                      >
                        <EditIcon fontSize="small" className="me-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => handleDelete(index)}
                        className="flex-fill"
                      >
                        <DeleteIcon fontSize="small" className="me-1" />
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </div>
      )}

      {/* ===== ADD/EDIT MODAL ===== */}
      <Modal
        show={showModal}
        onHide={() => { setShowModal(false); resetForm(); }}
        size="xl"
        centered
        scrollable
        backdrop="static"
        className="modal-dialog-centered modal-dialog-scrollable"
        style={{
          marginTop: isMobile ? '10px' : '40px',
          marginBottom: isMobile ? '10px' : '40px'
        }}
        contentClassName={isMobile ? "mx-1" : "mx-2 mx-md-3 mx-lg-4"}
      >
        <Modal.Header 
          closeButton 
          className="bg-primary text-white py-3"
          style={{ 
            borderTopLeftRadius: 'calc(0.3rem - 1px)', 
            borderTopRightRadius: 'calc(0.3rem - 1px)'
          }}
        >
          <Modal.Title className="d-flex align-items-center fs-5">
            <ArticleIcon className="me-2" />
            {editIndex !== null ? "Edit Publication" : "Add New Publication"}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body 
          className="p-0"
          style={{ 
            maxHeight: isMobile ? 'calc(100vh - 100px)' : 'calc(100vh - 200px)',
            overflowY: 'auto'
          }}
        >
          <div className={isMobile ? "p-2" : "p-3 p-md-4"}>
            <Form onSubmit={handleSubmit}>
              
              {/* Section 1: Basic Information */}
              <div className="card border-light shadow-sm mb-3 mb-md-4">
                <div className="card-header bg-light py-3">
                  <h6 className="mb-0 fw-semibold d-flex align-items-center">
                    <InfoIcon className="me-2" fontSize="small" />
                    Basic Information
                  </h6>
                </div>
                <div className="card-body p-3">
                  <Row className="g-2 g-md-3">
                    <Col xs={12} sm={6} md={6} lg={3}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-1">
                          Academic Year <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select 
                          name="academicYear" 
                          value={formData.academicYear} 
                          onChange={handleChange} 
                          required
                          className="form-control-sm"
                          size={isMobile ? "sm" : undefined}
                        >
                          <option value="">Select Academic Year</option>
                          {academicYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col xs={12} sm={6} md={6} lg={3}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-1">
                          Publication Status <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select 
                          name="publicationStatus" 
                          value={formData.publicationStatus} 
                          onChange={handleChange} 
                          required
                          className="form-control-sm"
                          size={isMobile ? "sm" : undefined}
                        >
                          <option value="">Select Status</option>
                          {publicationStatusOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col xs={12} sm={6} md={6} lg={3}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-1">Publication Year</Form.Label>
                        <Form.Control 
                          type="number" 
                          name="year" 
                          value={formData.year} 
                          onChange={handleChange} 
                     
                          max={new Date().getFullYear() + 1}
                          placeholder="e.g., 2024"
                          className="form-control-sm"
                          size={isMobile ? "sm" : undefined}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12} sm={6} md={6} lg={3}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-1">Month</Form.Label>
                        <Form.Select 
                          name="month" 
                          value={formData.month} 
                          onChange={handleChange}
                          className="form-control-sm"
                          size={isMobile ? "sm" : undefined}
                        >
                          <option value="">Select Month</option>
                          {months.map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Section 2: Paper Details */}
              <div className="card border-light shadow-sm mb-3 mb-md-4">
                <div className="card-header bg-light py-3">
                  <h6 className="mb-0 fw-semibold d-flex align-items-center">
                    <DescriptionIcon className="me-2" fontSize="small" />
                    Paper Details
                  </h6>
                </div>
                <div className="card-body p-3">
                  <Row className="g-2 g-md-3">
                    <Col xs={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-1">
                          Title of Paper <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={3} 
                          name="title" 
                          value={formData.title} 
                          onChange={handleChange} 
                          required 
                          placeholder="Enter the complete title of the paper"
                          className="form-control-sm"
                          size={isMobile ? "sm" : undefined}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-1">
                          Authorship Order
                        </Form.Label>
                      <Form.Control
  type="text"
  name="authorshipOrder"
  value={formData.authorshipOrder}
  onChange={handleChange}
  placeholder="Eg: 1 "
  className="form-control-sm"
  size={isMobile ? "sm" : undefined}
/>

                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-1">Co-authors</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={3} 
                          name="coAuthors" 
                          value={formData.coAuthors} 
                          onChange={handleChange} 
                          placeholder="Separate co-authors with commas"
                          className="form-control-sm"
                          size={isMobile ? "sm" : undefined}
                        />
                        <div className="form-text text-muted small mt-1 d-flex align-items-center">
                          <InfoIcon fontSize="small" className="me-1" />
                          List all co-authors with their affiliations
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Section 3: Journal Information */}
              <div className="card border-light shadow-sm mb-3 mb-md-4">
                <div className="card-header bg-light py-3">
                  <h6 className="mb-0 fw-semibold d-flex align-items-center">
                    <JournalIcon className="me-2" fontSize="small" />
                    Journal Information
                  </h6>
                </div>
                <div className="card-body p-3">
                  <Row className="g-2 g-md-3">
                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-1">
                          Journal Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control 
                          name="journalName" 
                          value={formData.journalName} 
                          onChange={handleChange} 
                          required
                          placeholder="Name of the journal"
                          className="form-control-sm"
                          size={isMobile ? "sm" : undefined}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-1">
                          Journal Indexing <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select 
                          name="journalIndexing" 
                          value={formData.journalIndexing} 
                          onChange={handleChange} 
                          required
                          className="form-control-sm"
                          size={isMobile ? "sm" : undefined}
                        >
                          <option value="">Select Indexing</option>
                          {journalIndexingOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-1">Publisher</Form.Label>
                        <Form.Control 
                          name="publisher" 
                          value={formData.publisher} 
                          onChange={handleChange} 
                          placeholder="Journal publisher"
                          className="form-control-sm"
                          size={isMobile ? "sm" : undefined}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-1">Publication ID</Form.Label>
                        <Form.Control 
                          name="publicationId" 
                          value={formData.publicationId} 
                          onChange={handleChange} 
                          placeholder="Article ID, Accession number, etc."
                          className="form-control-sm"
                          size={isMobile ? "sm" : undefined}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Section 4: Publication Metrics */}
              <div className="card border-light shadow-sm mb-3 mb-md-4">
                <div className="card-header bg-light py-3">
                  <h6 className="mb-0 fw-semibold d-flex align-items-center">
                    <GraphIcon className="me-2" fontSize="small" />
                    Publication Metrics
                  </h6>
                </div>
                <div className="card-body p-3">
                  <Row className="g-2 g-md-3">
                    <Col xs={6} sm={4} md={4} lg={2}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-1">Citations</Form.Label>
                        <Form.Control 
                          type="number" 
                          name="citations" 
                          value={formData.citations} 
                          onChange={handleChange} 
                          min="0"
                          placeholder="0"
                          className="form-control-sm text-center"
                          size={isMobile ? "sm" : undefined}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={6} sm={4} md={4} lg={2}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-1">Volume</Form.Label>
                        <Form.Control 
                          name="volume" 
                          value={formData.volume} 
                          onChange={handleChange} 
                          placeholder="Vol. No"
                          className="form-control-sm"
                          size={isMobile ? "sm" : undefined}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={6} sm={4} md={4} lg={2}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-1">Issue</Form.Label>
                        <Form.Control 
                          name="issue" 
                          value={formData.issue} 
                          onChange={handleChange} 
                          placeholder="Issue No"
                          className="form-control-sm"
                          size={isMobile ? "sm" : undefined}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={6} sm={4} md={4} lg={2}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-1">Impact Factor</Form.Label>
                        <Form.Control 
                          type="number" 
                          step="0.01" 
                          name="impactFactor" 
                          value={formData.impactFactor} 
                          onChange={handleChange} 
                          placeholder="0.00"
                          className="form-control-sm"
                          size={isMobile ? "sm" : undefined}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={6} sm={4} md={4} lg={2}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-1">Quartile</Form.Label>
                        <Form.Select 
                          name="quartile" 
                          value={formData.quartile} 
                          onChange={handleChange}
                          className="form-control-sm"
                          size={isMobile ? "sm" : undefined}
                        >
                          <option value="">Select Quartile</option>
                          {quartileOptions.map(q => (
                            <option key={q} value={q}>{q}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col xs={6} sm={4} md={4} lg={2}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-1">Page Numbers</Form.Label>
                        <Form.Control 
                          name="pageNumbers" 
                          value={formData.pageNumbers} 
                          onChange={handleChange} 
                          placeholder="e.g., 45-52"
                          className="form-control-sm"
                          size={isMobile ? "sm" : undefined}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Section 5: Affiliation & Identification */}
              <div className="card border-light shadow-sm mb-3 mb-md-4">
                <div className="card-header bg-light py-3">
                  <h6 className="mb-0 fw-semibold d-flex align-items-center">
                    <BuildingIcon className="me-2" fontSize="small" />
                    Affiliation & Identification
                  </h6>
                </div>
                <div className="card-body p-3">
                  <Row className="g-2 g-md-3">
                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-1">
                          JEC Affiliation <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select 
                          name="jecAffiliation" 
                          value={formData.jecAffiliation} 
                          onChange={handleChange}
                          required
                          className="form-control-sm"
                          size={isMobile ? "sm" : undefined}
                        >
                          <option value="">Select</option>
                          {yesNoOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </Form.Select>
                        <div className="form-text text-muted small mt-1 d-flex align-items-center">
                          <QuestionIcon fontSize="small" className="me-1" />
                          Is your affiliation with JEC mentioned?
                        </div>
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-1">
                          Corresponding Author <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select 
                          name="correspondingAuthor" 
                          value={formData.correspondingAuthor} 
                          onChange={handleChange}
                          required
                          className="form-control-sm"
                          size={isMobile ? "sm" : undefined}
                        >
                          <option value="">Select</option>
                          {yesNoOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </Form.Select>
                        <div className="form-text text-muted small mt-1 d-flex align-items-center">
                          <QuestionIcon fontSize="small" className="me-1" />
                          Are you the corresponding author?
                        </div>
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-1">DOI / Web Address</Form.Label>
                        <Form.Control 
                          name="doi" 
                          value={formData.doi} 
                          onChange={handleChange} 
                          placeholder="https://doi.org/..."
                          className="form-control-sm"
                          size={isMobile ? "sm" : undefined}
                        />
                        <div className="form-text text-muted small mt-1 d-flex align-items-center">
                          <LinkIcon fontSize="small" className="me-1" />
                          Enter full URL including https://
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </div>

           {/* ================= Section 6: File Uploads ================= */}
<div className="card border-light shadow-sm mb-3 mb-md-4">
  <div className="card-header bg-light py-3">
    <h6 className="mb-0 fw-semibold d-flex align-items-center">
      <AttachIcon className="me-2" fontSize="small" />
      File Uploads
    </h6>
  </div>

  <div className="card-body p-3">
    <Row className="g-2 g-md-3">

      {/* ===== Journal Paper ===== */}
      <Col xs={12} md={4}>
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold mb-1">
            Journal Paper (PDF)
          </Form.Label>

          <Form.Control
            type="file"
            name="journalPaper"
            onChange={handleChange}
            accept=".pdf,.doc,.docx"
            className="form-control-sm"
            size={isMobile ? "sm" : undefined}
          />

          <div className="form-text text-muted small mt-1 d-flex align-items-center">
            <FileIcon fontSize="small" className="me-1" />
            Published paper (Max: 10MB)
          </div>

          {/* ✅ SHOW EXISTING FILE IN EDIT MODE */}
          {editId &&
            records.find(r => r._id === editId)?.journalPaper && (
              <div className="mt-1">
                <small className="text-muted">Current file:</small>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 ms-1"
                  onClick={() =>
                    handleDownload(
                      records.find(r => r._id === editId).journalPaper
                    )
                  }
                >
                  View / Download
                </Button>
                <div className="small text-muted">
                  Select a new file to replace
                </div>
              </div>
            )}
        </Form.Group>
      </Col>

      {/* ===== Full Paper ===== */}
      <Col xs={12} md={4}>
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold mb-1">
            Full Paper (PDF)
          </Form.Label>

          <Form.Control
            type="file"
            name="fullPaper"
            onChange={handleChange}
            accept=".pdf,.doc,.docx"
            className="form-control-sm"
            size={isMobile ? "sm" : undefined}
          />

          <div className="form-text text-muted small mt-1 d-flex align-items-center">
            <FileIcon fontSize="small" className="me-1" />
            Manuscript draft (Max: 10MB)
          </div>

          {editId &&
            records.find(r => r._id === editId)?.fullPaper && (
              <div className="mt-1">
                <small className="text-muted">Current file:</small>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 ms-1"
                  onClick={() =>
                    handleDownload(
                      records.find(r => r._id === editId).fullPaper
                    )
                  }
                >
                  View / Download
                </Button>
                <div className="small text-muted">
                  Select a new file to replace
                </div>
              </div>
            )}
        </Form.Group>
      </Col>

      {/* ===== Index Proof ===== */}
      <Col xs={12} md={4}>
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold mb-1">
            Index Proof (PDF / Image)
          </Form.Label>

          <Form.Control
            type="file"
            name="indexProof"
            onChange={handleChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="form-control-sm"
            size={isMobile ? "sm" : undefined}
          />

          <div className="form-text text-muted small mt-1 d-flex align-items-center">
            <ImageIcon fontSize="small" className="me-1" />
            Indexing / acceptance proof (Max: 5MB)
          </div>

          {editId &&
            records.find(r => r._id === editId)?.indexProof && (
              <div className="mt-1">
                <small className="text-muted">Current file:</small>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 ms-1"
                  onClick={() =>
                    handleDownload(
                      records.find(r => r._id === editId).indexProof
                    )
                  }
                >
                  View / Download
                </Button>
                <div className="small text-muted">
                  Select a new file to replace
                </div>
              </div>
            )}
        </Form.Group>
      </Col>

    </Row>
  </div>
</div>


              {/* Section 7: Comments */}
              <div className="card border-light shadow-sm mb-3 mb-md-4">
                <div className="card-header bg-light py-3">
                  <h6 className="mb-0 fw-semibold d-flex align-items-center">
                    <ChatIcon className="me-2" fontSize="small" />
                    Additional Information
                  </h6>
                </div>
                <div className="card-body p-3">
                  <Row className="g-2 g-md-3">
                    <Col xs={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-1">Comments / Remarks</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={3} 
                          name="comments" 
                          value={formData.comments} 
                          onChange={handleChange} 
                          placeholder="Any additional comments, remarks, or special notes about this publication"
                          className="form-control-sm"
                          size={isMobile ? "sm" : undefined}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Form Actions */}
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-3 mt-md-4 pt-3 border-top">
                <div className="mb-2 mb-sm-0">
                  <small className="text-muted d-flex align-items-center">
                    <span className="text-danger me-1">*</span>
                    indicates required field
                  </small>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="px-4 py-2 d-flex align-items-center"
                    size="sm"
                  >
                    <CancelIcon className="me-2" fontSize="small" />
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary"
                    className="px-4 py-2 d-flex align-items-center"
                    size="sm"
                  >
                    <SaveIcon className="me-2" fontSize="small" />
                    {editIndex !== null ? "Update Publication" : "Save Publication"}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </Modal.Body>
        
        <Modal.Footer className="border-top py-3">
          <Button 
            variant="outline-secondary" 
            onClick={() => { setShowModal(false); resetForm(); }}
            className="px-4"
            size="sm"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ===== VIEW MODAL (SHOWS ALL FIELDS) ===== */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
        centered
        scrollable
        backdrop="static"
        className="modal-dialog-centered modal-dialog-scrollable"
        style={{
          marginTop: isMobile ? '10px' : '30px',
          marginBottom: isMobile ? '10px' : '30px'
        }}
        contentClassName={isMobile ? "mx-1" : "mx-2 mx-md-3"}
      >
        <Modal.Header 
          closeButton 
          className="bg-info text-white py-3"
          style={{ 
            borderTopLeftRadius: 'calc(0.3rem - 1px)', 
            borderTopRightRadius: 'calc(0.3rem - 1px)',
            borderBottom: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <Modal.Title className="d-flex align-items-center fs-6">
            <ArticleIcon className="me-2" />
            <div className="text-truncate">
              Publication Details - {viewRecord?.jecId}
            </div>
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body 
          className="p-0"
          style={{ 
            maxHeight: isMobile ? 'calc(100vh - 100px)' : 'calc(100vh - 160px)',
            overflowY: 'auto'
          }}
        >
          {viewRecord && (
            <div className={isMobile ? "p-2" : "p-3 p-md-4"}>
              {/* Header Section */}
              <div className="mb-3 pb-3 border-bottom">
                <h6 className="mb-2 fw-bold text-primary text-truncate">{viewRecord.title}</h6>
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <Badge 
                    bg={viewRecord.publicationStatus === "Published" ? "success" : "warning"}
                    className="px-2 py-1"
                  >
                    {viewRecord.publicationStatus}
                  </Badge>
                  <span className="text-muted small d-flex align-items-center">
                    <CalendarIcon fontSize="small" className="me-1" />
                    {viewRecord.year || 'N/A'}
                    {viewRecord.month ? ` - ${viewRecord.month}` : ''}
                  </span>
                  <Badge bg="info" className="px-2 py-1">
                    {viewRecord.journalIndexing}
                  </Badge>
                </div>
              </div>

              {/* Publication Information Cards - Mobile Stacked */}
              <Row className="g-2 mb-3">
                <Col xs={12}>
                  <div className="card border-light shadow-sm mb-2">
                    <div className="card-header bg-light py-2">
                      <h6 className="mb-0 fw-semibold d-flex align-items-center fs-6">
                        <InfoIcon fontSize="small" className="me-2" />
                        Basic Information
                      </h6>
                    </div>
                    <div className="card-body p-2">
                      <Row className="g-2">
                        <Col xs={6}>
                          <small className="text-muted d-block">SL No</small>
<div className="fw-bold">{viewRecord._rowIndex}</div>
                        </Col>
                        <Col xs={6}>
                          <small className="text-muted d-block">Academic Year</small>
                          <div className="fw-bold">{viewRecord.academicYear}</div>
                        </Col>
                        <Col xs={12}>
                          <small className="text-muted d-block">Authorship Order</small>
                          <div>{viewRecord.authorshipOrder || "N/A"}</div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>

                <Col xs={12}>
                  <div className="card border-light shadow-sm mb-2">
                    <div className="card-header bg-light py-2">
                      <h6 className="mb-0 fw-semibold d-flex align-items-center fs-6">
                        <JournalIcon fontSize="small" className="me-2" />
                        Journal Information
                      </h6>
                    </div>
                    <div className="card-body p-2">
                      <small className="text-muted d-block">Journal Name</small>
                      <div className="fw-semibold mb-2">{viewRecord.journalName}</div>
                      
                      <Row className="g-2">
                        <Col xs={6}>
                          <small className="text-muted d-block">Publisher</small>
                          <div>{viewRecord.publisher || "N/A"}</div>
                        </Col>
                        <Col xs={6}>
                          <small className="text-muted d-block">Publication ID</small>
                          <div className="text-truncate">{viewRecord.publicationId || "N/A"}</div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>

                <Col xs={12}>
                  <div className="card border-light shadow-sm mb-2">
                    <div className="card-header bg-light py-2">
                      <h6 className="mb-0 fw-semibold d-flex align-items-center fs-6">
                        <GraphIcon fontSize="small" className="me-2" />
                        Metrics
                      </h6>
                    </div>
                    <div className="card-body p-2">
                      <Row className="g-2">
                        <Col xs={6}>
                          <small className="text-muted d-block">Citations</small>
                          <div className="fw-bold fs-6 text-primary">{viewRecord.citations || "0"}</div>
                        </Col>
                        <Col xs={6}>
                          <small className="text-muted d-block">Impact Factor</small>
                          <div className="fw-bold">{viewRecord.impactFactor || "N/A"}</div>
                        </Col>
                        <Col xs={6}>
                          <small className="text-muted d-block">Quartile</small>
                          <div>
                            {viewRecord.quartile ? (
                              <Badge 
                                bg={
                                  viewRecord.quartile === "Q1" ? "danger" :
                                  viewRecord.quartile === "Q2" ? "warning" :
                                  viewRecord.quartile === "Q3" ? "primary" : "secondary"
                                }
                                className="px-2 py-1"
                              >
                                {viewRecord.quartile}
                              </Badge>
                            ) : "N/A"}
                          </div>
                        </Col>
                        <Col xs={6}>
                          <small className="text-muted d-block">Volume/Issue</small>
                          <div>
                            {viewRecord.volume ? `Vol. ${viewRecord.volume}` : "N/A"}
                            {viewRecord.issue ? `, Issue ${viewRecord.issue}` : ""}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Affiliation Section */}
              <div className="card border-light shadow-sm mb-3">
                <div className="card-header bg-light py-2">
                  <h6 className="mb-0 fw-semibold d-flex align-items-center fs-6">
                    <BuildingIcon fontSize="small" className="me-2" />
                    Affiliation & Authorship
                  </h6>
                </div>
                <div className="card-body p-2">
                  <Row className="g-2">
                    <Col xs={6}>
                      <small className="text-muted d-block">JEC Affiliation</small>
                      <div>
                        <Badge 
                          bg={viewRecord.jecAffiliation === "Y" ? "success" : "secondary"}
                          className="px-2 py-1"
                        >
                          {viewRecord.jecAffiliation === "Y" ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <small className="text-muted d-block">Corresponding Author</small>
                      <div>
                        <Badge 
                          bg={viewRecord.correspondingAuthor === "Y" ? "success" : "secondary"}
                          className="px-2 py-1"
                        >
                          {viewRecord.correspondingAuthor === "Y" ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </Col>
                    <Col xs={12}>
                      <small className="text-muted d-block">Page Numbers</small>
                      <div>{viewRecord.pageNumbers || "N/A"}</div>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* DOI Section */}
              <div className="card border-light shadow-sm mb-3">
                <div className="card-header bg-light py-2">
                  <h6 className="mb-0 fw-semibold d-flex align-items-center fs-6">
                    <LinkIcon fontSize="small" className="me-2" />
                    DOI / URL
                  </h6>
                </div>
                <div className="card-body p-2">
                  {viewRecord.doi ? (
                    <div className="d-flex align-items-center">
                      <LinkIcon className="text-primary me-2" fontSize="small" />
                      <a 
                        href={formatDoiUrl(viewRecord.doi)}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-truncate text-decoration-none text-primary fw-semibold"
                        style={{ maxWidth: 'calc(100% - 60px)' }}
                      >
                        {viewRecord.doi}
                      </a>
                    </div>
                  ) : (
                    <span className="text-muted d-flex align-items-center">
                      <LinkIcon fontSize="small" className="me-2" />
                      N/A
                    </span>
                  )}
                </div>
              </div>

              {/* Co-authors Section */}
              <div className="card border-light shadow-sm mb-3">
                <div className="card-header bg-light py-2">
                  <h6 className="mb-0 fw-semibold d-flex align-items-center fs-6">
                    <PeopleIcon fontSize="small" className="me-2" />
                    Co-authors
                  </h6>
                </div>
                <div className="card-body p-2">
                  <div className="bg-light rounded p-2" style={{ minHeight: '50px' }}>
                    {viewRecord.coAuthors ? (
                      <div className="text-wrap small">{viewRecord.coAuthors}</div>
                    ) : (
                      <div className="text-muted text-center py-2 d-flex flex-column align-items-center">
                        <PeopleIcon fontSize="small" className="mb-1" style={{ opacity: 0.5 }} />
                        <small>No co-authors listed</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="card border-light shadow-sm mb-3">
                <div className="card-header bg-light py-2">
                  <h6 className="mb-0 fw-semibold d-flex align-items-center fs-6">
                    <ChatIcon fontSize="small" className="me-2" />
                    Comments / Remarks
                  </h6>
                </div>
                <div className="card-body p-2">
                  <div className="bg-light rounded p-2" style={{ minHeight: '50px' }}>
                    {viewRecord.comments ? (
                      <div className="text-wrap small">{viewRecord.comments}</div>
                    ) : (
                      <div className="text-muted text-center py-2 d-flex flex-column align-items-center">
                        <ChatIcon fontSize="small" className="mb-1" style={{ opacity: 0.5 }} />
                        <small>No comments</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Attachments Section */}
              <div className="card border-light shadow-sm">
                <div className="card-header bg-light py-2">
                  <h6 className="mb-0 fw-semibold d-flex align-items-center fs-6">
                    <AttachIcon fontSize="small" className="me-2" />
                    Attachments
                  </h6>
                </div>
                <div className="card-body p-2">
                  <div className="d-flex flex-wrap gap-1">
                    {viewRecord.journalPaper && (
                      <Button 
                        variant="outline-primary" 
                        className="d-flex align-items-center px-2 py-1"
                        onClick={() => handleDownload(viewRecord.journalPaper, 'Journal_Paper.pdf')}
                        size="sm"
                      >
                        <DownloadIcon className="me-1" fontSize="small" />
                        <span className="d-none d-sm-inline">Journal Paper</span>
                        <span className="d-inline d-sm-none">Paper</span>
                      </Button>
                    )}
                    {viewRecord.fullPaper && (
                      <Button 
                        variant="outline-secondary" 
                        className="d-flex align-items-center px-2 py-1"
                        onClick={() => handleDownload(viewRecord.fullPaper, 'Full_Paper.pdf')}
                        size="sm"
                      >
                        <DownloadIcon className="me-1" fontSize="small" />
                        <span className="d-none d-sm-inline">Full Paper</span>
                        <span className="d-inline d-sm-none">Full</span>
                      </Button>
                    )}
                    {viewRecord.indexProof && (
                      <Button 
                        variant="outline-info" 
                        className="d-flex align-items-center px-2 py-1"
                        onClick={() => handleDownload(viewRecord.indexProof, 'Index_Proof.pdf')}
                        size="sm"
                      >
                        <DownloadIcon className="me-1" fontSize="small" />
                        <span className="d-none d-sm-inline">Index Proof</span>
                        <span className="d-inline d-sm-none">Proof</span>
                      </Button>
                    )}
                    {!viewRecord.journalPaper && !viewRecord.fullPaper && !viewRecord.indexProof && (
                      <div className="text-muted text-center w-100 py-2 d-flex flex-column align-items-center">
                        <FolderIcon fontSize="small" className="mb-1" style={{ opacity: 0.5 }} />
                        <small>No attachments</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        
        <Modal.Footer className="border-top py-2">
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowViewModal(false)}
            className="px-3 d-flex align-items-center"
            size="sm"
          >
            <CancelIcon className="me-1" fontSize="small" />
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default JournalPublicationDetails;