import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient'; // Import the API client
import './AdminDashboard.css'; // Styles for the dashboard

// --- Icons ---
const AppsIcon = () => <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>;
const StudentsIcon = () => <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
const CoursesIcon = () => <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H8v-2h4V6h2v4h4v2z"/></svg>;
const RevenueIcon = () => <svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c2.11-.46 3.5-1.78 3.5-3.97 0-2.82-2.43-3.87-4.7-4.54z"/></svg>;


const AdminDashboard = ({ setActiveComponent }) => {
    const [stats, setStats] = useState({
        pendingApplications: 0,
        totalStudents: 0,
        coursesOffered: 0,
        totalRevenue: 0,
    });
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [studentsRes, coursesRes, applicationsRes] = await Promise.all([
                    apiClient.get('/api/students'),
                    apiClient.get('/api/courses'),
                    apiClient.get('/api/admissions')
                ]);

                const students = studentsRes.data;
                const courses = coursesRes.data;
                const applications = applicationsRes.data;

                const pendingCount = applications.filter(app => app.status === 'Pending').length;
                const approvedStudents = applications.filter(app => app.status === 'Approved');
                
                const estimatedRevenue = approvedStudents.reduce((total, app) => {
                    const course = courses.find(c => c.courseID === app.courseID);
                    return total + (course ? course.totalFees : 0);
                }, 0);

                setStats({
                    pendingApplications: pendingCount,
                    totalStudents: students.length,
                    coursesOffered: courses.length,
                    totalRevenue: estimatedRevenue,
                });
                
                setRecentApplications(applications.slice(0, 5));

            } catch (err) {
                setError('Failed to load dashboard data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getStatusClass = (status) => {
        if (status === 'Approved') return 'status-approved';
        if (status === 'Rejected') return 'status-rejected';
        return 'status-pending';
    };

    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p style={{color: 'red'}}>{error}</p>;

    const statCards = [
        { title: "Pending Applications", value: stats.pendingApplications, icon: <AppsIcon />, color: "orange" },
        { title: "Total Students", value: stats.totalStudents, icon: <StudentsIcon />, color: "green" },
        { title: "Courses Offered", value: stats.coursesOffered, icon: <CoursesIcon />, color: "blue" },
        { title: "Estimated Revenue", value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: <RevenueIcon />, color: "purple" }
    ];

    return (
        <div className="admin-dashboard-container">
            <header className="admin-dashboard-header">
                <h1>Dashboard</h1>
                <p>Welcome back, Admin! Here's a snapshot of the institution's activity.</p>
            </header>

            <div className="stats-grid">
                {statCards.map(stat => (
                    <div className={`stat-card ${stat.color}`} key={stat.title}>
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-info">
                            <p>{stat.title}</p>
                            <h3>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="admin-widgets-grid">
                <div className="admin-widget">
                    <h4>Recent Applications</h4>
                    <ul className="recent-apps-list">
                        {recentApplications.length > 0 ? (
                            recentApplications.map(app => (
                                <li key={app.studentID}>
                                    <div className="app-info">
                                        <span className="app-student-id">{app.studentID}</span>
                                        <span className="app-course-id">{app.courseID}</span>
                                    </div>
                                    <span className={`status-badge ${getStatusClass(app.status)}`}>{app.status}</span>
                                </li>
                            ))
                        ) : (
                            <p className="coming-soon">No recent applications found.</p>
                        )}
                    </ul>
                </div>
                <div className="admin-widget">
                    <h4>Quick Actions</h4>
                     <div className="quick-actions-list">
                        <button className="quick-action-btn" onClick={() => setActiveComponent('Students')}>Manage Students</button>
                        <button className="quick-action-btn" onClick={() => setActiveComponent('Courses')}>Manage Courses</button>
                        {/* --- THIS IS THE FIX --- */}
                        {/* This now uses an 'a' tag to open the default email client */}
                        <a href="mailto:?subject=College Admission Notification" className="quick-action-btn">Send Notifications</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
