import React from "react";
import { useSelector } from "react-redux";

import Avatar from "@atlaskit/avatar";

import Comment, {
  CommentAction,
  CommentAuthor,
  CommentEdited,
  CommentTime,
} from "@atlaskit/comment";
import styles from "./commentList.module.scss";

export default function CommentList() {
  const { comments } = useSelector((state: any) => state.toDoReducer);

  return (
    <div>
      {comments.map((comment: any) => {
        return (
          <div className={styles.comment} key={comment.id}>
            <Comment
              avatar={
                // <Avatar
                //   appearance="circle"
                //   src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
                //   size="large"
                //   name="Scott Farquhar"
                // />
                <Avatar></Avatar>
              }
              author={<CommentAuthor>{comment.user.fio}</CommentAuthor>}
              type="author"
              // edited={<CommentEdited>Edited</CommentEdited>}
              // restrictedTo="Restricted to Admins Only"
              time={<CommentTime>{comment.date}</CommentTime>}
              content={<p>{comment.text}</p>}
              actions={[
                <CommentAction>Изменить</CommentAction>,
                <CommentAction>Удалить</CommentAction>,
                // <CommentAction>Like</CommentAction>,
              ]}
            />
          </div>
        );
      })}
    </div>
  );
}
