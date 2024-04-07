// Icons.js

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Table,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

const TableComponent = ({ onRemove }) => {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/users');
        if (!response.ok) {
      
          throw new Error('Data could not be fetched!');
        }
        const data = await response.json();
        setTableData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRemove = async (index) => {
    const updatedTableData = [...tableData];
    const removedItem = updatedTableData.splice(index, 1)[0];
    setTableData(updatedTableData);

    try {
      const response = await fetch(`http://localhost:3001/api/removeUser/${removedItem._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove user from the server');
      }

      console.log(`User ${removedItem.username} removed successfully`);
    } catch (error) {
      console.error('Error removing user:', error);
      // Handle error as needed
    }

    onRemove(updatedTableData);
  };

  if (error) return <div>Error: {error}</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.username}</td>
              <td>{row.phone}</td>
              <td>{row.email}</td>
              <td>
                <Button color="danger" onClick={() => handleRemove(index)}>
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const Icons = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: '',
    phone: '',
    email: '',
  });

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const handleRemove = (updatedTableData) => {
    // Handle removal logic if needed
    console.log('Updated Table Data:', updatedTableData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newUserData,
          Category: 'Student', // Default category is set to 'student'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add user to the server');
      }

      const addedUser = await response.json();
      console.log(`User ${addedUser.name} added successfully`);

      // Close the form and update the table data
      closeForm();
    } catch (error) {
      console.error('Error adding user:', error);
      // Handle error as needed
    }
  };

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
              <Button color="primary" onClick={openForm}>
                Add Student
              </Button>

              {isFormOpen && (
                <Form>
                  <FormGroup>
                    <Label for="name">Name:</Label>
                    <Input
                      type="text"
                      id="name"
                      name="username"
                      value={newUserData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="phone">Phone:</Label>
                    <Input
                      type="text"
                      id="phone"
                      name="phone"
                      value={newUserData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="email">Email:</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={newUserData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">password:</Label>
                    <Input
                      type="password"
                      id="password"
                      name="email"
                      value={newUserData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  <Button color="success" onClick={handleSave}>
                    Save
                  </Button>
                </Form>
              )}

              <TableComponent onRemove={handleRemove} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Icons;