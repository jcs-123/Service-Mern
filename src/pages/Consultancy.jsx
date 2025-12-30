import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Table, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Consultancy = () => {
  const navigate = useNavigate();

  // -------------------- State --------------------
  const [formData, setFormData] = useState({
    title: "",
    organisedBy: "",
    academicYear: "",
    isFunded: "",
    fundAmount: "",
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  // -------------------- Load Email --------------------
  useEffect(() => {
    const gmail = localStorage.getItem("gmail") || localStorage.getItem("email");
    if (gmail) {
      setUserEmail(gmail.trim().toLowerCase());
    } else {
    }
  }, []);

  // -------------------- Fetch All --------------------
  const fetchData = async () => {
    if (!userEmail) return;
    try {
      const res = await axios.get(`https://service-book-backend.onrender.com/consultancy/${userEmail}`);
      if (res.data.success) {
        setProjects(res.data.data);
      } else {
        setProjects([]);
        toast.info("No consultancy records found.");
      }
    } catch (err) {
    }
  };
// ================= ACADEMIC YEAR OPTIONS =================
const generateAcademicYears = (startYear = 2001) => {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let y = startYear; y <= currentYear; y++) {
    years.push(`${y}-${y + 1}`);
  }

  return years.reverse(); // latest year first
};

const academicYearOptions = generateAcademicYears();

  useEffect(() => {
    fetchData();
  }, [userEmail]);

  // -------------------- Input Change --------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------- Add / Update --------------------
  const handleSave = async () => {
    const { title, organisedBy, academicYear } = formData;

    if (!title || !organisedBy || !academicYear) {
      toast.warning("⚠️ Please fill in required fields!");
      return;
    }

    if (!userEmail) {
      toast.error("⚠️ Email not found — please log in again.");
      return;
    }

    const payload = { email: userEmail, ...formData };

    try {
      setLoading(true);
      if (editId) {
        // Update existing
        const res = await axios.put(`https://service-book-backend.onrender.com/consultancy/${editId}`, payload);
        if (res.data.success) {
          toast.success("✅ Consultancy updated successfully!");
          setEditId(null);
          fetchData();
        } else toast.error(res.data.message);
      } else {
        // Add new
        const res = await axios.post("https://service-book-backend.onrender.com/consultancy", payload);
        if (res.data.success) {
          toast.success("✅ Consultancy added successfully!");
          fetchData();
        } else toast.error(res.data.message);
      }

      // Reset form
      setFormData({
        title: "",
        organisedBy: "",
        academicYear: "",
        isFunded: "",
        fundAmount: "",
      });
    } catch (err) {
      toast.error("❌ Server error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Edit --------------------
  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      organisedBy: item.organisedBy,
      academicYear: item.academicYear,
      isFunded: item.isFunded,
      fundAmount: item.fundAmount,
    });
    setEditId(item._id);
    toast.info("✏️ Edit mode enabled — update and click Save.");
  };

  // -------------------- Delete Confirmation --------------------
  const confirmDelete = (id) => {
    toast.info(
      <div className="text-center">
        <p className="fw-semibold mb-2">⚠️ Delete this consultancy record?</p>
        <div className="d-flex justify-content-center gap-2">
          <Button size="sm" variant="danger" onClick={() => handleDelete(id)}>
            Yes, Delete
          </Button>
          <Button size="sm" variant="secondary" onClick={() => toast.dismiss()}>
            Cancel
          </Button>
        </div>
      </div>,
      { position: "top-center", autoClose: false, toastId: "confirm-delete" }
    );
  };

  // -------------------- Delete --------------------
  const handleDelete = async (id) => {
    toast.dismiss("confirm-delete");
    try {
      const res = await axios.delete(`https://service-book-backend.onrender.com/consultancy/${id}`);
      if (res.data.success) {
        toast.success("🗑️ Deleted successfully!");
        fetchData();
      } else toast.error("Delete failed!");
    } catch (err) {
      toast.error("❌ Server error: " + err.message);
    }
  };

  // -------------------- Navigation --------------------
  const handleBack = () => navigate("/FacultyReserach");
  const handleNext = () => navigate("/ProjectGuided");

  // -------------------- UI --------------------
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #E3F2FD, #BBDEFB)",
        minHeight: "100vh",
        padding: "20px 10px",
      }}
    >
      <Container fluid="md" className="py-4">
        <Card
          className="shadow-lg mx-auto"
          style={{
            border: "2px solid #1565C0",
            borderRadius: "15px",
            maxWidth: "950px",
            background: "rgba(255,255,255,0.96)",
          }}
        >
          <Card.Body className="p-4 p-md-5">
            {/* Header */}
            <div className="text-center mb-4">
              <h3 style={{ color: "#0D47A1", fontWeight: 700, textTransform: "uppercase" }}>
                Consultancy Projects / Activities
              </h3>
              <hr
                style={{
                  width: "120px",
                  borderTop: "3px solid #1565C0",
                  margin: "10px auto 0",
                }}
              />
            </div>

            {/* Logged-in email */}
            <div className="text-end mb-3">
              <small className="text-secondary">
                Logged in as: <b>{userEmail || "Not logged in"}</b>
              </small>
            </div>

            {/* Form */}
            <Form>
              <Row className="gy-3">
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Title <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Consultancy on Structural Design"
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Organised By <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="organisedBy"
                      value={formData.organisedBy}
                      onChange={handleChange}
                      placeholder="e.g. Jyothi Engineering College"
                    />
                  </Form.Group>
                </Col>

             <Col xs={12} md={6}>
  <Form.Group className="w-100">
    <Form.Label className="fw-semibold">
      Academic Year <span className="text-danger">*</span>
    </Form.Label>

    <Form.Select
      name="academicYear"
      value={formData.academicYear}
      onChange={handleChange}
      className="w-100"
      size="lg"   // 👈 touch-friendly on mobile
      required
    >
      <option value="">-- Select Academic Year --</option>
      {academicYearOptions.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </Form.Select>
  </Form.Group>
</Col>


                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Is Funded</Form.Label>
                    <Form.Select
                      name="isFunded"
                      value={formData.isFunded}
                      onChange={handleChange}
                    >
                      <option value="">-- Select --</option>
                      <option>Yes</option>
                      <option>No</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Fund Amount (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      name="fundAmount"
                      value={formData.fundAmount}
                      onChange={handleChange}
                      placeholder="e.g. 50000"
                      min="0"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-4">
                <Col className="d-flex justify-content-between flex-wrap gap-2">
                  <Button variant="outline-primary" onClick={handleBack}>
                    ← Back
                  </Button>
                  <div className="d-flex gap-2">
                    <Button
                      variant={editId ? "warning" : "primary"}
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" /> Saving...
                        </>
                      ) : editId ? (
                        "Update"
                      ) : (
                        "Save"
                      )}
                    </Button>
                    <Button variant="success" onClick={handleNext}>
                      Next →
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>

            {/* Table */}
            <hr className="my-4" />
            <h5 className="text-primary fw-bold">Saved Entries</h5>
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="text-center bg-primary text-white">
                  <tr>
                    <th className="text-dark ">#</th>
                    <th className="text-dark ">Title</th>
                    <th className="text-dark ">Organised By</th>
                    <th className="text-dark ">Academic Year</th>
                    <th className="text-dark ">Funded</th>
                    <th className="text-dark ">Amount</th>
                    <th className="text-dark ">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    projects.map((p, i) => (
                      <tr key={p._id}>
                        <td>{i + 1}</td>
                        <td>{p.title}</td>
                        <td>{p.organisedBy}</td>
                        <td>{p.academicYear}</td>
                        <td>{p.isFunded}</td>
                        <td>{p.fundAmount}</td>
                       <td className="text-center">
  <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
    <Button
      size="sm"
      variant="outline-warning"
      onClick={() => handleEdit(p)}
    >
      Edit
    </Button>

    <Button
      size="sm"
      variant="outline-danger"
      onClick={() => confirmDelete(p._id)}
    >
      Delete
    </Button>
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
      </Container>

      <ToastContainer />
    </div>
  );
};

export default Consultancy;
