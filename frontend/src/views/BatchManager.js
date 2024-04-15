import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Table, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import './BatchManager.css';

const TableComponent = ({ batches, deleteBatch }) => {
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Batch ID</th>
            <th>Subject</th>
            <th>Enrolled Students</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch) => (
            <tr key={batch._id}>
              <td>{batch.batchID}</td>
              <td>{batch.subject}</td>
              <td>
                <ul>
                  {batch.enrolledStudents.map((student, index) => (
                    <li key={index}>{student}</li>
                  ))}
                </ul>
              </td>
              <td>
                <Button color="danger" onClick={() => deleteBatch(batch._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const BatchManagerPage = () => {
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5); // Adjust as needed
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newBatch, setNewBatch] = useState({
    batchID: '',
    subject: '',
    enrolledStudents: []
  });

  useEffect(() => {
    fetchSubjects();
    fetchBatches();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:3001/fetchSubjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await axios.get('http://localhost:3001/fetchBatches');
      setBatches(response.data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/fetchStudents`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const deleteBatch = async (batchID) => {
    try {
      await axios.delete(`http://localhost:3001/deleteBatch/${batchID}`);
      setBatches(batches.filter(batch => batch._id !== batchID));
    } catch (error) {
      console.error('Error deleting batch:', error);
    }
  };

  const handleSubjectChange = async (event) => {
    const selectedSubject = event.target.value;
    setSelectedSubject(selectedSubject);
    setNewBatch(prevBatch => ({
      ...prevBatch,
      batchID: `${selectedSubject}_batch_${String(batches.length + 1).padStart(4, '0')}`,
      subject: selectedSubject
    }));
    await fetchStudents(selectedSubject);
  };

  const handleCheckboxChange = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:3001/addBatch', { ...newBatch, enrolledStudents: selectedStudents });
      setBatches([...batches, { ...newBatch, enrolledStudents: selectedStudents }]);
      setIsFormOpen(false);
      setNewBatch({ batchID: '', subject: '', enrolledStudents: [] });
    } catch (error) {
      console.error('Error adding batch:', error);
    }
  };

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h5">Manage Batches</CardTitle>
              <p className="card-category">Add and manage batches</p>
            </CardHeader>
            <CardBody>
              <Button color="primary" onClick={() => setIsFormOpen(true)}>Add Batch</Button>
              {isFormOpen && (
                <Form>
                  <Row form>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="subject">Select Subject:</Label>
                        <Input type="select" id="subject" value={selectedSubject} onChange={handleSubjectChange}>
                          <option value="">Select</option>
                          {subjects.map(subject => (
                            <option key={subject._id} value={subject.name}>{subject.name}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="batchID">Batch ID:</Label>
                        <Input type="text" id={newBatch.batchID} value={newBatch.batchID} disabled />
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup>
                  <div className="additional-info-box">
    {/* Content for the additional box */}
 
                    {/* Student pagination and checkboxes */}
                    <div className="scrollable-container">
                      <Label>Enroll Students:</Label>
                      <div className="student-checkboxes">
                        {currentStudents.map(student => (
                          <div className="student-checkbox" key={student._id}>
                            <input
                              type="checkbox"
                              id={student._id}
                              checked={selectedStudents.includes(student.username)}
                              onChange={() => handleCheckboxChange(student.username)}
                            />
                            <label htmlFor={student.username}>{student.username}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                     </div>
                  </FormGroup>
                  
                  {/* Pagination component */}
                  <nav>
                    <ul className="pagination">
                      {students.map((student, index) => (
                        <li key={index} className="page-item">
                         <button onClick={() => paginate(index + 1)} className="page-link">
                                  {index + 1}
                             </button>

                        </li>
                      ))}
                    </ul>
                  </nav>
                  <Button color="success" onClick={handleSubmit} disabled={!selectedSubject || selectedStudents.length === 0}>Add</Button>
                </Form>
              )}
              <TableComponent
                batches={batches}
                deleteBatch={deleteBatch}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BatchManagerPage;
