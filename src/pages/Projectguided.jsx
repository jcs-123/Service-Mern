import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Projectguided = () => {
  const navigate = useNavigate();

  // -------------------- State --------------------
  const [formData, setFormData] = useState({
    name: "",
    academicYear: "",
    isFunded: "",
    fundedAgency: "",
    coInvestigator: "",
    level: "",
  });
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [editId, setEditId] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  // -------------------- Load email from localStorage --------------------
  useEffect(() => {
    const gmail = localStorage.getItem("gmail") || localStorage.getItem("email");
    if (gmail) {
      setUserEmail(gmail.trim().toLowerCase());
    } else {
      toast.error("⚠️ No Gmail found — please log in again.");
    }
  }, []);

  // -------------------- Fetch All --------------------
  const fetchData = async () => {
    if (!userEmail) return;
    try {
      const res = await axios.get(`https://service-book-backend.onrender.com/view?email=${userEmail}`);
      if (res.data.success) {
        setProjects(res.data.data);
      } else {
      }
    } catch (err) {
    }
  };

  useEffect(() => {
    fetchData();
  }, [userEmail]);

  // -------------------- Input Handler --------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------- Add or Update --------------------
  const handleSave = async () => {
    if (!formData.name || !formData.academicYear) {
      toast.warning("⚠️ Please fill in all required fields!");
      return;
    }

    if (!userEmail) {
      toast.error("⚠️ Email not found — please log in again.");
      return;
    }

    try {
      setLoading(true);
      const payload = { email: userEmail, ...formData };

      if (editId) {
        const res = await axios.put(
          `https://service-book-backend.onrender.com/update/${editId}`,
          payload
        );
        if (res.data.success) {
          toast.success("✅ Project updated successfully!");
          setEditId(null);
          fetchData();
        } else {
          toast.error(res.data.message || "Update failed!");
        }
      } else {
        const res = await axios.post("https://service-book-backend.onrender.com/add", payload);
        if (res.data.success) {
          toast.success("✅ Project added successfully!");
          fetchData();
        } else {
          toast.error(res.data.message || "Add failed!");
        }
      }

      setFormData({
        name: "",
        academicYear: "",
        isFunded: "",
        fundedAgency: "",
        coInvestigator: "",
        level: "",
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
      name: item.name,
      academicYear: item.academicYear,
      isFunded: item.isFunded,
      fundedAgency: item.fundedAgency,
      coInvestigator: item.coInvestigator,
      level: item.level,
    });
    setEditId(item._id);
    toast.info("✏️ Edit mode enabled — make changes and click Update.");
  };

  // -------------------- Delete with Toast Confirmation --------------------
  const confirmDelete = (id) => {
    toast.info(
      <div className="text-center">
        <p className="fw-semibold mb-2">
          ⚠️ Are you sure you want to delete this record?
        </p>
        <div className="d-flex justify-content-center gap-2">
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(id)}
          >
            Yes, Delete
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </Button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        theme: "light",
        toastId: "confirm-delete",
      }
    );
  };

  // -------------------- Delete --------------------
  const handleDelete = async (id) => {
    toast.dismiss("confirm-delete");
    try {
      const res = await axios.delete(`https://service-book-backend.onrender.com/delete/${id}`);
      if (res.data.success) {
        toast.success("🗑️ Deleted successfully!");
        fetchData();
      } else {
        toast.error("Error deleting record");
      }
    } catch (err) {
      toast.error("❌ Server error: " + err.message);
    }
  };

  const handleBack = () => navigate("/consultancy");
  const handleNext = () => navigate("/SeminarsGuided");

  // -------------------- UI --------------------
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
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
              <h3
                style={{
                  color: "#0D47A1",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  fontSize: "clamp(1.2rem, 2vw, 1.8rem)",
                }}
              >
                Project / Research Guided
              </h3>
              <hr
                style={{
                  width: "120px",
                  borderTop: "3px solid #1565C0",
                  margin: "10px auto 0",
                }}
              />
            </div>

            {/* Show email */}
            <div className="text-end mb-3">
              <small className="text-secondary">
                Logged in as: <b>{userEmail || "Not logged in"}</b>
              </small>
            </div>

            {/* Form */}
            <Form>
              <Row className="gy-3">
                <Col xs={12}>
                  <Form.Group controlId="formName">
                    <Form.Label className="fw-semibold">
                      Project / Research Name{" "}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Smart Irrigation System"
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group controlId="formAcademicYear">
                    <Form.Label className="fw-semibold">
                      Academic Year <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="academicYear"
                      value={formData.academicYear}
                      onChange={handleChange}
                      placeholder="e.g. 2024-2025"
                    />
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
                    <Form.Label className="fw-semibold">Funded Agency</Form.Label>
                    <Form.Control
                      type="text"
                      name="fundedAgency"
                      value={formData.fundedAgency}
                      onChange={handleChange}
                      placeholder="e.g. AICTE / KTU / DST"
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Co-Investigator Available
                    </Form.Label>
                    <Form.Select
                      name="coInvestigator"
                      value={formData.coInvestigator}
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
                    <Form.Label className="fw-semibold">Level</Form.Label>
                    <Form.Select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                    >
                      <option value="">-- Select --</option>
                      <option>UG</option>
                      <option>PG</option>
                      <option>PhD</option>
                    </Form.Select>
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
                <thead>
                  <tr className="text-center bg-primary text-white">
                    <th>#</th>
                    <th>Project Name</th>
                    <th>Academic Year</th>
                    <th>Funded</th>
                    <th>Agency</th>
                    <th>Co-Investigator</th>
                    <th>Level</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    projects.map((p, i) => (
                      <tr key={p._id}>
                        <td>{i + 1}</td>
                        <td>{p.name}</td>
                        <td>{p.academicYear}</td>
                        <td>{p.isFunded}</td>
                        <td>{p.fundedAgency}</td>
                        <td>{p.coInvestigator}</td>
                        <td>{p.level}</td>
                        <td className="text-center">
                          <Button
                            variant="outline-warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(p)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => confirmDelete(p._id)}
                          >
                            Delete
                          </Button>
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

export default Projectguided;
