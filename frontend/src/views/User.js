import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
  Card,
  CardBody,
  CardFooter,
  Row,
  Col,
} from "reactstrap";

function User() {
  const email = sessionStorage.getItem("email");
  const [userList, setUserList] = useState([]);
  const [error, setError] = useState(null);

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


  return (
    <>
      <div className="content">
        <Row>
          <Col md="4">
            <Card className="card-user">
              <div className="image">
                <img alt="..." src={require("assets/img/damir-bosnjak.jpg")} />
              </div>
              {error && <div>Error: {error}</div>}
              {userList.map((userData, index) => (
                <CardBody key={index}>
                  <div className="author">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="avatar border-gray"
                        src={require("assets/img/mike.jpg")}
                      />
                      <h5 className="title">{userData.email}</h5>
                    </a>
                    <p className="description">First Name: {userData.username}</p>
                    <p className="description">Phone: {userData.phone}</p>
                    <p className="description">User Type: {userData.category}</p>
                  </div>
                </CardBody>
              ))}
              <CardFooter>
                <hr />
                <div className="button-container">
                  {/* You can add additional buttons or components here */}
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default User;
