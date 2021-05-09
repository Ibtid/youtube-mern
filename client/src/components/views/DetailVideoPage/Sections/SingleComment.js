import React, { useState } from 'react';
import { Comment, Avatar, Button, Input } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import LikeDislikes from './LikeDislikes';

const { TextArea } = Input;

function SingleComment(props) {
  const user = useSelector((state) => state.user);
  const [commentValue, setCommentValue] = useState('');
  const [openReply, setOpenReply] = useState(false);

  const handleChange = (e) => {
    setCommentValue(e.currentTarget.value);
  };

  const OpenReply = () => {
    setOpenReply(!openReply);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      writer: user.userData._id,
      postId: props.postId,
      responseTo: props.comment._id,
      content: commentValue,
    };

    axios.post('/api/comment/saveComment', variables).then((response) => {
      if (response.data.success) {
        setCommentValue('');
        setOpenReply(!openReply);
        props.refreshFunction(response.data.result);
      } else {
        alert('Failed to save Comment');
      }
    });
  };

  const action = [
    <LikeDislikes
      comment
      commentId={props.comment._id}
      userId={localStorage.getItem('userId')}
    />,
    <span onClick={OpenReply} key='comment-basic-reply'>
      Reply to
    </span>,
  ];
  return (
    <div>
      <Comment
        actions={action}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt />}
        content={<p>{props.comment.content}</p>}></Comment>
      {openReply && (
        <form style={{ display: 'flex' }} onSubmit={onSubmit}>
          <TextArea
            style={{ width: '100%', borderRadius: '5px' }}
            onChange={handleChange}
            value={commentValue}
            placeholder='write some comments'
          />
          <br />
          <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>
            Submit
          </Button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
