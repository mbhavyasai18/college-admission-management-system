import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import './MyProfile.css';

const MyProfile = () => {
    const [profile, setProfile] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({});

    // --- NEW: State to handle multiple file inputs ---
    const [selectedFiles, setSelectedFiles] = useState({
        '10th Marksheet': null,
        'Inter Marksheet': null,
        'Other': null
    });
    const [uploading, setUploading] = useState(null); // Tracks which document is uploading

    useEffect(() => {
        const fetchProfileData = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError("Could not find user ID. Please log in again.");
                setLoading(false);
                return;
            }
            try {
                const [profileRes, documentsRes] = await Promise.all([
                    apiClient.get(`/api/students/${userId}`),
                    apiClient.get(`/api/documents/${userId}`)
                ]);
                setProfile(profileRes.data);
                setFormData(profileRes.data);
                setDocuments(documentsRes.data);
            } catch (err) {
                setError('Failed to load your profile data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditToggle = () => {
        if (isEditMode) {
            handleSaveChanges();
        }
        setIsEditMode(!isEditMode);
    };

    const handleSaveChanges = async () => {
        console.log("Saving data (simulated):", formData);
        setProfile(formData);
        alert("Profile saved successfully (simulated)!");
    };

    // --- NEW: Handle file selection for specific document types ---
    const handleFileChange = (e, docType) => {
        setSelectedFiles(prev => ({ ...prev, [docType]: e.target.files[0] }));
    };

    // --- NEW: Handle file upload for a specific document type ---
    const handleFileUpload = async (docType) => {
        const file = selectedFiles[docType];
        if (!file) {
            alert(`Please select a file for ${docType}.`);
            return;
        }
        setUploading(docType);
        setError('');

        const uploadPayload = {
            studentID: profile.studentID,
            documentType: docType,
            filePath: file.name
        };

        try {
            const response = await apiClient.post('/api/documents/upload', uploadPayload);
            setDocuments(prev => [...prev, response.data]);
            setSelectedFiles(prev => ({ ...prev, [docType]: null }));
            alert(`${docType} uploaded successfully!`);
        } catch (err) {
            setError(`Upload failed for ${docType}.`);
            console.error(err);
        } finally {
            setUploading(null);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Verified': return 'verified';
            case 'Pending': return 'pending';
            case 'Rejected': return 'rejected';
            default: return '';
        }
    };

    // Helper function to render each document upload slot
    const renderDocumentSlot = (docTitle) => {
        const uploadedDoc = documents.find(d => d.documentType === docTitle);
        
        return (
            <div className="document-upload-item" key={docTitle}>
                <div className="doc-info">
                    <span className="doc-title">{docTitle} <span className="mandatory">*</span></span>
                    {uploadedDoc && (
                        <span className={`status-pill small ${getStatusClass(uploadedDoc.verificationStatus)}`}>
                            {uploadedDoc.verificationStatus}
                        </span>
                    )}
                </div>
                {!uploadedDoc || uploadedDoc.verificationStatus === 'Rejected' ? (
                    <div className="doc-action">
                        <input 
                            type="file" 
                            id={`file-${docTitle}`} 
                            onChange={(e) => handleFileChange(e, docTitle)} 
                            accept="application/pdf,image/*"
                        />
                        <button 
                            onClick={() => handleFileUpload(docTitle)} 
                            disabled={!selectedFiles[docTitle] || uploading === docTitle}
                        >
                            {uploading === docTitle ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                ) : (
                    <div className="doc-uploaded">
                        <p>{uploadedDoc.filePath} (Uploaded on {uploadedDoc.uploadDate})</p>
                    </div>
                )}
            </div>
        );
    };

    if (loading) return <p>Loading your profile...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!profile) return <p>Could not find your profile information.</p>;

    return (
        <div className="profile-container">
            <header className="profile-header">
                <h1>My Profile & Documents</h1>
                <p>View your personal details and manage your required documents.</p>
            </header>
            <div className="profile-grid">
                <div className="profile-card details-card">
                    <h3>Personal Information</h3>
                    <div className="details-grid">
                        {isEditMode ? (
                            <>
                                <div className="detail-item"><label>First Name</label><input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} /></div>
                                <div className="detail-item"><label>Last Name</label><input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} /></div>
                                <div className="detail-item full-width"><label>Email Address</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} /></div>
                                <div className="detail-item"><label>Contact Number</label><input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} /></div>
                                <div className="detail-item"><label>Date of Birth</label><input type="date" name="dob" value={formData.dob} onChange={handleInputChange} /></div>
                                <div className="detail-item full-width"><label>Address</label><input type="text" name="address" value={formData.address} onChange={handleInputChange} /></div>
                            </>
                        ) : (
                            <>
                                <div className="detail-item"><label>First Name</label><p>{profile.firstName}</p></div>
                                <div className="detail-item"><label>Last Name</label><p>{profile.lastName}</p></div>
                                <div className="detail-item full-width"><label>Email Address</label><p>{profile.email}</p></div>
                                <div className="detail-item"><label>Contact Number</label><p>{profile.contactNumber}</p></div>
                                <div className="detail-item"><label>Date of Birth</label><p>{profile.dob}</p></div>
                                <div className="detail-item full-width"><label>Address</label><p>{profile.address}</p></div>
                            </>
                        )}
                    </div>
                    <button className="edit-profile-btn" onClick={handleEditToggle}>
                        {isEditMode ? 'Save Changes' : 'Edit Profile'}
                    </button>
                </div>

                <div className="profile-card documents-card">
                    <h3>Required Documents</h3>
                    {/* Render the mandatory document slots */}
                    {renderDocumentSlot('10th Marksheet')}
                    {renderDocumentSlot('Inter Marksheet')}

                    <h3 style={{ marginTop: '2rem' }}>Other Documents</h3>
                    {/* Render a generic slot for other documents */}
                    <div className="document-upload-item">
                        <div className="doc-info">
                            <span className="doc-title">Other Document</span>
                        </div>
                        <div className="doc-action">
                             <input type="file" id="file-Other" onChange={(e) => handleFileChange(e, 'Other')} accept="application/pdf,image/*" />
                             <button onClick={() => handleFileUpload('Other')} disabled={!selectedFiles['Other'] || uploading === 'Other'}>
                                 {uploading === 'Other' ? 'Uploading...' : 'Upload'}
                             </button>
                        </div>
                    </div>
                    <div className="documents-list">
                        {documents.filter(d => !['10th Marksheet', 'Inter Marksheet'].includes(d.documentType)).map(doc => (
                            <div className="document-item" key={doc.documentID}>
                                <div className="document-info">
                                    <span className="document-name">{doc.filePath} ({doc.documentType})</span>
                                    <span className="upload-date">Uploaded: {doc.uploadDate}</span>
                                </div>
                                <div className={`status-pill ${getStatusClass(doc.verificationStatus)}`}>
                                    {doc.verificationStatus}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
