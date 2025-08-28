import React, { useState } from 'react';
import './AdminPortal.css';
import AdminDashboard from './AdminDashboard';
import CourseManagement from './CourseManagement';
import ApplicationManagement from './ApplicationManagement';
import StudentDatabase from './StudentDatabase';

// --- Icons ---
const DashboardIcon = () => <svg viewBox="0 0 24 24"><path d="M13 3v8H3V3h10zm0 18v-6H3v6h10zm8-18v8h-6V3h6zm-6 18v-6h6v6h-6z"/></svg>;
const CoursesIcon = () => <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H8v-2h4V6h2v4h4v2z"/></svg>;
const AppsIcon = () => <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>;
const StudentsIcon = () => <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
const LogoutIcon = () => <svg viewBox="0 0 24 24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>;

const AdminPortal = ({ onLogout }) => {
    const [activeComponent, setActiveComponent] = useState('Dashboard');

    const renderComponent = () => {
        switch (activeComponent) {
            case 'Dashboard':
                // --- THIS IS THE FIX ---
                // We pass the setActiveComponent function down to the Dashboard
                return <AdminDashboard setActiveComponent={setActiveComponent} />;
            case 'Courses':
                return <CourseManagement />;
            case 'Applications':
                return <ApplicationManagement />;
            case 'Students':
                return <StudentDatabase />;
            default:
                return <AdminDashboard setActiveComponent={setActiveComponent} />;
        }
    };

    return (
        <div className="admin-portal-container">
            <nav className="admin-sidebar">
                <div className="admin-sidebar-header"><h2>Admin Panel</h2></div>
                <ul className="admin-sidebar-nav">
                    <li className={activeComponent === 'Dashboard' ? 'active' : ''} onClick={() => setActiveComponent('Dashboard')}><DashboardIcon /><span>Dashboard</span></li>
                    <li className={activeComponent === 'Courses' ? 'active' : ''} onClick={() => setActiveComponent('Courses')}><CoursesIcon /><span>Course Management</span></li>
                    <li className={activeComponent === 'Applications' ? 'active' : ''} onClick={() => setActiveComponent('Applications')}><AppsIcon /><span>Applications</span></li>
                    <li className={activeComponent === 'Students' ? 'active' : ''} onClick={() => setActiveComponent('Students')}><StudentsIcon /><span>Students</span></li>
                </ul>
                <div className="admin-sidebar-footer">
                    <button onClick={onLogout} className="admin-logout-btn"><LogoutIcon /><span>Logout</span></button>
                </div>
            </nav>
            <main className="admin-main-content">
                {renderComponent()}
            </main>
        </div>
    );
};

export default AdminPortal;