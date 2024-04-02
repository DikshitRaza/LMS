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
import NotificationAlert from 'react-notification-alert';

const Notifications = () => {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddFacultiesForm, setShowAddFacultiesForm] = useState(false);
  const [newFacultyData, setNewFacultyData] = useState({
    username: '',
    phone: '',
    email: '',
    password: '',
    Category: 'Faculty',
    experience:'',
    subject:''
  });
  const [selectedFacultyIndex, setSelectedFacultyIndex] = useState(null);
  const notificationAlert = React.useRef();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/Faculties');
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

  const notify = (place, username) => {
    const type = 'success';
    const options = {
      place: place,
      message: (
        <div>
          <div>
            User <b>{username}</b> added successfully.
          </div>
        </div>
      ),
      type: type,
      icon: 'nc-icon nc-bell-55',
      autoDismiss: 7,
    };
    notificationAlert.current.notificationAlert(options);
  };

  const handleRemove = async (index) => {
    const updatedTableData = [...tableData];
    const removedItem = updatedTableData.splice(index, 1)[0];
    setTableData(updatedTableData);

    try {
      const response = await fetch(
        `http://localhost:3001/api/removeUser/${removedItem._id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove user from the server');
      }

      console.log(`User ${removedItem.username} removed successfully`);
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  const handleAddFaculties = () => {
    setShowAddFacultiesForm(true);
  };

  const handleEdit = (index) => {
    setNewFacultyData(tableData[index]);
    setSelectedFacultyIndex(index);
    setShowAddFacultiesForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFacultyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveFaculties = async () => {
    try {
      const apiUrl = selectedFacultyIndex !== null
        ? `http://localhost:3001/api/updateFaculty/${tableData[selectedFacultyIndex]._id}`
        : 'http://localhost:3001/api/addFaculties';

      const response = await fetch(apiUrl, {
        method: selectedFacultyIndex !== null ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newFacultyData,
          Category: 'Faculty',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save faculties to the server');
      }

      const updatedData = await response.json();
      if (selectedFacultyIndex !== null) {
        const updatedTableData = [...tableData];
        updatedTableData[selectedFacultyIndex] = updatedData;
        setTableData(updatedTableData);
      } else {
        setTableData([...tableData, updatedData]);
      }

      console.log('Faculties saved successfully');
      notify('tc', 'New Faculty');
      setShowAddFacultiesForm(false);
      setNewFacultyData({
        username: '',
        phone: '',
        email: '',
        password: '',
        Category: 'Faculty',
        experience:'',
        subject:''
      });
      setSelectedFacultyIndex(null);
    } catch (error) {
      console.error('Error saving faculties:', error);
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="content">
        <NotificationAlert ref={notificationAlert} />
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Faculty</CardTitle>
              </CardHeader>
              <CardBody>
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>subject</th>
                      <th>experience</th>
                      <th>Remove</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr key={index}>
                        <td>{row.username}</td>
                        <td>{row.phone}</td>
                        <td>{row.email}</td>
                        <td>{row.subject}</td>
                        <td>{row.experience}</td>
                        <td>
                          <Button
                            color="danger"
                            onClick={() => handleRemove(index)}
                          >
                            Remove
                          </Button>
                        </td>
                        <td>
                          <Button
                            color="info"
                            onClick={() => handleEdit(index)}
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardBody>
                <div className="places-buttons">
                  <Row>
                    <Col md="4">
                      <Button
                        block
                        color="info"
                        onClick={handleAddFaculties}
                      >
                        Add Faculties
                      </Button>
                    </Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {showAddFacultiesForm && (
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">
                    {selectedFacultyIndex !== null ? 'Edit Faculty' : 'Add Faculties'}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <Label for="username">Username:</Label>
                          <Input
                            type="text"
                            id="username"
                            name="username"
                            value={newFacultyData.username}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label for="phone">Phone:</Label>
                          <Input
                            type="text"
                            id="phone"
                            name="phone"
                            value={newFacultyData.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <Label for="email">Email:</Label>
                          <Input
                            type="email"
                            id="email"
                            name="email"
                            value={newFacultyData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="password">Password:</Label>
                          <Input
                            type="password"
                            id="password"
                            name="password"
                            value={newFacultyData.password}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="subject">subject:</Label>
                          <Input
                            type="text"
                            id="subject"
                            name="subject"
                            value={newFacultyData.subject}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="experience">Experience:</Label>
                          <Input
                            type="number"
                            id="experience"
                            name="experience"
                            value={newFacultyData.experience}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Button color="success" onClick={handleSaveFaculties}>
                      {selectedFacultyIndex !== null ? 'Update Faculty' : 'Save Faculties'}
                    </Button>
                    {selectedFacultyIndex !== null && (
                      <Button
                        color="default"
                        className="ml-2"
                        onClick={() => {
                          setShowAddFacultiesForm(false);
                          setSelectedFacultyIndex(null);
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
};

export default Notifications;
