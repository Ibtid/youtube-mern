import React, { useEffect, useState } from 'react';
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { useSelector } from 'react-redux';

const { Title } = Typography;
const { TextArea } = Input;

const Private = [
  { value: 0, label: 'Private' },
  { value: 1, label: 'Public' },
];

const Category = [
  { value: 0, label: 'Film & Animation' },
  { value: 1, label: 'Auto & Vehicles' },
  { value: 2, label: 'Music' },
  { value: 3, label: 'Pets & Animals' },
  { value: 4, label: 'Sports' },
];

function UploadVideoPage(props) {
  const user = useSelector((state) => state.user);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState(0);
  const [categories, setCategories] = useState('Film and Animation');
  const [filePath, setFilePath] = useState('');
  const [duration, setDuration] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  const handleChangeTitle = (event) => {
    setTitle(event.currentTarget.value);
  };

  const handleChangeDescription = (event) => {
    setDescription(event.currentTarget.value);
  };

  const handleChangeOne = (event) => {
    setPrivacy(event.currentTarget.value);
  };

  const handleChangeTwo = (event) => {
    setCategories(event.currentTarget.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    if (user.userData && !user.userData.isAuth) {
      return alert('Please Log in First');
    }

    if (
      title === '' ||
      description === '' ||
      categories === '' ||
      filePath === '' ||
      duration === '' ||
      thumbnail === ''
    ) {
      return alert('Please fill in the form first');
    }

    const variables = {
      writer: user.userData._id,
      title: title,
      description: description,
      privacy: privacy,
      filePath: filePath,
      category: categories,
      duration: duration,
      thumbnail: thumbnail,
    };

    axios.post('/api/video/uploadVideo', variables).then((response) => {
      if (response.data.success) {
        alert('Video Uploaded SuccessFully');
        props.history.push('/');
      } else {
        alert('Failed to upload video');
      }
    });
  };

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/form-data' },
    };

    formData.append('file', files[0]);

    axios.post('/api/video/uploadfiles', formData, config).then((response) => {
      if (response.data.success) {
        console.log('response', response);
        let variable = {
          filePath: response.data.filePath,
          fileName: response.data.fileName,
        };

        setFilePath(response.data.filePath);

        //generate thumbnail with this filepath

        axios.post('/api/video/thumbnail', variable).then((response) => {
          if (response.data.success) {
            setDuration(response.data.fileDuration);
            setThumbnail(response.data.thumbsFilePath);
          } else {
            alert('Failed to make the thumbnail');
          }
        });
      } else {
        alert('failed to save the video in server');
      }
    });
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}>Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Dropzone onDrop={onDrop} multiple={false} maxSize={800000000}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div
                  style={{
                    width: '300px',
                    height: '240px',
                    border: '1px solid lightgray',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Icon type='plus' style={{ fontSize: '3rem' }} />
                </div>
              </section>
            )}
          </Dropzone>
          {thumbnail !== '' && (
            <div>
              <img src={`http://localhost:5000/${thumbnail}`} alt='thumbnail' />
            </div>
          )}
        </div>
        <br />
        <br />
        <label>Title</label>
        <Input onChange={handleChangeTitle} value={title} />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={handleChangeDescription} value={description} />
        <br />
        <br />
        <select onChange={handleChangeOne}>
          {Private.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <select onChange={handleChangeTwo}>
          {Category.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button type='primary' size='large' onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default UploadVideoPage;
