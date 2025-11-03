import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FacultyResearch = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [researchList, setResearchList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTrigger, setDeleteTrigger] = useState(false); // 👈 used to auto-refresh after delete

  const [formData, setFormData] = useState({
    title: "",
    isCollaborative: "",
    collaborator: "",
    academicYear: "",
    isFunded: "",
    status: "",
    fundAmount: "",
  });

  /* ======================================================
     🧠 LOAD EMAIL FROM LOCALSTORAGE
  ====================================================== */
  useEffect(() => {
    const gmail = localStorage.getItem("gmail");
    if (gmail) {
      setUserEmail(gmail.trim().toLowerCase());
    } else {
      toast.error("⚠️ No Gmail found — please log in again.");
    }
  }, []);

  /* ======================================================
     📥 FETCH ALL RESEARCH DATA FOR LOGGED-IN USER
  ====================================================== */
  const fetchResearch = async () => {
    if (!userEmail) return;
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:4000/faculty-research/${userEmail}`);
      setResearchList(res.data.data || []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 👇 Auto-refresh whenever email changes or deleteTrigger flips
  useEffect(() => {
    if (userEmail) fetchResearch();
  }, [userEmail, deleteTrigger]);

  /* ======================================================
     🔄 HANDLE INPUT CHANGES
  ====================================================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ======================================================
     💾 SAVE / UPDATE FACULTY RESEARCH
  ====================================================== */
  const handleSave = async () => {
    if (!userEmail) {
      toast.error("User Gmail not found ❌");
      return;
    }

    try {
      const data = { ...formData, email: userEmail };

      if (editItem) {
        await axios.put(`http://localhost:4000/faculty-research/${editItem._id}`, data);
        toast.success("✅ Faculty Research updated successfully!");
      } else {
        await axios.post("http://localhost:4000/faculty-research", data);
        toast.success("✅ Faculty Research added successfully!");
      }

      setFormData({
        title: "",
        isCollaborative: "",
        collaborator: "",
        academicYear: "",
        isFunded: "",
        status: "",
        fundAmount: "",
      });
      setEditItem(null);
      fetchResearch();
    } catch (err) {
      console.error("❌ Save error:", err);
      toast.error("Failed to save Faculty Research ❌");
    }
  };

  /* ======================================================
     🗑️ DELETE RESEARCH (with toast confirmation)
  ====================================================== */
  const handleDelete = (id) => {
    toast.info(
      <div>
        <p style={{ marginBottom: "6px" }}>Are you sure you want to delete this record?</p>
        <div className="d-flex justify-content-end gap-2">
          <Button
            variant="danger"
            size="sm"
            onClick={async () => {
              try {
                await axios.delete(`http://localhost:4000/faculty-research/${id}`);
                toast.dismiss();
                toast.success("🗑️ Record deleted successfully!");
                setDeleteTrigger((prev) => !prev); // 👈 trigger refresh automatically
              } catch (err) {
                console.error("❌ Delete error:", err);
                toast.error("Failed to delete Faculty Research ❌");
              }
            }}
          >
            Yes, Delete
          </Button>
          <Button variant="secondary" size="sm" onClick={() => toast.dismiss()}>
            Cancel
          </Button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  /* ======================================================
     ✏️ EDIT RECORD
  ====================================================== */
  const handleEdit = (item) => {
    setEditItem(item);
    setFormData({
      title: item.title,
      isCollaborative: item.isCollaborative,
      collaborator: item.collaborator,
      academicYear: item.academicYear,
      isFunded: item.isFunded,
      status: item.status,
      fundAmount: item.fundAmount,
    });
  };

  /* ======================================================
     🔙 NAVIGATION
  ====================================================== */
  const handleBack = () => navigate("/ProgramsAttended");
  const handleNext = () => navigate("/Consultancy");

  /* ======================================================
     🎨 UI
  ====================================================== */
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
        minHeight: "100vh",
        padding: "20px 10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <ToastContainer position="top-right" autoClose={2000} />

      <Container fluid="md" className="py-4">
        <Card
          className="shadow-lg mx-auto"
          style={{
            border: "2px solid #1565C0",
            borderRadius: "15px",
            maxWidth: "950px",
            background: "rgba(255, 255, 255, 0.96)",
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
                Faculty Research Projects / Activities
              </h3>
              <hr
                style={{
                  width: "120px",
                  borderTop: "3px solid #1565C0",
                  margin: "10px auto 0",
                }}
              />
            </div>

            {/* Form Section */}
            <Form>
              <Row className="gy-3">
                {/* Project Title */}
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Project Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Water Quality Monitoring"
                    />
                  </Form.Group>
                </Col>

                {/* Collaborative / Collaborator */}
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Is Collaborative</Form.Label>
                    <Form.Select
                      name="isCollaborative"
                      value={formData.isCollaborative}
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
                    <Form.Label className="fw-semibold">Collaborator(s)</Form.Label>
                    <Form.Control
                      type="text"
                      name="collaborator"
                      value={formData.collaborator}
                      onChange={handleChange}
                      placeholder="e.g. IIT Madras / CWRE"
                    />
                  </Form.Group>
                </Col>

                {/* Academic Year / Is Funded */}
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Academic Year</Form.Label>
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

                {/* Status / Fund Amount */}
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="">-- Select --</option>
                      <option>Ongoing</option>
                      <option>Completed</option>
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
                      placeholder="e.g. 250000"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Action Buttons */}
              <div className="d-flex justify-content-end mt-4 gap-2 flex-wrap">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  style={{
                    background: "linear-gradient(135deg, #1976D2, #1565C0)",
                    border: "2px solid #0D47A1",
                    fontWeight: 600,
                  }}
                >
                  {editItem ? "Update" : "Save"}
                </Button>
              </div>
            </Form>

            {/* Records Table */}
            <div className="mt-5">
              <h5 className="fw-bold text-primary mb-3">Saved Records</h5>
              {loading ? (
                <p>Loading...</p>
              ) : researchList.length === 0 ? (
                <p>No faculty research data found.</p>
              ) : (
                <Table striped bordered hover responsive>
                  <thead className="table-primary">
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Academic Year</th>
                      <th>Collaborator</th>
                      <th>Funded</th>
                      <th>Status</th>
                      <th>Fund Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {researchList.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{item.title}</td>
                        <td>{item.academicYear}</td>
                        <td>{item.collaborator || "-"}</td>
                        <td>{item.isFunded}</td>
                        <td>{item.status}</td>
                        <td>{item.fundAmount || "-"}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="me-2"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="outline-primary"
                onClick={handleBack}
                style={{ borderColor: "#1565C0", color: "#1565C0" }}
              >
                ← Back
              </Button>
              <Button
                variant="success"
                onClick={handleNext}
                style={{
                  background: "linear-gradient(135deg, #4CAF50, #2E7D32)",
                  border: "2px solid #1B5E20",
                }}
              >
                Next →
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default FacultyResearch;
