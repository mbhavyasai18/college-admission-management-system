import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import './CourseManagement.css';

// --- Icons ---
const EditIcon = () => <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;
const DeleteIcon = () => <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>;
const CloseIcon = () => <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>;

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [formData, setFormData] = useState({ courseID: '', courseName: '', duration: '', totalFees: '' });

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/api/courses');
            setCourses(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError('Failed to fetch courses.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleOpenModal = (course = null) => {
        setCurrentCourse(course);
        if (course) {
            setFormData(course);
        } else {
            setFormData({ courseID: '', courseName: '', duration: '', totalFees: '', placeholder: ' ' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value, placeholder: ' ' }));
    };

    const handleSaveCourse = async (e) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            duration: parseInt(formData.duration, 10),
            totalFees: parseInt(formData.totalFees, 10)
        };
        delete dataToSave.placeholder;

        if (isNaN(dataToSave.duration) || isNaN(dataToSave.totalFees)) {
            alert("Please enter valid numbers for Duration and Total Fees.");
            return;
        }

        try {
            if (currentCourse) {
                await apiClient.put(`/api/courses/${currentCourse.courseID}`, dataToSave);
            } else {
                await apiClient.post('/api/courses', dataToSave);
            }
            fetchCourses();
            handleCloseModal();
        } catch (err) {
            alert('Failed to save the course.');
        }
    };

    // --- THIS IS THE FIX ---
    // Ee function ippudu manaki saraina error message chupistundi
    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await apiClient.delete(`/api/courses/${courseId}`);
                alert('Course deleted successfully!');
                fetchCourses(); // Table ni refresh cheyadaniki
            } catch (err) {
                console.error("Delete failed:", err);
                // Ee kotha, clear error message ippudu kanipistundi
                alert('Could not delete course. It is likely that students are currently enrolled in it. Please remove students from this course before deleting.');
            }
        }
    };

    if (loading) return <p>Loading courses...</p>;
    if (error) return <p style={{color: 'red'}}>{error}</p>;

    return (
        <div className="course-management-container">
            <header className="course-header">
                <h1>Course Management</h1>
                <button className="add-new-btn" onClick={() => handleOpenModal()}>+ Add New Course</button>
            </header>
            <div className="courses-table-container">
                <table className="courses-table">
                    <thead>
                        <tr>
                            <th>Course ID</th>
                            <th>Course Name</th>
                            <th>Duration (Years)</th>
                            <th>Total Fees</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length > 0 ? (
                            courses.map(course => (
                                <tr key={course.courseID}>
                                    <td>{course.courseID}</td>
                                    <td>{course.courseName}</td>
                                    <td>{course.duration}</td>
                                    <td>₹{Number(course.totalFees).toLocaleString('en-IN')}</td>
                                    <td>
                                        <button className="action-btn edit-btn" onClick={() => handleOpenModal(course)}><EditIcon /></button>
                                        <button className="action-btn delete-btn" onClick={() => handleDeleteCourse(course.courseID)}><DeleteIcon /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>No courses found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <header className="modal-header">
                            <h2>{currentCourse ? 'Edit Course' : 'Add New Course'}</h2>
                            <button className="close-btn" onClick={handleCloseModal}><CloseIcon /></button>
                        </header>
                        <form onSubmit={handleSaveCourse} className="course-form">
                             <div className="form-group">
                                <input type="text" id="courseID" value={formData.courseID} onChange={handleInputChange} required disabled={!!currentCourse} placeholder=" " />
                                <label htmlFor="courseID">Course ID</label>
                            </div>
                            <div className="form-group">
                                <input type="text" id="courseName" value={formData.courseName} onChange={handleInputChange} required placeholder=" " />
                                <label htmlFor="courseName">Course Name</label>
                            </div>
                            <div className="form-group">
                                <input type="number" id="duration" value={formData.duration} onChange={handleInputChange} required placeholder=" " />
                                <label htmlFor="duration">Duration (Years)</label>
                            </div>
                            <div className="form-group">
                                <input type="number" id="totalFees" value={formData.totalFees} onChange={handleInputChange} required placeholder=" " />
                                <label htmlFor="totalFees">Total Fees</label>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="save-btn">Save Course</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseManagement;