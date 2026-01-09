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
    displayOrder: "", // ✅ DISPLAY ORDER
  });

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [editId, setEditId] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  // -------------------- Load email --------------------
  useEffect(() => {
    const gmail = localStorage.getItem("gmail") || localStorage.getItem("email");
    if (gmail) {
      setUserEmail(gmail.trim().toLowerCase());
    } else {
      toast.error("⚠️ No Gmail found — please log in again.");
    }
  }, []);

  // -------------------- Fetch Data --------------------
  const fetchData = async () => {
    if (!userEmail) return;
    try {
      const res = await axios.get(
        `https://service-book-backend.onrender.com/view?email=${userEmail}`
      );
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (err) {
      toast.error("❌ Failed to fetch data");
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

  // -------------------- Save / Update --------------------
  const handleSave = async () => {
    if (!formData.name || !formData.academicYear) {
      toast.warning("⚠️ Project Name and Academic Year are required!");
      return;
    }

    try {
      setLoading(true);
      const payload = { email: userEmail, ...formData };

      if (editId) {
        await axios.put(
          `https://service-book-backend.onrender.com/update/${editId}`,
          payload
        );
        toast.success("✅ Project updated successfully!");
        setEditId(null);
      } else {
        await axios.post(
          "https://service-book-backend.onrender.com/add",
          payload
        );
        toast.success("✅ Project added successfully!");
      }

      setFormData({
        name: "",
        academicYear: "",
        isFunded: "",
        fundedAgency: "",
        coInvestigator: "",
        level: "",
        displayOrder: "",
      });

      fetchData();
    } catch (err) {
      toast.error("❌ Server error");
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
      displayOrder: item.displayOrder || "",
    });
    setEditId(item._id);
    toast.info("✏️ Edit mode enabled");
  };

  // -------------------- Delete --------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await axios.delete(
        `https://service-book-backend.onrender.com/delete/${id}`
      );
      toast.success("🗑️ Deleted successfully");
      fetchData();
    } catch (err) {
      toast.error("❌ Delete failed");
    }
  };

  const handleBack = () => navigate("/consultancy");
  const handleNext = () => navigate("/SeminarsGuided");

  // -------------------- UI --------------------
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #E3F2FD, #BBDEFB)",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Container fluid="md">
        <Card className="shadow-lg p-4">
          <h4 className="text-center text-primary fw-bold mb-4">
            Project / Research Guided
          </h4>

          {/* FORM */}
          <Form>
            <Row className="gy-3">
              <Col md={12}>
                <Form.Label>Project / Research Name *</Form.Label>
                <Form.Control
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6}>
                <Form.Label>Academic Year *</Form.Label>
                <Form.Control
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  placeholder="2024-2025"
                />
              </Col>

              <Col md={6}>
                <Form.Label>Display Order</Form.Label>
                <Form.Control
                  type="number"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleChange}
                  placeholder="1, 2, 3..."
                  min="1"
                />
                <small className="text-muted">
                  Lower number appears first
                </small>
              </Col>

              <Col md={6}>
                <Form.Label>Is Funded</Form.Label>
                <Form.Select
                  name="isFunded"
                  value={formData.isFunded}
                  onChange={handleChange}
                >
                  <option value="">-- Select --</option>
                  <option>Yes</option>
                  <option>No</option>
                </Form.Select>
              </Col>

              <Col md={6}>
                <Form.Label>Funded Agency</Form.Label>
                <Form.Control
                  name="fundedAgency"
                  value={formData.fundedAgency}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6}>
                <Form.Label>Co-Investigator</Form.Label>
                <Form.Select
                  name="coInvestigator"
                  value={formData.coInvestigator}
                  onChange={handleChange}
                >
                  <option value="">-- Select --</option>
                  <option>Yes</option>
                  <option>No</option>
                </Form.Select>
              </Col>

              <Col md={6}>
                <Form.Label>Level</Form.Label>
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
              </Col>
            </Row>

            <div className="d-flex justify-content-between mt-4">
              <Button variant="outline-primary" onClick={handleBack}>
                ← Back
              </Button>

              <div>
                <Button
                  variant={editId ? "warning" : "primary"}
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner size="sm" />
                  ) : editId ? (
                    "Update"
                  ) : (
                    "Save"
                  )}
                </Button>

                <Button
                  variant="success"
                  className="ms-2"
                  onClick={handleNext}
                >
                  Next →
                </Button>
              </div>
            </div>
          </Form>

          {/* TABLE */}
          <hr className="my-4" />
          <h5 className="fw-bold text-primary">Saved Entries</h5>

          <div className="table-responsive">
            <Table bordered hover>
              <thead className="table-primary">
                <tr>
                  
                  <th>Order</th>
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
                {[...projects]
                  .sort(
                    (a, b) =>
                      (Number(a.displayOrder) || 9999) -
                      (Number(b.displayOrder) || 9999)
                  )
                  .map((p, i) => (
                    <tr key={p._id}>
                    
                      <td>{p.displayOrder || "-"}</td>
                      <td>{p.name}</td>
                      <td>{p.academicYear}</td>
                      <td>{p.isFunded}</td>
                      <td>{p.fundedAgency}</td>
                      <td>{p.coInvestigator}</td>
                      <td>{p.level}</td>
                      <td className="text-center">
                        <Button
                          size="sm"
                          variant="outline-warning"
                          className="me-2"
                          onClick={() => handleEdit(p)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(p._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </Card>
      </Container>
      <ToastContainer />
    </div>
  );
};

export default Projectguided;
