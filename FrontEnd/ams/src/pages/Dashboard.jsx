import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import './Dashboard.css';

const Dashboard = ({ setActiveComponent }) => {
    const [profileData, setProfileData] = useState(null);
    const [courseData, setCourseData] = useState(null); 
    const [applicationStatus, setApplicationStatus] = useState('Not Available');
    const [statusColor, setStatusColor] = useState('orange');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError("Could not find user ID. Please log in again.");
                setLoading(false);
                return;
            }
            try {
                // Get student profile
                const profileRes = await apiClient.get(`/api/students/${userId}`);
                setProfileData(profileRes.data);
                const courseId = profileRes.data.courseID;

                // Fetch course details using courseId
                if (courseId) {
                    const courseRes = await apiClient.get(`/api/courses/${courseId}`);
                    setCourseData(courseRes.data);
                }

                // Fetch admission status
                const statusRes = await apiClient.get(`/api/admissions/${userId}`);
                const status = statusRes.data.status;
                setApplicationStatus(status);

                if (status === 'Approved' || status === 'Accepted') {
                    setStatusColor('green');
                } else if (status === 'Rejected') {
                    setStatusColor('red');
                } else {
                    setStatusColor('orange');
                }

            } catch (err) {
                setError('Failed to load your dashboard information.');
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);
    
    const handleLinkClick = (e, componentName) => {
        e.preventDefault();
        setActiveComponent(componentName);
    };

    if (loading) {
        return <div className="dashboard-container"><p>Loading dashboard...</p></div>;
    }

    if (error) {
        return <div className="dashboard-container"><p style={{ color: 'red' }}>{error}</p></div>;
    }

    // Handle course duration (API already gives years)
    let courseDurationText = "Not Available";
    if (courseData?.duration) {
        courseDurationText = `${courseData.duration} Year${courseData.duration !== 1 ? 's' : ''}`;
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Welcome, {profileData?.firstName}!</h1>
                <p>Here is a summary of your admission process.</p>
            </header>

            <div className="dashboard-widgets">
                <div className="widget student-info-widget">
                    <h3>Your Information</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Student ID</label>
                            <p>{profileData?.studentID}</p>
                        </div>
                        <div className="info-item">
                            <label>Enrolled Course</label>
                            <p>{courseData?.courseName || 'Not Available'}</p>
                        </div>
                        <div className="info-item">
                            <label>Course Duration</label>
                            <p>{courseDurationText}</p>
                        </div>
                    </div>
                </div>

                <div className="widget status-widget">
                    <h3>Application Status</h3>
                    <p className={`status-text ${statusColor}`}>{applicationStatus}</p>
                    <a href="#" className="widget-link" onClick={(e) => handleLinkClick(e, 'Status')}>
                        View Details &rarr;
                    </a>
                </div>

                <div className="widget quick-links-widget">
                    <h3>Quick Links</h3>
                    <a href="#" onClick={(e) => handleLinkClick(e, 'Profile')}>My Profile & Documents</a>
                    <a href="#" onClick={(e) => handleLinkClick(e, 'Fees')}>Fee Payment</a>
                    <a href="mailto:support@collegeadmissions.com">Contact Support</a>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
