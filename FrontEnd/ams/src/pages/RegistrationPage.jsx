import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import './RegistrationPage.css';

const RegistrationPage = ({ onBackToLogin }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        dob: '',
        email: '',
        contactNumber: '',
        address: '',
        courseID: '',
    });
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await apiClient.get('/api/courses');
                setCourses(response.data);
                //if (response.data.length > 0) {
                  //  setFormData(prev => ({ ...prev, courseID: response.data[0].courseID }));
                //}
            } catch (err) {
                setError('Failed to load courses.');
                console.error(err);
            }
        };
        fetchCourses();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await apiClient.post('/api/students/register', formData);
            setSuccessData(response.data);
        } catch (err) {
            setError('Registration failed. The email might already be in use.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registration-container">
            <div className="registration-card">
                {!successData ? (
                    <>
                        <header className="registration-header">
                            <h2>Create Your Account</h2>
                            <p>Join our community and start your journey today.</p>
                        </header>

                        <form onSubmit={handleSubmit} className="registration-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <input type="text" name="firstName" placeholder=" " value={formData.firstName} onChange={handleChange} required />
                                    <label>First Name</label>
                                </div>
                                <div className="form-group">
                                    <input type="text" name="lastName" placeholder=" " value={formData.lastName} onChange={handleChange} required />
                                    <label>Last Name</label>
                                </div>
                            </div>

                            <div className="form-group">
                                <input type="email" name="email" placeholder=" " value={formData.email} onChange={handleChange} required />
                                <label>Email Address (Username)</label>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <input type="tel" name="contactNumber" placeholder=" " value={formData.contactNumber} onChange={handleChange} required />
                                    <label>Contact Number</label>
                                </div>
                                <div className="form-group">
                                    <input type="date" name="dob" placeholder=" " value={formData.dob} onChange={handleChange} required />
                                    <label>Date of Birth</label>
                                </div>
                            </div>

                            <div className="form-group">
                                <input type="text" name="address" placeholder=" " value={formData.address} onChange={handleChange} required />
                                <label>Address</label>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                                    
                                        <option value="select">Select</option>
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <label>Gender</label>
                                </div>
                                <div className="form-group">
                                    <select name="courseID" value={formData.courseID} onChange={handleChange}  required>
                                      
                                        <option value="select">Select</option>
                                        {courses.length > 0
                                            ? courses.map(course => (
                                                <option key={course.courseID} value={course.courseID}>{course.courseName}</option>
                                            ))
                                            : <option>Loading courses...</option>}
                                    </select>
                                    <label>Select Course</label>
                                </div>
                            </div>

                            {error && <p className="error-message">{error}</p>}

                            <div className="form-actions">
                                <button type="button" className="back-btn" onClick={onBackToLogin}>
                                    &larr; Back to Login
                                </button>
                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? 'Registering...' : 'Register'}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="registration-success-card">
                        <h2>🎉 Registration Successful!</h2>
                        <p>Your account has been created. Please use these credentials to log in.</p>
                        <div className="credentials-display">
                            <p><strong>Student ID:</strong> {successData.studentID}</p>
                            <p><strong>Username:</strong> {successData.username}</p>
                            <p><strong>Password:</strong> {successData.password}</p>
                        </div>
                        <button className="submit-btn" onClick={onBackToLogin}>Go to Login</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegistrationPage;
