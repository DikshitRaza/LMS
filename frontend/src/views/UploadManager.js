import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Button, Form, FormGroup, Label, Input, Table } from 'reactstrap';
import axios from 'axios';

function UploadManager() {
  const [questionFormOpen, setQuestionFormOpen] = useState(false);
  const [notesFormOpen, setNotesFormOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [file, setFile] = useState(null);
  const [questionPapers, setQuestionPapers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [batches, setBatches] = useState([]); // State to store
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchQuestionPapers();
    fetchNotes();
    fetchBatches(); // Fetch batches when component mounts
    fetchSubjects();
    fetchCourses();
  }, []);

  const fetchSubjects = () => {
    axios.get('http://localhost:3001/subjects')
      .then(response => {
        setSubjects(response.data);
      })
      .catch(error => {
        console.error('Error fetching subjects:', error);
      });
  };

  const fetchCourses = () => {
    axios.get('http://localhost:3001/courses')
      .then(response => {
        setCourses(response.data);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });
  };

  const fetchQuestionPapers = () => {
    axios.get('http://localhost:3001/questionPapers')
      .then(response => {
        setQuestionPapers(response.data);
      })
      .catch(error => {
        console.error('Error fetching question papers:', error);
      });
  };

  const fetchNotes = () => {
    axios.get('http://localhost:3001/notes')
      .then(response => {
        setNotes(response.data);
      })
      .catch(error => {
        console.error('Error fetching notes:', error);
      });
  };

  const fetchBatches = () => {
    axios.get('http://localhost:3001/batchesiDS') // Assuming you have a route to fetch batches
      .then(response => {
        setBatches(response.data);
      })
      .catch(error => {
        console.error('Error fetching batches:', error);
      });
  };


  const handleQuestionFormOpen = () => {
    setQuestionFormOpen(true);
    setNotesFormOpen(false);
  };

  const handleNotesFormOpen = () => {
    setNotesFormOpen(true);
    setQuestionFormOpen(false);
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    // Prepare data to be sent to the backend
    const formData = new FormData();
    formData.append('batch', selectedBatch);
    formData.append('subject', selectedSubject);
    formData.append('course', selectedCourse);
    formData.append('type', selectedType);
    formData.append('file', file);

    // Make a POST request to the backend API endpoint
    axios.post('http://localhost:3001/upload', formData)
      .then(response => {
        console.log('File uploaded successfully');
        // Reset form fields
        setFile(null);
        setSelectedBatch('');
        setSelectedSubject('');
        setSelectedCourse('');
        setSelectedType('');
        // Fetch updated data
        fetchQuestionPapers();
        fetchNotes();
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  };

  const handleQuestionUpload = () => {
    const formData = new FormData();
    formData.append('batch', selectedBatch);
    formData.append('subject', selectedSubject);
    formData.append('file', file);

    axios.post('http://localhost:3001/uploadQuestion', formData)
      .then(response => {
        console.log('Question paper uploaded successfully');
        setFile(null);
        setSelectedBatch('');
        setSelectedSubject('');
        // Fetch updated data
        fetchQuestionPapers();
      })
      .catch(error => {
        console.error('Error uploading question paper:', error);
      });
  };

  const handleDelete = (id, type) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      axios.delete(`http://localhost:3001/${type}/${id}`)
        .then(response => {
          console.log('File deleted successfully');
          if (type === 'questionPapers') {
            fetchQuestionPapers();
          } else if (type === 'notes') {
            fetchNotes();
          }
        })
        .catch(error => {
          console.error('Error deleting file:', error);
        });
    }
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h5">Upload Manager</CardTitle>
              <p className="card-category">Add and manage uploads</p>
            </CardHeader>
            <CardBody>
              <Button color="primary" onClick={handleQuestionFormOpen}>Add Question</Button>
              <Button color="primary" onClick={handleNotesFormOpen}>Add Notes</Button>

              {questionFormOpen && (
                <div>
                  <h2>Upload Question Paper</h2>
                  <Form>
                  <FormGroup>
                      <Label for="batchSelect">Select Batch:</Label>
                      <Input type="select" id="batchSelect" value={selectedBatch} onChange={handleBatchChange}>
                        <option value="">Select Batch</option>
                        {batches.map(batch => (
                          <option key={batch._id} value={batch.batchID}>{batch.batchID}</option>
                        ))}
                      </Input>
                    </FormGroup>
                    <FormGroup>
        <Label for="subjectSelect">Select Subject:</Label>
        <Input type="select" id="subjectSelect" value={selectedSubject} onChange={handleSubjectChange}>
          <option value="">Select Subject</option>
          {subjects.map(subject => (
            <option key={subject._id} value={subject.subject}>{subject.subject}</option>
          ))}
        </Input>
      </FormGroup>
                    <FormGroup>
                      <Label for="questionPaperInput">Upload Question Paper:</Label>
                      <Input type="file" id="questionPaperInput" accept=".pdf,.xlsx,.xls" onChange={handleFileChange} />
                    </FormGroup>
                    <Button color="success" onClick={handleQuestionUpload}>Upload Question Paper</Button>
                  </Form>
                </div>
              )}

              {notesFormOpen && (
                <div>
                  <h2>Add Notes</h2>
                  <Form>
                  <FormGroup>
                  <Label for="courseSelect">Select Course:</Label>
                <Input type="select" id="courseSelect" value={selectedCourse} onChange={handleCourseChange}>
                   <option value="">Select Course</option>
                  {courses.map(course => (
                 <option key={course._id} value={course.name}>{course.name}</option>
                   ))}
                  </Input>
                </FormGroup>
                    <FormGroup>
                      <Label for="typeSelect">Select Type:</Label>
                      <Input type="select" id="typeSelect" value={selectedType} onChange={handleTypeChange}>
                        <option value="">Select Type</option>
                        <option value="video">Video</option>
                        <option value="document">Document</option>
                      </Input>
                    </FormGroup>
                    {selectedType === 'video' && (
                      <FormGroup>
                        <Label for="videoInput">Upload Video:</Label>
                        <Input type="file" id="videoInput" accept="video/*" onChange={handleFileChange} />
                      </FormGroup>
                    )}
                    {selectedType === 'document' && (
                      <FormGroup>
                        <Label for="documentInput">Upload Document:</Label>
                        <Input type="file" id="documentInput" accept=".pdf,.xlsx,.xls" onChange={handleFileChange} />
                      </FormGroup>
                    )}
                    <Button color="success" onClick={handleUpload}>Upload</Button>
                  </Form>
                </div>
              )}

              <div style={{ backgroundColor: '', padding: '20px', marginBottom: '20px' }}>
                {/* Display question papers in a table */}
                <h2>Question Papers</h2>
                <Table>
                  <thead>
                    <tr>
                      <th>Batch</th>
                      <th>Subject</th>
                      <th>Download Link</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questionPapers.map(paper => (
                      <tr key={paper._id}>
                        <td>{paper.batch}</td>
                        <td>{paper.subject}</td>
                        <td>
                        <a href={`http://localhost:3001/${paper.filePath}`} target="_blank" rel="noopener noreferrer">Download</a>
                        </td>
                        <td>
                          <Button color="danger" onClick={() => handleDelete(paper._id, 'questionPapers')}>Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div style={{ backgroundColor: '', padding: '20px', marginBottom: '20px' }}>
                {/* Display notes in a table */}
                <h2>Notes</h2>
                <Table>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Filename</th>
                      <th>Download Link</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notes.map(note => (
                      <tr key={note._id}>
                        <td>{note.course}</td>
                        <td>{note.fileName}</td>
                        <td>
                        <a href={`http://localhost:3001/${note.filePath}`} target="_blank" rel="noopener noreferrer">Download</a>
                        </td>
                        <td>
                          <Button color="danger" onClick={() => handleDelete(note._id, 'notes')}>Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default UploadManager;
