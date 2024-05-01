import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card, CardBody, CardFooter, Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [subscribedCourses, setSubscribedCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:3001/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const fetchSubscribedCourses = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/subscribedCourses");
        setSubscribedCourses(response.data);
      } catch (error) {
        console.error("Error fetching subscribed courses:", error);
      }
    };

    // Fetch courses initially
    fetchCourses();
    fetchSubscribedCourses();

    // Polling mechanism to fetch courses periodically
    const interval = setInterval(() => {
      fetchCourses();
      fetchSubscribedCourses();
    }, 5000); // Adjust the polling interval as needed

    return () => clearInterval(interval); // Cleanup
  }, []);

  const toggle = () => setModal(!modal);

  const handleSubscribe = async () => {
    if (selectedCourse) {
      try {
        // Send a POST request to the server to store subscription details
        await axios.post("http://localhost:3001/api/subscribedCourses", selectedCourse);
        toggle(); // Close the modal after handling subscription
        
        // Fetch subscribed courses after successful subscription
        const response = await axios.get("http://localhost:3001/api/subscribedCourses");
        setSubscribedCourses(response.data);
      } catch (error) {
        console.error('Error subscribing to course:', error);
      }
    }
  };

  const handleView = (course) => {
    // Implement view functionality here
    console.log("Viewing course:", course);
  };

  const handleDelete = async (courseId) => {
    try {
      // Send a DELETE request to the server to delete the course
      await axios.delete(`http://localhost:3001/api/subscribedCourses/${courseId}`);
      
      // Update the state to reflect the changes by filtering out the deleted course
      setSubscribedCourses(prevCourses => prevCourses.filter(course => course._id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <>
      <div className="content">
        <Row>
          {courses.map((course, index) => (
            <Col key={index} lg="3" md="6" sm="6">
              <div style={{ display: 'flex', flexDirection: 'column', height: '200px' }}>
                <Card style={{ height: '100%' }}>
                  <CardBody>
                    <Row>
                      <Col md="4" xs="5">
                        <div className="icon-big text-center icon-warning" style={{ width: '100px', height: '100px' }}>
                          <FontAwesomeIcon icon={faBook} className="book-icon" style={{ fontSize: '50px' }} />
                        </div>
                      </Col>
                      <Col md="8" xs="7">
                        <div className="course-details">
                          <h4>{course.name}</h4>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter className="text-center">
                    <hr />
                    <div className="subscribe-button">
                      <Button color="danger" onClick={() => { setSelectedCourse(course); toggle(); }}>Subscribe</Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </Col>
          ))}
        </Row>
        {/* Table */}
        <Row>
          <Col>
            <Table>
              <thead>
                <tr>
                  <th>S No.</th>
                  <th>Course</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>View</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {subscribedCourses.map((course, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{course.name}</td>
                    <td>{course.price}</td>
                    <td>{course.duration}</td>
                    <td>
                      <Button color="info" onClick={() => handleView(course)}>View</Button>
                    </td>
                    <td>
                      <Button color="danger" onClick={() => handleDelete(course._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
      {/* Modal */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Subscribe Confirmation</ModalHeader>
        <ModalBody>
          Are you sure you want to subscribe to this course?
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={handleSubscribe}>
            Yes, Subscribe
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Courses;
