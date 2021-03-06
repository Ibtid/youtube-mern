import React, { useEffect, useState } from 'react';
import { Card, Avatar, Col, Typography, Row } from 'antd';
import axios from 'axios';
import moment from 'moment';
const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get('/api/video/getVideos').then((response) => {
      if (response.data.success) {
        console.log(response.data.videos);
        setVideos(response.data.videos);
      } else {
        alert('Failed to get videos');
      }
    });
  }, []);

  const renderCards = videos.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);
    return (
      <Col lg={6} md={8} xs={24}>
        <div style={{ margin: '2px' }}>
          <a href={`/video/${video._id}`}>
            <div style={{ position: 'relative' }}>
              <img
                style={{ width: '100%' }}
                src={`http://localhost:5000/${video.thumbnail}`}
                alt='Picture'
              />
              <div
                className='duration'
                style={{
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  margin: '4px',
                  color: '#fff',
                  backgroundColor: 'rgba(17,17,17,0.8)',
                  opacity: 0.8,
                  padding: '2px 4px',
                  borderRadius: '2px',
                  letterSpacing: '0.5px',
                  fontSize: '12px',
                  fontWeight: '500',
                  lineHeight: '12px',
                }}>
                <span>
                  {minutes} : {seconds}
                </span>
              </div>
              <br />
            </div>
          </a>
          <Meta
            avatar={<Avatar src={video.writer.image} />}
            title={video.title}
          />
          <span>{video.writer.name}</span>
          <br />
          <span style={{ marginLeft: '3rem' }}>views: {video.views}</span>-
          <span>{moment(video.createdAt).format('MMM Do YY')}</span>
        </div>
      </Col>
    );
  });

  return (
    <div style={{ width: '85%', margin: '3rem auto' }}>
      <Title level={2}>Recomended</Title>
      <hr />
      <Row>{renderCards}</Row>
    </div>
  );
}

export default LandingPage;
