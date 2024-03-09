import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Table } from 'reactstrap';

const TableComponent = () => {
  const [tableData, setTableData] = useState([
    { username: 'JohnDoe', phone: '555-1234', email: 'john@example.com', category: 'Admin' },
    { username: 'JaneSmith', phone: '555-5678', email: 'jane@example.com', category: 'User' },
    // Add more data as needed
  ]);

  return (
    <Table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => (
          <tr key={index}>
            <td>{row.username}</td>
            <td>{row.phone}</td>
            <td>{row.email}</td>
            <td>{row.category}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const Icons = () => {
  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h5">User Table</CardTitle>
              <p className="card-category">Displaying user data in a table</p>
            </CardHeader>
            <CardBody>
              <TableComponent />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Icons;
