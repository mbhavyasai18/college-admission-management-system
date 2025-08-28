import React, { useState } from 'react';
import './Login.css';
import apiClient from '../apiClient';
import InteractiveBackground from './InteractiveBackground'; // Added import

const SunIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
const MoonIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;

const Login = ({ onLoginSuccess, onNavigateToRegister, onNavigateToForgotPassword }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [themeNotification, setThemeNotification] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        setThemeNotification(newMode ? 'Dark Mode 🌙' : 'Light Mode ☀️');
        setTimeout(() => setThemeNotification(''), 1500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await apiClient.post('/auth/login', { username, password });
            const { jwt, role, userID } = response.data;
            localStorage.setItem('authToken', jwt);
            localStorage.setItem('userId', userID);
            onLoginSuccess(role.toUpperCase());
        } catch (err) {
            setError('Invalid username or password.');
        }
    };

    return (
        <div className={`page-container login-page ${isDarkMode ? 'dark' : ''}`}>
            {/* Added InteractiveBackground component */}
            <InteractiveBackground isDarkMode={isDarkMode} />
            <div className="login-card-container">
                <div className="login-promo-panel">
                    <div className="promo-overlay">
                        <h1>College Admission Management System</h1>
                        <p>Your future begins here.</p>
                    </div>
                </div>
                <div className="login-form-panel">
                    <div className="theme-toggle-container">
                        <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
                            <div className="icon-wrapper">
                                <SunIcon className="sun-icon" />
                                <MoonIcon className="moon-icon" />
                            </div>
                        </button>
                        {themeNotification && <div className="theme-notification">{themeNotification}</div>}
                    </div>
                    <div className="form-wrapper">
                        <div className="login-header">
                            <h2>Welcome Back</h2>
                            <p>Please enter your details to log in.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                <label htmlFor="username">Username</label>
                            </div>
                            <div className="form-group" style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <label htmlFor="password">Password</label>
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                        color: '#555',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </span>
                            </div>
                            <div className="forgot-password">
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToForgotPassword(); }}>
                                    Forgot Password?
                                </a>
                            </div>
                            {error && <p className="login-error">{error}</p>}
                            <button type="submit" className="submit-btn">JUMP IN!</button>
                        </form>
                        <p className="signup-link">
                            Don't have an account? <a href="#" onClick={onNavigateToRegister}>Sign Up</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;