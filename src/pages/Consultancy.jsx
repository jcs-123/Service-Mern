import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Consultancy = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    organisedBy: "",
    academicYear: "",
    isFunded: "",
    fundAmount: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("consultancyData");
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.title || !formData.organisedBy || !formData.academicYear) {
      alert("Please fill in all required fields");
      return;
    }
    localStorage.setItem("consultancyData", JSON.stringify(formData));
    alert("Consultancy project saved successfully!");
  };

  const handleBack = () => navigate("/FacultyReserach");
  const handleNext = () => navigate("/ProjectGuided");

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
      <Container fluid="md" className="py-4">
        <Card
          className="shadow-lg mx-auto"
          style={{
            border: "2px solid #1565C0",
            borderRadius: "15px",
            maxWidth: "900px",
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

            {/* Form */}
            <Form>
              <Row className="gy-3">
                <Col xs={12}>
                  <Form.Group controlId="formTitle">
                    <Form.Label className="fw-semibold">
                      Title <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      placeholder="e.g. Consultancy on Structural Design"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group controlId="formOrganisedBy">
                    <Form.Label className="fw-semibold">
                      Organised By <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="organisedBy"
                      placeholder="e.g. Jyothi Engineering College"
                      value={formData.organisedBy}
                      onChange={handleChange}
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
                      placeholder="e.g. 2024-2025"
                      value={formData.academicYear}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group controlId="formIsFunded">
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
                  <Form.Group controlId="formFundAmount">
                    <Form.Label className="fw-semibold">
                      Fund Amount (₹)
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="fundAmount"
                      placeholder="e.g. 50000"
                      value={formData.fundAmount}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Buttons */}
              <Row className="mt-4">
                <Col
                  xs={12}
                  className="d-flex justify-content-between flex-wrap gap-2"
                >
                  <Button
                    variant="outline-primary"
                    onClick={handleBack}
                    className="px-4 py-2"
                    style={{
                      borderColor: "#1565C0",
                      color: "#1565C0",
                      fontWeight: 600,
                    }}
                  >
                    ← Back
                  </Button>

                  <div className="d-flex gap-2">
                    <Button
                      variant="primary"
                      onClick={handleSave}
                      className="px-4 py-2"
                      style={{
                        background: "linear-gradient(135deg, #1976D2, #1565C0)",
                        border: "2px solid #0D47A1",
                        fontWeight: 600,
                      }}
                    >
                      Save
                    </Button>

                    <Button
                      variant="success"
                      onClick={handleNext}
                      className="px-4 py-2"
                      style={{
                        background:
                          "linear-gradient(135deg, #4CAF50, #2E7D32)",
                        border: "2px solid #1B5E20",
                        fontWeight: 600,
                      }}
                    >
                      Next →
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Consultancy;
