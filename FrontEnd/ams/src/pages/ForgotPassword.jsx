import React, { useState } from 'react';
import apiClient from '../apiClient';
import './ForgotPassword.css';

const ForgotPassword = ({ onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleSendResetLink = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            // Call backend to send reset password link
            await apiClient.post('/auth/send-reset-link', { email });
            setSuccess(`A password reset link has been sent to ${email}`);
        } catch (err) {
            setError('A password reset link has been sent to your email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <form onSubmit={handleSendResetLink}>
                    <h2>Forgot Password</h2>
                    <p>Enter your email to receive a password reset link.</p>

                    <div className="form-group">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder=" "
                            required
                        />
                        <label htmlFor="email">Email Address</label>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="back-to-login-link">
                    <a href="#" onClick={onBackToLogin}>&larr; Back to Login</a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
