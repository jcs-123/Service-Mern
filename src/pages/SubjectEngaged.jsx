import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    TextField,
    Button,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

function SubjectEngaged() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState(false);
    const [existingSubjects, setExistingSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);
    const [editIndex, setEditIndex] = useState(null);

    const [subjects, setSubjects] = useState([
        {
            academicYear: "",
            batch: "",
            semester: "",
            subjectCode: "",
            subjectName: "",
            courseDiary: "",
            passPercentage: "",
        },
    ]);

    // Load existing subjects on component mount
    useEffect(() => {
        fetchExistingSubjects();
    }, []);

    const fetchExistingSubjects = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (userId) {
                const response = await axios.get(
                    `http://localhost:4000/subjects-engaged?userId=${userId}`
                );
                if (response.data.success && response.data.data) {
                    setExistingSubjects(response.data.data.subjects || []);
                }
            }
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    const handleChange = (index, field, value) => {
        const updated = [...subjects];
        updated[index][field] = value;
        setSubjects(updated);
    };

    const handleEditChange = (field, value) => {
        setEditingSubject(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddRow = () => {
        setSubjects([
            ...subjects,
            {
                academicYear: "",
                batch: "",
                semester: "",
                subjectCode: "",
                subjectName: "",
                courseDiary: "",
                passPercentage: "",
            },
        ]);
    };

<<<<<<< HEAD
    const handlePrevious = () => navigate("/Experience");
=======
    const handleRemoveRow = (index) => {
        if (subjects.length > 1) {
            const updated = subjects.filter((_, i) => i !== index);
            setSubjects(updated);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            
            // Validate form
            for (let subject of subjects) {
                if (!subject.academicYear || !subject.subjectCode || !subject.subjectName) {
                    alert("Please fill all required fields (Academic Year, Subject Code, and Subject Name)");
                    setLoading(false);
                    return;
                }
            }

            const userId = localStorage.getItem('userId') || `user-${Date.now()}`;
            
            const response = await axios.post(
                "http://localhost:4000/subjects-engaged",
                { 
                    subjects,
                    userId
                }
            );

            if (response.data.success) {
                localStorage.setItem('userId', userId);
                alert("Subjects saved successfully!");
                fetchExistingSubjects();
                // Reset form
                setSubjects([{
                    academicYear: "",
                    batch: "",
                    semester: "",
                    subjectCode: "",
                    subjectName: "",
                    courseDiary: "",
                    passPercentage: "",
                }]);
            }
        } catch (error) {
            console.error("Error saving subjects:", error);
            alert(`Error saving subjects: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleViewAll = () => {
        setViewMode(true);
    };

    const handleBackToForm = () => {
        setViewMode(false);
    };

    const handleViewDetails = (subject) => {
        setSelectedSubject(subject);
        setViewDialogOpen(true);
    };

    const handleEdit = (subject, index) => {
        setEditingSubject({...subject});
        setEditIndex(index);
        setEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);

            if (!editingSubject.academicYear || !editingSubject.subjectCode || !editingSubject.subjectName) {
                alert("Please fill all required fields");
                setLoading(false);
                return;
            }

            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert("User ID not found");
                return;
            }

            // Get current subjects and update the specific one
            const response = await axios.get(`http://localhost:4000/subjects-engaged?userId=${userId}`);
            if (response.data.success && response.data.data) {
                const allSubjects = response.data.data.subjects;
                allSubjects[editIndex] = editingSubject;

                const updateResponse = await axios.post("http://localhost:4000/subjects-engaged", {
                    subjects: allSubjects,
                    userId
                });

                if (updateResponse.data.success) {
                    alert("Subject updated successfully!");
                    setEditDialogOpen(false);
                    setEditingSubject(null);
                    setEditIndex(null);
                    fetchExistingSubjects();
                }
            }
        } catch (error) {
            console.error("Error updating subject:", error);
            alert(`Error updating subject: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (index) => {
        if (window.confirm("Are you sure you want to delete this subject?")) {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) return;

                const response = await axios.get(`http://localhost:4000/subjects-engaged?userId=${userId}`);
                if (response.data.success && response.data.data) {
                    const allSubjects = response.data.data.subjects;
                    const updatedSubjects = allSubjects.filter((_, i) => i !== index);

                    const updateResponse = await axios.post("http://localhost:4000/subjects-engaged", {
                        subjects: updatedSubjects,
                        userId
                    });

                    if (updateResponse.data.success) {
                        alert("Subject deleted successfully!");
                        fetchExistingSubjects();
                        setViewDialogOpen(false);
                    }
                }
            } catch (error) {
                console.error("Error deleting subject:", error);
                alert("Error deleting subject");
            }
        }
    };

    const handlePrevious = () => navigate("/qualification");
>>>>>>> 70d491c (sandra upadte)
    const handleNext = () => navigate("/Publications");

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                py: 4,
                px: { xs: 2, md: 4 },
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ width: "100%", maxWidth: "1200px" }}
            >
                <Paper
                    elevation={8}
                    sx={{
                        p: { xs: 3, md: 4 },
                        borderRadius: 3,
                        backgroundColor: "#ffffff",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    }}
                >
                    <Typography
                        variant="h4"
                        align="center"
                        fontWeight="600"
                        sx={{
                            color: "#1a237e",
                            mb: 1,
                            fontSize: { xs: "1.75rem", md: "2.125rem" },
                        }}
                    >
                        Subjects Engaged
                    </Typography>
                    
                    <Typography
                        variant="body1"
                        align="center"
                        sx={{
                            color: "#5f6368",
                            mb: 4,
                        }}
                    >
                        Add the subjects you are currently teaching or have taught
                    </Typography>

                    {/* Action Buttons */}
                    <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 4 }}>
                        {!viewMode ? (
                            <Button
                                variant="outlined"
                                onClick={handleViewAll}
                                startIcon={<VisibilityIcon />}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: "600",
                                    px: 4,
                                }}
                            >
                                View All Subjects
                            </Button>
                        ) : (
                            <Button
                                variant="outlined"
                                onClick={handleBackToForm}
                                startIcon={<AddIcon />}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: "600",
                                    px: 4,
                                }}
                            >
                                Add New Subject
                            </Button>
                        )}
                    </Box>

                    {/* Add Subject Form */}
                    {!viewMode && (
                        <>
                            {subjects.map((row, index) => (
                                <Paper
                                    key={index}
                                    sx={{
                                        p: 3,
                                        mb: 3,
                                        backgroundColor: "#f8f9fa",
                                        borderRadius: 2,
                                        border: "1px solid #e0e0e0",
                                        position: "relative",
                                    }}
                                    component={motion.div}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{ 
                                            color: "#1a237e", 
                                            mb: 2,
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}
                                    >
                                        Subject {index + 1}
                                        {subjects.length > 1 && (
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => handleRemoveRow(index)}
                                                sx={{ minWidth: "auto", px: 2 }}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </Typography>
                                    
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Academic Year *"
                                                value={row.academicYear}
                                                onChange={(e) =>
                                                    handleChange(index, "academicYear", e.target.value)
                                                }
                                                fullWidth
                                                placeholder="e.g., 2024-2025"
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Batch"
                                                value={row.batch}
                                                onChange={(e) =>
                                                    handleChange(index, "batch", e.target.value)
                                                }
                                                fullWidth
                                                placeholder="e.g., CSE-M 2K24"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Semester"
                                                value={row.semester}
                                                onChange={(e) =>
                                                    handleChange(index, "semester", e.target.value)
                                                }
                                                fullWidth
                                                placeholder="e.g., IInd Semester"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Subject Code *"
                                                value={row.subjectCode}
                                                onChange={(e) =>
                                                    handleChange(index, "subjectCode", e.target.value)
                                                }
                                                fullWidth
                                                placeholder="e.g., 222ECS001"
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Subject Name *"
                                                value={row.subjectName}
                                                onChange={(e) =>
                                                    handleChange(index, "subjectName", e.target.value)
                                                }
                                                fullWidth
                                                placeholder="e.g., WIRELESS SENSOR NETWORKS"
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Course Diary"
                                                value={row.courseDiary}
                                                onChange={(e) =>
                                                    handleChange(index, "courseDiary", e.target.value)
                                                }
                                                fullWidth
                                                placeholder="Diary or other reference"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Pass Percentage"
                                                value={row.passPercentage}
                                                onChange={(e) =>
                                                    handleChange(index, "passPercentage", e.target.value)
                                                }
                                                fullWidth
                                                placeholder="e.g., 85%"
                                                type="number"
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ))}

                            {/* Add Row Button */}
                            <Box sx={{ textAlign: "center", mb: 4 }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleAddRow}
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: 2,
                                        fontWeight: "600",
                                        px: 4,
                                        py: 1,
                                    }}
                                >
                                    + Add Another Subject
                                </Button>
                            </Box>

                            {/* Submit Button */}
                            <Box sx={{ textAlign: "center", mb: 4 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: 2,
                                        fontWeight: "600",
                                        px: 6,
                                        py: 1.5,
                                        backgroundColor: "#1a237e",
                                        "&:hover": {
                                            backgroundColor: "#283593",
                                        },
                                    }}
                                >
                                    {loading ? "Saving..." : "Save Subjects"}
                                </Button>
                            </Box>
                        </>
                    )}

                    {/* View All Subjects Table */}
                    {viewMode && existingSubjects.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ color: "#1a237e", mb: 3, textAlign: "center" }}>
                                Your Subjects ({existingSubjects.length})
                            </Typography>
                            <TableContainer component={Paper} elevation={3}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: "#1a237e" }}>
                                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Academic Year</TableCell>
                                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Subject Code</TableCell>
                                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Subject Name</TableCell>
                                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Batch</TableCell>
                                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Semester</TableCell>
                                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Pass %</TableCell>
                                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {existingSubjects.map((subject, index) => (
                                            <TableRow 
                                                key={index}
                                                sx={{ 
                                                    '&:hover': { 
                                                        backgroundColor: '#f5f5f5' 
                                                    } 
                                                }}
                                            >
                                                <TableCell>
                                                    <Chip 
                                                        label={subject.academicYear} 
                                                        color="primary" 
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                        {subject.subjectCode}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {subject.subjectName}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{subject.batch}</TableCell>
                                                <TableCell>{subject.semester}</TableCell>
                                                <TableCell>
                                                    {subject.passPercentage ? (
                                                        <Chip 
                                                            label={`${subject.passPercentage}%`} 
                                                            color={subject.passPercentage >= 75 ? "success" : "warning"}
                                                            size="small"
                                                        />
                                                    ) : (
                                                        <Typography variant="body2" color="textSecondary">
                                                            -
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton 
                                                        color="primary" 
                                                        onClick={() => handleViewDetails(subject)}
                                                        size="small"
                                                        title="View Details"
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                    <IconButton 
                                                        color="secondary" 
                                                        onClick={() => handleEdit(subject, index)}
                                                        size="small"
                                                        title="Edit Subject"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton 
                                                        color="error" 
                                                        onClick={() => handleDelete(index)}
                                                        size="small"
                                                        title="Delete Subject"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {existingSubjects.length === 0 && (
                                <Typography 
                                    variant="body1" 
                                    align="center" 
                                    sx={{ 
                                        color: "text.secondary", 
                                        py: 4,
                                        fontStyle: 'italic'
                                    }}
                                >
                                    No subjects added yet. Click "Add New Subject" to get started.
                                </Typography>
                            )}
                        </Box>
                    )}

                    {/* Navigation Buttons */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 4,
                            pt: 3,
                            borderTop: "1px solid #e0e0e0",
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={handlePrevious}
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: "600",
                                px: 4,
                                py: 1,
                            }}
                        >
                            Previous
                        </Button>
                        
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: "600",
                                px: 4,
                                py: 1,
                                backgroundColor: "#1a237e",
                                "&:hover": {
                                    backgroundColor: "#283593",
                                },
                            }}
                        >
                            Next →
                        </Button>
                    </Box>
                </Paper>

                {/* View Subject Details Dialog */}
                <Dialog 
                    open={viewDialogOpen} 
                    onClose={() => setViewDialogOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <Typography variant="h6" fontWeight="bold" color="#1a237e">
                            Subject Details
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        {selectedSubject && (
                            <Grid container spacing={3} sx={{ mt: 1 }}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                        Academic Year
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
                                        {selectedSubject.academicYear}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                        Batch
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
                                        {selectedSubject.batch || 'Not specified'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                        Semester
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
                                        {selectedSubject.semester || 'Not specified'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                        Subject Code
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1.1rem', fontFamily: 'monospace' }}>
                                        {selectedSubject.subjectCode}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                        Subject Name
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
                                        {selectedSubject.subjectName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                        Course Diary
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
                                        {selectedSubject.courseDiary || 'Not specified'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                        Pass Percentage
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
                                        {selectedSubject.passPercentage ? `${selectedSubject.passPercentage}%` : 'Not specified'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setViewDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Edit Subject Dialog */}
                <Dialog 
                    open={editDialogOpen} 
                    onClose={() => setEditDialogOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <Typography variant="h6" fontWeight="bold" color="#1a237e">
                            Edit Subject
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        {editingSubject && (
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Academic Year *"
                                        value={editingSubject.academicYear}
                                        onChange={(e) => handleEditChange("academicYear", e.target.value)}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Batch"
                                        value={editingSubject.batch}
                                        onChange={(e) => handleEditChange("batch", e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Semester"
                                        value={editingSubject.semester}
                                        onChange={(e) => handleEditChange("semester", e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Subject Code *"
                                        value={editingSubject.subjectCode}
                                        onChange={(e) => handleEditChange("subjectCode", e.target.value)}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Subject Name *"
                                        value={editingSubject.subjectName}
                                        onChange={(e) => handleEditChange("subjectName", e.target.value)}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Course Diary"
                                        value={editingSubject.courseDiary}
                                        onChange={(e) => handleEditChange("courseDiary", e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Pass Percentage"
                                        value={editingSubject.passPercentage}
                                        onChange={(e) => handleEditChange("passPercentage", e.target.value)}
                                        fullWidth
                                        type="number"
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleUpdate} 
                            variant="contained" 
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Subject"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </motion.div>
        </Box>
    );
}

export default SubjectEngaged;