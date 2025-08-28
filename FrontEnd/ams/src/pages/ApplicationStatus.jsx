import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import './ApplicationStatus.css';

const ApplicationStatus = () => {
    const [applicationData, setApplicationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStatus = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError("Could not find user ID. Please log in again.");
                setLoading(false);
                return;
            }

            try {
                const response = await apiClient.get(`/api/admissions/${userId}`);
                if (response.data && response.data.status) {
                    setApplicationData(response.data);
                } else {
                    setApplicationData({ status: 'Not Submitted' });
                }
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setApplicationData({ status: 'Not Submitted' });
                } else {
                    setError('Failed to load application status.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, []);

    if (loading) return <div className="status-container"><p>Loading application status...</p></div>;
    if (error) return <div className="status-container"><p style={{ color: 'red' }}>{error}</p></div>;

    if (!applicationData || applicationData.status === 'Not Submitted') {
        return (
            <div className="status-container">
                <header className="status-header">
                    <h1>My Application Status</h1>
                    <p>You have not submitted an application for a course yet.</p>
                </header>
            </div>
        );
    }

    // Normalize the status string from API/DB
    const status = (applicationData.status || '').trim().toLowerCase();

    // Build timeline dynamically
    let timelineEvents = [
        { title: 'Application Submitted', description: 'Your application has been successfully submitted.' }
    ];

    if (status === 'approved') {
        timelineEvents.push({
            title: 'Admission Approved',
            description: `Congratulations! You have been accepted.${
                applicationData.concession ? ` Concession: ${applicationData.concession}%` : ''
            }`,
            type: 'approved'
        });
    } else if (status === 'rejected') {
        timelineEvents.push({
            title: 'Admission Rejected',
            description: applicationData.rejectionReason
                ? `Reason: ${applicationData.rejectionReason}`
                : 'We regret to inform you that your application could not be approved.',
            type: 'rejected'
        });
    } else {
        // Show "Under Review" only if NOT approved or rejected
        timelineEvents.push({
            title: 'Application Under Review',
            description: 'Our admissions team is reviewing your application.',
            type: 'pending'
        });
    }

    // Determine which steps are completed
    let completedIndex = 0;
    if (status === 'approved' || status === 'rejected') {
        completedIndex = timelineEvents.length - 1; // all steps marked complete
    } else if (status === 'under review') {
        completedIndex = 1;
    } else if (status === 'pending') {
        completedIndex = 0;
    }

    return (
        <div className="status-container">
            <header className="status-header">
                <h1>My Application Status</h1>
                <p>Track your admission journey from submission to approval.</p>
            </header>

            <div className="status-card">
                <div className="status-timeline">
                    {timelineEvents.map((event, index) => (
                        <div
                            key={index}
                            className={`timeline-item ${index <= completedIndex ? 'completed' : ''} ${event.type === 'rejected' ? 'rejected-step' : ''} ${event.type === 'approved' ? 'approved-step' : ''}`}
                        >
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <h3 className="timeline-title">{event.title}</h3>
                                <p className="timeline-date">
                                    {index <= completedIndex ? 'Completed' : 'Pending'}
                                </p>
                                <p className="timeline-description">{event.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ApplicationStatus;
