import React, { useEffect, useState } from 'react';
import SingleComment from './SingleComment';

function ReplyComment(props) {
  const [childCommentNumber, setChildCommentNumber] = useState(0);
  const [openReplyComment, setOpenReplyComment] = useState(false);

  useEffect(() => {
    let commentNumber = 0;
    props.commentLists.map((comment) => {
      if (comment.responseTo === props.parentCommentId) {
        commentNumber++;
      }
    });
    setChildCommentNumber(commentNumber);
  }, [props.commentLists, props.parentCommentId]);

  let renderReplyComment = (parentCommentId) =>
    props.commentLists.map((comment, index) => (
      <React.Fragment>
        {comment.responseTo === parentCommentId && (
          <div style={{ width: '80%', marginLeft: '40px' }}>
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
          </div>
        )}
      </React.Fragment>
    ));

  const handleChange = () => {
    setOpenReplyComment(!openReplyComment);
  };

  return (
    <div>
      {childCommentNumber > 0 && (
        <p
          style={{ fontSize: '14px', margin: 0, color: 'gray' }}
          onClick={handleChange}>
          View {childCommentNumber} more comment(s)
        </p>
      )}

      {openReplyComment && renderReplyComment(props.parentCommentId)}
    </div>
  );
}

export default ReplyComment;
