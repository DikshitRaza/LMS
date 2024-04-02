import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Form,
  Button,
  Table,
} from "reactstrap";
import validator from 'validator';

function Tables() {
  const [faculties, setFaculties] = useState([]);
  const [faculty, setFaculty] = useState("");
  const [link, setLink] = useState("");
  const [date, setDate] = useState("");
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [batchIDs, setBatchIDs] = useState([]);

  useEffect(() => {
    fetchFaculties();
    fetchBatches();
    fetchBatchIDs();
  }, []);

  const fetchFaculties = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/faculties");
      const data = await response.json();
      setFaculties(data);
    } catch (error) {
      console.error("Error fetching faculties:", error);
    }
  };
  
  const fetchBatches = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/batches");
      const data = await response.json();
      setBatches(data);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const fetchBatchIDs = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/selectBatch");
      if (!response.ok) {
        throw new Error(`Failed to fetch batch IDs: ${response.statusText}`);
      }
      const data = await response.json();
      setBatchIDs(data);
    } catch (error) {
      console.error("Error fetching batch IDs:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validator.isURL(link)) {
      console.error('Invalid URL');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/batches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedBatchId, faculty, link, date }),
      });

      if (response.ok) {
        console.log('Batch added successfully!');
        setFaculty('');
        setLink('');
        setDate('');
        fetchBatches();
      } else {
        console.error('Failed to add batch:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding batch:', error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/deletebatchess`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Batch deleted successfully!');
        fetchBatches();
      } else {
        console.error('Failed to delete batch:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting batch:', error.message);
    }
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Manage Schedule</CardTitle>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="selectedBatchId">Select Batch ID</Label>
                  <Input
                    type="select"
                    name="selectedBatchId"
                    id="selectedBatchId"
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                  >
                    <option value="">Select Batch ID</option>
                    {batchIDs.map((batchID) => (
                      <option key={batchID._id} value={batchID.batchID}>
                        {batchID.batchID}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="faculty">Faculty</Label>
                  <Input
                    type="select"
                    name="faculty"
                    id="faculty"
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                  >
                    <option value="">Select Faculty</option>
                    {faculties.map((fac) => (
                      <option key={fac._id} value={fac.username}>
                        {fac.username}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="link">Link</Label>
                  <Input
                    type="text"
                    name="link"
                    id="link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="date">Date</Label>
                  <Input
                    type="date"
                    name="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </FormGroup>
                <Button color="primary" type="submit">
                  Add Schedule
                </Button>
              </Form>
              <Table>
                <thead>
                  <tr>
                    <th>Batch ID</th>
                    <th>Faculty</th>
                    <th>Link</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((batch) => (
                    <tr key={batch._id}>
                      <td>{batch.selectedBatchId}</td>
                      <td>{batch.faculty}</td>
                      <td>{batch.link}</td>
                      <td>{batch.date}</td>
                      <td>
                        <Button color="danger" onClick={() => handleDelete(batch._id)}>Delete</Button>
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

export default Tables;
