import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../apiClient'; // Import the API client
import './StudentDatabase.css';

// --- Icons ---
const SearchIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 
    6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 
    4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 
    9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

const StudentDatabase = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await apiClient.get('/api/students');
        setAllStudents(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Failed to load student database.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Search filter
  const filteredStudents = useMemo(() => {
    if (!searchTerm) return allStudents;
    return allStudents.filter(student =>
      (student.firstName && student.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.lastName && student.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.studentID && student.studentID.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.contactNumber && student.contactNumber.toString().includes(searchTerm)) ||
      (student.courseID && student.courseID.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, allStudents]);

  if (loading) return <p>Loading student database...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="student-db-container">
      <header className="student-db-header">
        <h1>Student Database</h1>
        <div className="search-bar">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by name, ID, email, contact or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>Contact No.</th>
              <th>Enrolled Course</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <tr key={student.studentID}>
                  <td>{student.studentID}</td>
                  <td>{student.firstName + " " + student.lastName}</td>
                  <td>{student.email}</td>
                  <td>{student.contactNumber}</td>
                  <td>{student.courseID}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentDatabase;
