import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [studentId, setStudentId] = useState('');
  const [studentInfo, setStudentInfo] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [results, setResults] = useState([]);
  const [showSemesters, setShowSemesters] = useState(false);

  const fetchStudentInfo = async (e) => {
    e.preventDefault();
    if (studentId.trim() === '') {
      alert('Please enter a valid student ID.');
      return;
    }

    try {
      const response = await axios.post('https://diu-student-result-portal.onrender.com/api/students/info', {
        studentId
      });
      setStudentInfo(response.data);
      setShowSemesters(true);
    } catch (error) {
      console.error('Error fetching student info:', error);
    }
  };

  const fetchSemesters = async () => {
    try {
      const response = await axios.get('https://diu-student-result-portal.onrender.com/api/students/semesters');
      setSemesters(response.data);
    } catch (error) {
      console.error('Error fetching semesters:', error);
    }
  };

  const fetchResults = async () => {
    if (!selectedSemester) {
      alert('Please select a semester.');
      return;
    }

    try {
      const response = await axios.post('https://diu-student-result-portal.onrender.com/api/students/semester-results', {
        studentId,
        semesterId: selectedSemester
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  return (
    <div className="container">
      <h1>Student Result Portal</h1>

      <form onSubmit={fetchStudentInfo}>
        <input
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      {studentInfo && (
        <div>
          <h2>Student Information</h2>
          <p><strong>ID:</strong> {studentInfo.studentId}</p>
          <p><strong>Name:</strong> {studentInfo.studentName}</p>
          <p><strong>Campus:</strong> {studentInfo.campusName}</p>
          <p><strong>Program:</strong> {studentInfo.programName}</p>
          <p><strong>Semester:</strong> {studentInfo.semesterName}</p>

          <button onClick={fetchSemesters}>Get Result</button>
        </div>
      )}

      {showSemesters && semesters.length > 0 && (
        <div>
          <h2>Select Semester</h2>
          <select onChange={(e) => setSelectedSemester(e.target.value)}>
            <option value="">Select a Semester</option>
            {semesters.map((semester) => (
              <option key={semester.semesterId} value={semester.semesterId}>
                {semester.semesterName} {semester.semesterYear}
              </option>
            ))}
          </select>
          <button onClick={fetchResults}>Submit</button>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h2>Results</h2>
          <table>
            <thead>
              <tr>
                <th>Course Title</th>
                <th>Credit</th>
                <th>Grade Point</th>
                <th>Grade Letter</th>
                <th>CGPA</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.courseTitle}</td>
                  <td>{result.courseCredit}</td>
                  <td>{result.gradePoint}</td>
                  <td>{result.gradeLetter}</td>
                  <td>{result.totalCgpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;