import React, { Component, useState } from "react";
import { convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToMarkdown from "draftjs-to-markdown";
import "./comments.scss";
import "../../assets/react-draft-wysiwyg.css";
import CommentList from "./components/commentList/commentList";
import Button, { ButtonGroup } from "@atlaskit/button";
import Avatar from "@atlaskit/avatar";

const EditorConvertToMarkdown = () => {
  const [isOpenEditor, setIsOpenEditor] = useState(false);
  const [editorState, setEditorState] = useState(undefined);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  return (
    <div className="customEditorStyle">
      <h4 className="activity">Активность</h4>

      <div className="addCommentBlock">
        <div className="avatarComment">
          <Avatar></Avatar>
        </div>

        <div className="addCommentEditor">
          {isOpenEditor ? (
            <>
              <Editor
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={onEditorStateChange}
              />
              {/* <textarea
          disabled
          value={
            editorState &&
            draftToMarkdown(convertToRaw(editorState.getCurrentContent()))
          }
        /> */}
              <div className="commentGroupBtns">
                <ButtonGroup>
                  <Button appearance="primary">Сохранить</Button>
                  <Button
                    onClick={() => setIsOpenEditor(false)}
                    appearance="subtle"
                  >
                    Отмена
                  </Button>
                </ButtonGroup>
              </div>
            </>
          ) : (
            <button
              onClick={() => setIsOpenEditor(true)}
              className="addComment"
            >
              Добавить комментарий...
            </button>
          )}
        </div>
      </div>

      <CommentList></CommentList>
    </div>
  );
};

export default EditorConvertToMarkdown;
