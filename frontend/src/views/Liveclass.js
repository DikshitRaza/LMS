import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Table, Button, Form, FormGroup, Label, Input } from 'reactstrap';

const BatchTable = ({ batches }) => {
  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th>Batch ID</th>
          <th>Subject</th>
        </tr>
      </thead>
      <tbody>
        {batches.map(batch => (
          <tr key={batch._id}>
            <td>{batch.batchID}</td>
            <td>{batch.subject}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const Liveclass = () => {
  const email = sessionStorage.getItem("email");
  const [loggedInUserName, setLoggedInUserName] = useState('');
  const [enrolledBatches, setEnrolledBatches] = useState([]);

  useEffect(() => {
    fetchLoggedInUserInfo();
  }, [email]);

  const fetchLoggedInUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:3001/userInfo', { params: { email } });
      const userData = response.data[0];
      setLoggedInUserName(userData.username);

      const batchResponse = await axios.get('http://localhost:3001/fetchBatches', { params: { username: userData.username } });
      const userBatches = batchResponse.data.filter(batch => batch.enrolledStudents.includes(userData.username));
      setEnrolledBatches(userBatches);
    } catch (error) {
      console.error('Error fetching user information:', error);
    }
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h5">Enrolled Batches</CardTitle>
            </CardHeader>
            <CardBody>
              <BatchTable batches={enrolledBatches} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Liveclass;
