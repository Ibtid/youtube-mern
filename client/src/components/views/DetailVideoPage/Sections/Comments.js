import React, { useState } from 'react';
import { Button, Input } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

const { TextArea } = Input;

function Comments(props) {
  const user = useSelector((state) => state.user);
  const [comment, setComment] = useState('');

  const handleChange = (e) => {
    setComment(e.currentTarget.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      content: comment,
      writer: user.userData._id,
      postId: props.postId,
    };

    axios.post('/api/comment/saveComment', variables).then((response) => {
      if (response.data.success) {
        setComment('');
        props.refreshFunction(response.data.result);
      } else {
        alert('Failed to save Comment');
      }
    });
  };

  return (
    <div>
      <br />
      <p>replies</p>
      <hr />
      {/*comment list*/}
      {console.log(props.commentLists)}
      {props.commentLists &&
        props.commentLists.map(
          (comment, index) =>
            !comment.responseTo && (
              <React.Fragment>
                <SingleComment
                  comment={comment}
                  postId={props.postId}
                  refreshFunction={props.refreshFunction}
                />
                <ReplyComment
                  commentLists={props.commentLists}
                  postId={props.postId}
                  refreshFunction={props.refreshFunction}
                  parentCommentId={comment._id}
                />
              </React.Fragment>
            )
        )}

      {/*Root comment form*/}
      <form style={{ display: 'flex' }} onSubmit={onSubmit}>
        <TextArea
          style={{ width: '100%', borderRadius: '5px' }}
          onChange={handleChange}
          value={comment}
          placeholder='write some comments'
        />
        <br />
        <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Comments;
