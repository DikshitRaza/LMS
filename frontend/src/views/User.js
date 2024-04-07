import React, { useEffect, useState } from "react";
import axios from 'axios';
//import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Card,
  CardBody,
  Row,
  Col,
  Table
} from "reactstrap";
//simport "./User.css"; // Import your custom CSS file
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

function User() {
  const email = sessionStorage.getItem("email");
  const [userList, setUserList] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    phone: ''
  });
  const [editing, setEditing] = useState(false); // State to manage edit mode

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3001/Profile', { params: { email } });
        setUserList(response.data);
        console.log("Fetched data:", response.data);
      } catch (error) {
        console.error(error);
        setError("Error fetching data");
      }
    }

    fetchData();
  }, [email]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditClick = () => {
    setEditing(true); // Enable edit mode
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/update-profile', {
        email,
        username: formData.username,
        phone: formData.phone
      });
      console.log("Profile updated successfully:", response.data);
      setEditing(false); // Disable edit mode after saving changes
    } catch (error) {
      console.error("Error updating profile:", error);
      // You can display an error message or handle errors as needed
    }
  };

  return (
    <div className="content">
      <Row className="justify-content-center">
        <Col md="6">
          <Card className="card-user" style={{ height: '500px' }}> {/* Increased height */}
            <div className="image">
              <img alt="..." src={require("assets/img/damir-bosnjak.jpg")} />
            </div>
            {error && <div>Error: {error}</div>}
            {!editing && userList.map((userData, index) => (
              <CardBody key={index} className="user-card-body">
                <div className="author">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar border-gray"
                      src={require("assets/img/mike.jpg")}
                      style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                    />
                    <h5 className="title text-danger">{userData.username}</h5>
                  </a>
                  <br />
                  <div className="container">
                    <Table>
                      <tbody>
                        <tr>
                          <td>Email</td>
                          <td>{userData.email}</td>
                        </tr>
                        <tr>
                          <td>Phone</td>
                          <td>{userData.phone}</td>
                        </tr>
                        <tr>
                          <td>Category</td>
                          <td>{userData.category}</td>
                        </tr>
                      </tbody>
                    </Table>
                    <div> {/* Remove text-center class */}
                      <Button color="danger" style={{ width: '150px' }} onClick={handleEditClick}> Edit Profile </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            ))}
            {editing && (
              <CardBody className="user-card-body">
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="username">Name</Label>
                    <Input type="text" name="username" id="username" placeholder="Enter your Name" value={formData.username} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="phone">Phone</Label>
                    <Input type="text" name="phone" id="phone" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} />
                  </FormGroup>
                  <div> {/* Remove text-center class */}
                    <Button color="primary" style={{ width: '150px' }} type="submit"> Save Changes </Button>
                    <Button color="secondary" style={{ width: '150px', marginLeft: '20px' }} onClick={() => setEditing(false)}> Go Back </Button>
                  </div>
                </Form>
              </CardBody>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default User;