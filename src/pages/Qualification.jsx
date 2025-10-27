import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  UploadFile,
  School,
  Book,
  LocationOn,
  Percent,
  CalendarToday,
  CalendarMonth,
  Comment,
  Attachment,
} from "@mui/icons-material";

const Qualification = () => {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [formData, setFormData] = useState({
    degree: "",
    discipline: "",
    university: "",
    percentage: "",
    registrationYear: "",
    passingYear: "",
    remarks: "",
    certificate: "",
  });

  const handleOpen = () => {
    setEditIndex(null);
    setFormData({
      degree: "",
      discipline: "",
      university: "",
      percentage: "",
      registrationYear: "",
      passingYear: "",
      remarks: "",
      certificate: "",
    });
    setOpen(true);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(qualifications[index]);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "certificate") {
      setFormData({ ...formData, certificate: files[0]?.name || "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAdd = () => {
    if (
      !formData.degree ||
      !formData.discipline ||
      !formData.university ||
      !formData.passingYear
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (editIndex !== null) {
      // Edit existing qualification
      const updated = [...qualifications];
      updated[editIndex] = formData;
      setQualifications(updated);
    } else {
      // Add new qualification
      setQualifications([...qualifications, formData]);
    }

    setFormData({
      degree: "",
      discipline: "",
      university: "",
      percentage: "",
      registrationYear: "",
      passingYear: "",
      remarks: "",
      certificate: "",
    });
    setEditIndex(null);
    handleClose();
  };

  const handleDelete = (index) => {
    const updated = [...qualifications];
    updated.splice(index, 1);
    setQualifications(updated);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
        borderRadius: 3,
        border: "2px solid #1565C0",
        boxShadow: "0 8px 32px rgba(33, 150, 243, 0.2)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <School sx={{ fontSize: 32, color: "#1565C0" }} />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #1565C0, #1976D2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Qualifications
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpen}
          sx={{
            background: "linear-gradient(135deg, #1976D2, #1565C0)",
            border: "2px solid #0D47A1",
            borderRadius: "12px",
            fontWeight: 600,
            px: 3,
            py: 1,
            fontSize: "1rem",
            "&:hover": {
              background: "linear-gradient(135deg, #1E88E5, #1565C0)",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(33, 150, 243, 0.4)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Add Qualification
        </Button>
      </Box>

      {/* Table Section */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          border: "2px solid #1976D2",
          boxShadow: "0 8px 32px rgba(33, 150, 243, 0.15)",
          overflowX: "auto",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ background: "linear-gradient(135deg, #42A5F5, #1976D2)" }}>
              <TableCell sx={{ fontWeight: "bold", color: "white", borderRight: "1px solid #E3F2FD" }}>
                No
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", borderRight: "1px solid #E3F2FD" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <School sx={{ fontSize: 18 }} />
                  Degree
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", borderRight: "1px solid #E3F2FD" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Book sx={{ fontSize: 18 }} />
                  Discipline
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", borderRight: "1px solid #E3F2FD" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOn sx={{ fontSize: 18 }} />
                  University
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", borderRight: "1px solid #E3F2FD" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Percent sx={{ fontSize: 18 }} />
                  Percentage
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", borderRight: "1px solid #E3F2FD" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarToday sx={{ fontSize: 18 }} />
                  Reg. Year
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", borderRight: "1px solid #E3F2FD" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarMonth sx={{ fontSize: 18 }} />
                  Passing Year
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", borderRight: "1px solid #E3F2FD" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Comment sx={{ fontSize: 18 }} />
                  Remarks
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", borderRight: "1px solid #E3F2FD" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Attachment sx={{ fontSize: 18 }} />
                  Certificate
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {qualifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <School sx={{ fontSize: 48, color: "grey.400", mb: 1 }} />
                  <Typography variant="h6" color="grey.500">
                    No qualifications added yet
                  </Typography>
                  <Typography variant="body2" color="grey.500">
                    Click "Add Qualification" to get started
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              qualifications.map((row, index) => (
                <TableRow 
                  key={index} 
                  hover 
                  sx={{ 
                    '&:hover': { 
                      background: "linear-gradient(135deg, #E3F2FD, #BBDEFB)" 
                    } 
                  }}
                >
                  <TableCell>
                    <Chip 
                      label={index + 1} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#1565C0" }}>
                    {row.degree}
                  </TableCell>
                  <TableCell>{row.discipline}</TableCell>
                  <TableCell>{row.university}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.percentage} 
                      size="small" 
                      color="success" 
                      variant="filled" 
                    />
                  </TableCell>
                  <TableCell>{row.registrationYear}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.passingYear} 
                      size="small" 
                      color="primary" 
                    />
                  </TableCell>
                  <TableCell>
                    {row.remarks ? (
                      <Tooltip title={row.remarks}>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                          {row.remarks}
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Typography variant="body2" color="grey.500">
                        -
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {row.certificate ? (
                      <Chip 
                        icon={<Attachment />}
                        label="Certificate" 
                        size="small" 
                        color="info" 
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body2" color="grey.500">
                        No file
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(index)}
                          size="small"
                          sx={{
                            background: "linear-gradient(135deg, #42A5F5, #1976D2)",
                            color: "white",
                            "&:hover": {
                              background: "linear-gradient(135deg, #1E88E5, #1565C0)",
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(index)}
                          size="small"
                          sx={{
                            background: "linear-gradient(135deg, #EF5350, #D32F2F)",
                            color: "white",
                            "&:hover": {
                              background: "linear-gradient(135deg, #E53935, #C62828)",
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Qualification Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            width: { xs: "95%", sm: "80%", md: "70%" },
            maxWidth: 800,
            bgcolor: "white",
            borderRadius: 3,
            border: "2px solid #1976D2",
            boxShadow: "0 20px 60px rgba(33, 150, 243, 0.3)",
            p: 4,
            mx: "auto",
            mt: "5%",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <School sx={{ fontSize: 32, color: "#1976D2" }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#1565C0" }}>
              {editIndex !== null ? "Edit Qualification" : "Add New Qualification"}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Degree"
                fullWidth
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <School sx={{ mr: 1, color: "grey.500" }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Discipline / Stream"
                fullWidth
                name="discipline"
                value={formData.discipline}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <Book sx={{ mr: 1, color: "grey.500" }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="University / Institution"
                fullWidth
                name="university"
                value={formData.university}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <LocationOn sx={{ mr: 1, color: "grey.500" }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Percentage / CGPA"
                fullWidth
                name="percentage"
                value={formData.percentage}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Percent sx={{ mr: 1, color: "grey.500" }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Year of Registration"
                fullWidth
                name="registrationYear"
                value={formData.registrationYear}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <CalendarToday sx={{ mr: 1, color: "grey.500" }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Year of Passing"
                fullWidth
                name="passingYear"
                value={formData.passingYear}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <CalendarMonth sx={{ mr: 1, color: "grey.500" }} />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Special Remarks"
                fullWidth
                multiline
                rows={3}
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Comment sx={{ mr: 1, color: "grey.500", mt: 2 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFile />}
                fullWidth
                sx={{
                  border: "2px dashed #1976D2",
                  color: "#1976D2",
                  py: 2,
                  "&:hover": { 
                    background: "#E3F2FD",
                    border: "2px dashed #1565C0",
                  },
                }}
              >
                Upload Certificate
                <input
                  type="file"
                  name="certificate"
                  hidden
                  onChange={handleChange}
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
              </Button>
              {formData.certificate && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                  <Attachment color="primary" />
                  <Typography variant="body2" color="primary.main">
                    Selected: {formData.certificate}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                border: "2px solid #1976D2",
                color: "#1976D2",
                px: 3,
                "&:hover": {
                  background: "#E3F2FD",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAdd}
              sx={{
                background: "linear-gradient(135deg, #1976D2, #1565C0)",
                border: "2px solid #0D47A1",
                px: 4,
                "&:hover": {
                  background: "linear-gradient(135deg, #1E88E5, #1565C0)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 20px rgba(33, 150, 243, 0.4)",
                },
              }}
            >
              {editIndex !== null ? "Update" : "Save"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Qualification;