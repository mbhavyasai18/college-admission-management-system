import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import './ApplicationManagement.css';

// --- Icons ---
const ViewIcon = () => <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>;
const ApproveIcon = () => <svg viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>;
const RejectIcon = () => <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>;
const CloseIcon = () => <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>;

const ApplicationManagement = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [concession, setConcession] = useState(0);

    // --- IDHE FINAL FIX ---
    // Ee function mundu anni applications ni, tarvata students ni techukuni, renditini kaluputundi.
    const fetchApplicationsAndStudents = async () => {
        try {
            setLoading(true);
            // Rendu API calls ni okesari cheddam
            const [admissionsRes, studentsRes] = await Promise.all([
                apiClient.get('/api/admissions'),
                apiClient.get('/api/students')
            ]);

            const admissions = Array.isArray(admissionsRes.data) ? admissionsRes.data : [];
            const students = Array.isArray(studentsRes.data) ? studentsRes.data : [];

            // Student data ni oka map lo pettukundam, easy ga access cheyadaniki
            const studentMap = students.reduce((map, student) => {
                map[student.studentID] = `${student.firstName} ${student.lastName}`;
                return map;
            }, {});

            // Ippudu, prathi application ki student peru ni add cheddam
            const enrichedApplications = admissions.map(app => ({
                ...app,
                studentName: studentMap[app.studentID] || 'Unknown Student'
            }));

            setApplications(enrichedApplications);

        } catch (err) {
            setError('Failed to load application data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicationsAndStudents();
    }, []);

    const handleProcessApplication = async (studentId, statusToSet) => {
        if (!window.confirm(`Are you sure you want to ${statusToSet} this application?`)) return;
        
        const payload = { studentID: studentId, status: statusToSet, concession: statusToSet === 'Approved' ? concession : 0 };
        try {
            await apiClient.post('/api/admissions/process', payload);
            alert(`Application has been successfully ${statusToSet}.`);
            fetchApplicationsAndStudents(); // Data ni refresh cheyadaniki
            handleCloseModal();
        } catch (err) {
            alert('Failed to process the application.');
        }
    };

    const handleViewDetails = (app) => {
        setSelectedApp(app);
        setIsModalOpen(true);
        setConcession(app.concession || 0);
    };
    
    const handleCloseModal = () => setIsModalOpen(false);

    const getStatusClass = (status) => {
        if (status === 'Approved') return 'status-approved';
        if (status === 'Rejected') return 'status-rejected';
        return 'status-pending';
    };
    
    if (loading) return <p>Loading applications...</p>;
    if (error) return <p style={{color: 'red'}}>{error}</p>;

    return (
        <div className="app-management-container">
            <header className="app-header">
                <h1>Application Management</h1>
                <p>Review, approve, or reject student admission applications.</p>
            </header>

            <div className="apps-table-container">
                <table className="apps-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Course ID</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.length > 0 ? (
                            applications.map((app) => (
                                <tr key={app.studentID}>
                                    <td>{app.studentID}</td>
                                    <td>{app.studentName}</td>
                                    <td>{app.courseID}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="action-btn view-btn" onClick={() => handleViewDetails(app)}>
                                            <ViewIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>No applications found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && selectedApp && (
                <div className="modal-overlay">
                    <div className="modal-content large">
                        <header className="modal-header">
                            <h2>Application Details: {selectedApp.studentName}</h2>
                            <button className="close-btn" onClick={handleCloseModal}><CloseIcon /></button>
                        </header>
                        <div className="app-details-content">
                            <p><strong>Student ID:</strong> {selectedApp.studentID}</p>
                            <p><strong>Student Name:</strong> {selectedApp.studentName}</p>
                            <p><strong>Course:</strong> {selectedApp.courseID}</p>
                            <p><strong>Current Status:</strong> {selectedApp.status}</p>

                            <h4 className="details-subtitle">Approve with Concession</h4>
                            <div className="concession-form">
                                <input 
                                    type="number" 
                                    placeholder="Enter Concession %" 
                                    value={concession}
                                    onChange={(e) => setConcession(Number(e.target.value))}
                                />
                                <button className="action-btn approve-btn" onClick={() => handleProcessApplication(selectedApp.studentID, 'Approved')}>
                                    <ApproveIcon /> Approve
                                </button>
                            </div>
                            
                            <h4 className="details-subtitle">Reject Application</h4>
                            <button className="action-btn reject-btn" onClick={() => handleProcessApplication(selectedApp.studentID, 'Rejected')}>
                                <RejectIcon /> Reject Application
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationManagement;