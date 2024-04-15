import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardBody, Row, Col, Table } from "reactstrap";

const ScheduleRow = ({ slNo, date, batchID, time, link }) => {
  return (
    <tr>
      <td>{slNo}</td>
      <td>{date}</td>
      <td>{batchID}</td>
      <td>{time}</td>
      <td><a href={link} target="_blank" rel="noopener noreferrer">{link}</a></td>
    </tr>
  );
};

const ScheduleTable = () => {
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/schedule');
      setScheduleData(response.data);
    } catch (error) {
      console.error('Error fetching schedule data:', error);
    }
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <h5 className="title">Schedule Table</h5>
            </CardHeader>
            <CardBody>
              <Table responsive>
                <thead className="text-primary">
                  <tr>
                    <th>SlNo</th>
                    <th>Date</th>
                    <th>BatchID</th>
                    <th>Time</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((scheduleItem, index) => (
                    <ScheduleRow
                      key={index}
                      slNo={index+1}
                      date={scheduleItem.date}
                      batchID={scheduleItem.selectedBatchId}
                      time={scheduleItem.time}
                      link={scheduleItem.link}
                    />
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ScheduleTable;
