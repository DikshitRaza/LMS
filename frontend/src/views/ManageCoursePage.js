import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests

import { Card, CardHeader, CardBody, CardTitle, Row, Col, Table, Button, Form, FormGroup, Label, Input } from 'reactstrap';

const TableComponent = ({ courses, deleteCourse, editCourse }) => {
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Price</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id}>
              <td>{course.name}</td>
              <td>{course.price}</td>
              <td>{course.duration}</td>
              <td>
                <Button color="danger" onClick={() => deleteCourse(course._id)}>
                  Delete
                </Button>
                {' '}
                <Button color="warning" onClick={() => editCourse(course)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const ManageCoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    price: '',
    duration: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editCourseData, setEditCourseData] = useState(null);

  // Fetch courses from backend when component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditMode(false);
    setEditCourseData(null);
  };

  const addCourse = async () => {
    try {
      const response = await axios.post('http://localhost:3001/courses', newCourse);
      setCourses([...courses, response.data]);
      setNewCourse({ name: '', price: '', duration: '' });
      closeForm();
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const deleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/courses/${id}`);
      setCourses(courses.filter(course => course._id !== id));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };
  

  const startEditCourse = (course) => {
    setEditMode(true);
    setEditCourseData(course);
    setNewCourse({
      name: course.name,
      price: course.price,
      duration: course.duration
    });
    openForm();
  };

  const updateCourse = async () => {
    try {
      await axios.put(`http://localhost:3001/courses/${editCourseData._id}`, newCourse);
      const updatedCourses = courses.map(course =>
        course._id === editCourseData._id ? { ...course, ...newCourse } : course
      );
      setCourses(updatedCourses);
      closeForm();
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h5">Manage Courses</CardTitle>
              <p className="card-category">Add and manage courses</p>
            </CardHeader>
            <CardBody>
              <Button color="primary" onClick={openForm}>Add Course</Button>
              {isFormOpen && (
                <Form>
                  <FormGroup>
                    <Label for="courseName">Course Name:</Label>
                    <Input
                      type="text"
                      id="courseName"
                      name="name"
                      value={newCourse.name}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="price">Price:</Label>
                    <Input
                      type="number"
                      id="price"
                      name="price"
                      value={newCourse.price}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="duration">Duration:</Label>
                    <Input
                      type="text"
                      id="duration"
                      name="duration"
                      value={newCourse.duration}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  <Button color="success" onClick={editMode ? updateCourse : addCourse}>
                    {editMode ? 'Update' : 'Add'}
                  </Button>
                </Form>
              )}

              <TableComponent
                courses={courses}
                deleteCourse={deleteCourse}
                editCourse={startEditCourse}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ManageCoursePage;
