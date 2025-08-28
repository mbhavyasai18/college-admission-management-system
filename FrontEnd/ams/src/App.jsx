import React, { useState } from 'react';
import Login from './components/Login';
import UserPortal from './pages/UserPortal';
import AdminPortal from './pages/AdminPortal';
import RegistrationPage from './pages/RegistrationPage';
import ForgotPassword from './pages/ForgotPassword';

const RegistrationSuccess = ({ details, onBackToLogin }) => (
    <div className="registration-container">
        <div className="registration-card">
            <h2 style={{ color: "#155724", backgroundColor: "#d4edda", padding: "10px", borderRadius: "5px" }}>
                🎉 Registration Successful!
            </h2>
            <p style={{ color: "#0c5460", backgroundColor: "#d1ecf1", padding: "8px", borderRadius: "5px" }}>
                Your account has been created. Please use these credentials to log in.
            </p>
            <div className="credentials-display">
                <p><strong>Student ID:</strong> {details.studentID}</p>
                <p><strong>Username:</strong> {details.username}</p>
                <p><strong>Password:</strong> {details.password}</p>
            </div>
            <button className="submit-btn" onClick={onBackToLogin}>Back to Login</button>
        </div>
    </div>
);

function App() {
    const [view, setView] = useState('login');
    const [userRole, setUserRole] = useState(null);
    const [registrationDetails, setRegistrationDetails] = useState(null);

    const handleLoginSuccess = (role) => {
        setUserRole(role);
        setView(role === 'ADMIN' ? 'adminPortal' : 'studentPortal');
    };

    const handleLogout = () => {
        setUserRole(null);
        setView('login');
        localStorage.clear();
    };

    const handleNavigateToRegister = () => {
        setView('register');
    };

    const handleNavigateToForgotPassword = () => {
        setView('forgotPassword');
    };

    const handleRegistrationSuccess = (details) => {
        setRegistrationDetails(details);
        setView('registrationSuccess');
    };

    const handleBackToLogin = () => {
        setView('login');
    };

    const renderContent = () => {
        switch (view) {
            case 'register':
                return <RegistrationPage onBackToLogin={handleBackToLogin} onRegistrationSuccess={handleRegistrationSuccess} />;
            case 'registrationSuccess':
                return <RegistrationSuccess details={registrationDetails} onBackToLogin={handleBackToLogin} />;
            case 'forgotPassword':
                return <ForgotPassword onBackToLogin={handleBackToLogin} />;
            case 'studentPortal':
                return <UserPortal onLogout={handleLogout} />;
            case 'adminPortal':
                return <AdminPortal onLogout={handleLogout} />;
            case 'login':
            default:
                return (
                    <Login
                        onLoginSuccess={handleLoginSuccess}
                        onNavigateToRegister={handleNavigateToRegister}
                        onNavigateToForgotPassword={handleNavigateToForgotPassword}
                    />
                );
        }
    };

    return (
        <div className="App">
            {renderContent()}
        </div>
    );
}

export default App;
