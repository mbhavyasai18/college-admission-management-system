import React, { useState } from 'react';
import './UserPortal.css';
import Dashboard from './Dashboard';
import ViewCourses from './ViewCourses';
import ApplicationStatus from './ApplicationStatus';
import FeeDetails from './FeeDetails';
import MyProfile from './MyProfile';

const HomeIcon = () => <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
const CoursesIcon = () => <svg viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>;
const StatusIcon = () => <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>;
const FeesIcon = () => <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>;
const ProfileIcon = () => <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;
const LogoutIcon = () => <svg viewBox="0 0 24 24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>;

const UserPortal = ({ onLogout }) => {
    const [activeComponent, setActiveComponent] = useState('Dashboard');

    const renderComponent = () => {
        switch (activeComponent) {
            case 'Dashboard':
                return <Dashboard setActiveComponent={setActiveComponent} />;
            case 'Courses':
                return <ViewCourses />;
            case 'Status':
                return <ApplicationStatus />;
            case 'Fees':
                return <FeeDetails />;
            case 'Profile':
                return <MyProfile />;
            default:
                return <Dashboard setActiveComponent={setActiveComponent} />;
        }
    };

    return (
        <div className="portal-container">
            <nav className="sidebar">
                <div className="sidebar-header">
                    <h3>Student Portal</h3>
                </div>
                <ul className="sidebar-nav">
                    <li className={activeComponent === 'Dashboard' ? 'active' : ''} onClick={() => setActiveComponent('Dashboard')}><HomeIcon /><span>Dashboard</span></li>
                    <li className={activeComponent === 'Courses' ? 'active' : ''} onClick={() => setActiveComponent('Courses')}><CoursesIcon /><span>View Courses</span></li>
                    <li className={activeComponent === 'Status' ? 'active' : ''} onClick={() => setActiveComponent('Status')}><StatusIcon /><span>Application Status</span></li>
                    <li className={activeComponent === 'Fees' ? 'active' : ''} onClick={() => setActiveComponent('Fees')}><FeesIcon /><span>Fee Details</span></li>
                    <li className={activeComponent === 'Profile' ? 'active' : ''} onClick={() => setActiveComponent('Profile')}><ProfileIcon /><span>My Profile</span></li>
                </ul>
                <div className="sidebar-footer">
                    <button onClick={onLogout} className="logout-btn"><LogoutIcon /><span>Logout</span></button>
                </div>
            </nav>
            <main className="main-content">
                {renderComponent()}
            </main>
        </div>
    );
};

export default UserPortal;