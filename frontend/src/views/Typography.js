import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardBody, Row, Col, Table, FormGroup, Label, Input, Button } from "reactstrap";

function Typography() {
  const [batchId, setBatchId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [questionsFile, setQuestionsFile] = useState("");
  const [exams, setExams] = useState([]);
  const [batchIds, setBatchIds] = useState([]);

  useEffect(() => {
    fetchExams();
    fetchBatchIds();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/exams");
      setExams(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  const fetchBatchIds = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/batchIds");
      setBatchIds(response.data);
    } catch (error) {
      console.error("Error fetching batch IDs:", error);
    }
  };

  const handleAddExam = async () => {
    const formData = new FormData();
    formData.append('batchId', batchId);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('questionsFile', questionsFile);

    try {
      const response = await axios.post("http://localhost:3001/api/add-exam", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        await fetchExams();
      } else {
        console.error('Failed to add exam');
      }
    } catch (error) {
      console.error('Error adding exam:', error);
    }

    setBatchId("");
    setDate("");
    setTime("");
    setQuestionsFile("");
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <h5 className="title">Add Exam</h5>
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label for="batchId">Batch ID:</Label>
                <Input
                  type="select"
                  id="batchId"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                >
                  <option value="">Select Batch ID</option>
                  {batchIds.map((BatchIds, index) => (
                    <option key={index} value={BatchIds}>{BatchIds}</option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="date">Date:</Label>
                <Input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="time">Time:</Label>
                <Input
                  type="time"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="questionsFile">Upload Questions:</Label>
                <Input
                  type="file"
                  id="questionsFile"
                  onChange={(e) => setQuestionsFile(e.target.files[0])}
                />
              </FormGroup>
              <Button color="primary" onClick={handleAddExam}>Add Exam</Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <h5 className="title">Added Exams</h5>
            </CardHeader>
            <CardBody>
              <Table responsive>
                <thead className="text-primary">
                  <tr>
                    <th>Batch ID</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Questions File</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam, index) => (
                    <tr key={index}>
                      <td>{exam.batchId}</td>
                      <td>{exam.date}</td>
                      <td>{exam.time}</td>
                      <td>
                        <a href={exam.questionsFile} target="_blank" rel="noopener noreferrer">View PDF</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Typography;
