import React, { Fragment } from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";

import Button from "@atlaskit/button/standard-button";
import MoreIcon from "@atlaskit/icon/glyph/more";
import EditorDoneIcon from "@atlaskit/icon/glyph/editor/done";
import FlagFilledIcon from "@atlaskit/icon/glyph/flag-filled";
import Avatar from "@atlaskit/avatar";

import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from "@atlaskit/dropdown-menu";

import { ButtonItem, MenuGroup, Section } from "@atlaskit/menu";
import Tooltip from "@atlaskit/tooltip";

import styles from "./task.module.scss";
import { useDispatch } from "react-redux";
import { flagSlice } from "../../store/reducers/FlagSlice";
import { toDoSlice } from "../../store/reducers/ToDoSlice";
import { useState } from "react";
import DropdownMenuTask from "./components/dropdownMenuTask/DropdownMenuTask";
import MenuGroupComponent from "./components/menuGroupComponent/MenuGroupComponent";

const Container = styled.div`
  // background-color: ${(props: any) =>
    props.isDragging ? "lightgreen" : "white"};
`;

const Task = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coord, setCoord] = useState({ x: 0, y: 0 });
  const dispatch = useDispatch();
  const { modalTaskInfo, setFromColumnId } = flagSlice.actions;
  const openModalTaskInfo = (e: any) => {
    dispatch(
      modalTaskInfo({
        isOpen: true,
        task: props.task,
        column: props.column,
      })
    );

    dispatch(setFromColumnId(props.column.id));
  };

  const onMouseDownHandler = (e: any) => {
    console.log(e);
    e.preventDefault();
    setTimeout(() => {
      setIsOpen(false);
    }, 100);
    setTimeout(() => {
      setIsOpen(true);
    }, 200);
    setCoord({ x: e.clientX + 40, y: e.clientY - 20 });

    setTimeout(() => {
      const menuList: any = document.querySelectorAll(".taskMenu");

      menuList[menuList.length - 1].style.display = "none";
    }, 100);
  };

  return (
    <Draggable draggableId={props.task.id} index={props.index}>
      {(provided: any, snapshot: any) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          className={`${styles.wrapTask} ${
            props.task.flag ? styles.isFlagTask : ""
          }`}
        >
          <div
            className={styles.task}
            onContextMenu={onMouseDownHandler}
            onClick={openModalTaskInfo}
          >
            <div className={styles.taskWrap}>
              <div className={styles.contentTask}>
                <p>{props.task.content}</p>

                {/* <DropdownMenuTask
                  column={props.column}
                  taskId={props.task.id}
                ></DropdownMenuTask> */}
              </div>

              <div className={styles.marksTask}>
                {props.task.marks.map((mark: any, index: any) => (
                  <span key={index}>{mark.label}</span>
                ))}
              </div>

              <div className={styles.taskBottom}>
                <div className={styles.taskNameWrap}>
                  <Tooltip content="Задача">
                    {(tooltipProps) => (
                      <Button
                        className={styles.checkBtn}
                        iconBefore={
                          <EditorDoneIcon label="doneIcon" size="small" />
                        }
                        appearance="primary"
                        {...tooltipProps}
                      />
                    )}
                  </Tooltip>

                  <Tooltip content={props.task.id}>
                    {(tooltipProps: any) => (
                      <span
                        className={styles.taskName}
                        appearance="primary"
                        {...tooltipProps}
                      >
                        {props.task.id}
                      </span>
                    )}
                  </Tooltip>
                </div>

                <div className={styles.avatarWrap}>
                  {props.task.flag && (
                    <Tooltip content="Помечено">
                      {(tooltipProps) => (
                        <div className={styles.flag} {...tooltipProps}>
                          <FlagFilledIcon label=""></FlagFilledIcon>
                        </div>
                      )}
                    </Tooltip>
                  )}

                  <Tooltip content="Дмитрий Хван">
                    {(tooltipProps) => (
                      <div className={styles.avatar} {...tooltipProps}>
                        <Avatar></Avatar>
                      </div>
                    )}
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
          <DropdownMenuTask
            column={props.column}
            task={props.task}
          ></DropdownMenuTask>

          {isOpen && (
            <div
              className={`${styles.menuGroup} taskMenu`}
              style={{ left: coord.x + "px", top: coord.y + "px" }}
            >
              <DropdownMenu
                defaultOpen={isOpen}
                trigger={({ triggerRef, ...props }) => (
                  <Button
                    style={{ opacity: 0, width: 0, height: 0 }}
                    {...props}
                    iconBefore={<MoreIcon label="more" />}
                    ref={triggerRef}
                  />
                )}
              >
                <div className="taskMenu">
                  <DropdownItemGroup>
                    <MenuGroupComponent
                      column={props.column}
                      task={props.task}
                    ></MenuGroupComponent>
                  </DropdownItemGroup>
                </div>
              </DropdownMenu>
            </div>
          )}
        </Container>
      )}
    </Draggable>
  );
};

export default Task;
