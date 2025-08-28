import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import './ViewCourses.css';

const ViewCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applying, setApplying] = useState(null);
    
    // --- IDHE FINAL FIX ---
    // Ee kotha state, student ki already application unda leda anedi check chestundi.
    const [hasExistingApplication, setHasExistingApplication] = useState(false);

    useEffect(() => {
        const checkExistingApplication = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (userId) {
                    // Student profile unda leda anedi check chestunnam.
                    // Profile unte, application kuda unnattu.
                    await apiClient.get(`/api/students/${userId}`);
                    setHasExistingApplication(true);
                }
            } catch (err) {
                // Profile lekapothe, error vastundi, ante inka application ledu.
                // Ee case lo, manam emi cheyanakkarledu.
                setHasExistingApplication(false);
            }
        };

        const fetchCourses = async () => {
            try {
                const response = await apiClient.get('/api/courses');
                setCourses(response.data);
            } catch (err) {
                setError('Failed to fetch courses. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        // Rendu functions ni okate sari run chestunnam
        Promise.all([checkExistingApplication(), fetchCourses()]);
    }, []);

    const handleApplyNow = async (courseId, courseName) => {
        if (!window.confirm(`Are you sure you want to apply for ${courseName}? This will create a new student profile.`)) {
            return;
        }

        setApplying(courseId);
        setError(null);

        try {
            // Ee logic, kotha student ni create cheyadaniki matrame.
            // Manam paatha user details ni vadadam ledu.
            const registrationPayload = {
                // Ee details ni form nunchi teeskuntaru, kani ippatiki, manam sample data vadutunnam
                firstName: "New",
                lastName: "User",
                email: `user-${Date.now()}@example.com`, // Pratisaari kotha email generate chestunnam
                dob: "2000-01-01",
                gender: "Male",
                contactNumber: "1234567890",
                address: "123 Main St",
                courseID: courseId,
            };
            
            const response = await apiClient.post('/api/students/register', registrationPayload);
            
            alert(`Successfully created a new application for ${courseName}! Your new application ID is ${response.data.studentID}. Please log out and log in with your new credentials.`);
            setHasExistingApplication(true); // Application create ayyaka, button ni disable cheyali

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Application failed. Please try again.';
            setError(errorMessage);
            alert(`Error: ${errorMessage}`);
            console.error(err);
        } finally {
            setApplying(null);
        }
    };

    if (loading) return <div className="view-courses-container"><p>Loading courses...</p></div>;
    
    return (
        <div className="view-courses-container">
            <header className="courses-header">
                <h1>Available Courses</h1>
                <p>Browse our wide range of programs and find the one that's right for you.</p>
            </header>

            {/* Application unte, ee message chupistundi */}
            {hasExistingApplication && (
                <div className="info-banner">
                    You already have an active application. You can track its status in your portal.
                </div>
            )}
            
            {error && <p className="error-message">{error}</p>}

            <div className="courses-grid">
                {courses.map(course => (
                    <div className="course-card" key={course.courseID}>
                        <div className="card-content">
                            <h3 className="course-name">{course.courseName}</h3>
                            <div className="course-details">
                                <p><strong>Duration:</strong> {course.duration} Years</p>
                                <p><strong>Total Fees:</strong> ₹{course.totalFees.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button
                                className="apply-now-btn"
                                onClick={() => handleApplyNow(course.courseID, course.courseName)}
                                // Application unte, button disable avutundi
                                disabled={applying === course.courseID || hasExistingApplication}
                            >
                                {applying === course.courseID ? 'Applying...' : (hasExistingApplication ? 'Application Submitted' : 'Apply Now')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewCourses;
