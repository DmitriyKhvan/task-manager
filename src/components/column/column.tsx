import React, { Fragment, memo, useEffect, useState } from "react";
import styled from "styled-components";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Task from "../task/task";

import Textfield from "@atlaskit/textfield";
import InlineEdit from "@atlaskit/inline-edit";

import Button from "@atlaskit/button/standard-button";
import MoreIcon from "@atlaskit/icon/glyph/more";

import AddTask from "../addTask/addTask";

import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from "@atlaskit/dropdown-menu";
import { Section } from "@atlaskit/menu";

import "./column.scss";
import AddBetweenTasks from "../addBetweenTasks/addBetweenTasks";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toDoSlice } from "../../store/reducers/ToDoSlice";
import { flagSlice } from "../../store/reducers/FlagSlice";
import declensionOfWords from "../../pipes/declensionOfWords";
import { useMutation } from "@apollo/client";
import { ADD_COLUMN } from "../../apollo/Mutation";
import { GET_COLUMNS } from "../../apollo/Queries";

const Title = styled.h2`
  width: 193px;
  margin: 0 8px;
  text-transform: uppercase;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const TaskList = styled.div`
  padding: 5px 5px 0 5px;
  transition: background-color 0.2s ease;
  background-color: ${(props: any) =>
    props?.isDraggingOver ? "skyblue" : "inherit"};
  flex-grow: 1;
  min-height: 100px;
`;

// const ColumnTodo = styled.div``;

const ColumnTodo: any = styled.div`
  top: ${(props: any) => (props?.isDragging ? "223px !important" : "inherit")};
`;

// class InnerList extends React.Component {
//   shouldComponentUpdate(nextProps) {
//     if (nextProps.tasks === this.props.tasks) {
//       return false;
//     }
//     return true;
//   }

//   render() {
//     return this.props.tasks.map((task, index) => (
//       <Task key={task.id} task={task} index={index} />
//     ));
//   }
// }

const EditTitleColumn = (props: any) => {
  const [addColumn, { loading, error, data }] = useMutation(ADD_COLUMN, {
    refetchQueries: [{ query: GET_COLUMNS }],
  });

  const dispatch = useDispatch();
  const { addTitleColumn } = toDoSlice?.actions;
  useEffect(() => {
    if (!props?.children) props.setFalg(false);
  }, []);

  return (
    <div className="textAreaWrap add">
      <InlineEdit
        className="titleColumn"
        defaultValue={props.children}
        editView={({ errorMessage, ...fieldProps }) => (
          <Textfield {...fieldProps} autoFocus />
        )}
        readView={() => (
          <h2 className="titleText">
            <div className="text" data-testid="read-view">
              {props?.children || "Click to enter a value"}
            </div>

            {props?.tasks?.length ? (
              <div className="count">
                <span>{props?.tasks?.length}</span>
                <span>
                  {declensionOfWords(props?.tasks?.length, [
                    "Задача",
                    "Задачи",
                    "Задач",
                  ])}
                </span>
              </div>
            ) : null}

            {props?.column?.limit ? (
              <div
                className={`maxTasks ${
                  props?.column?.taskIds?.length > props?.column?.limit
                    ? "isMaxTasks"
                    : ""
                }`}
              >
                МАКС: {props?.column?.limit}
              </div>
            ) : null}
          </h2>
        )}
        onConfirm={(value) => {
          if (value.trim().length) {
            addColumn({
              variables: {
                columns: [{ taskLimit: 2, title: value }],
              },
            });
          } else {
            dispatch(
              addTitleColumn({ columnId: props?.column?.id, title: value })
            );
          }

          setTimeout(() => {
            props.setFalg(true);
            const el: any = document?.getElementById("wrapToDoContainer");

            el.scrollTo(el?.scrollLeft + 1, 0);
          });
        }}
        onCancel={(value: void) => {
          dispatch(
            addTitleColumn({ columnId: props?.column?.id, title: value })
          );
          setTimeout(() => {
            props.setFalg(true);
          });
        }}
        onEdit={() => {
          props.setFalg(false);
        }}
        // readViewFitContainerWidth
        startWithEditViewOpen={props?.children ? false : true}
      />
    </div>
  );
};

const DropdownMenuTitle = (props: any) => {
  const dispatch = useDispatch();
  const { modalLimitTasks } = flagSlice?.actions;
  const { modalDeleteColumn } = flagSlice?.actions;

  const openModalLimitTasks = () => {
    dispatch(
      modalLimitTasks({
        isOpen: true,
        column: props?.column,
      })
    );
  };

  const openModalDeleteColumn = () => {
    dispatch(
      modalDeleteColumn({
        isOpen: true,
        column: props?.column,
      })
    );
  };

  return (
    <DropdownMenu
      placement="bottom-end"
      trigger={({ triggerRef, ...props }) => (
        <Button
          className="dropMenuBtn"
          {...props}
          iconBefore={<MoreIcon label="more" />}
          ref={triggerRef}
        />
      )}
    >
      <DropdownItemGroup className="taskMenu">
        <Section>
          <DropdownItem onClick={openModalLimitTasks}>
            Задать лимит количества столбцов
          </DropdownItem>
          <DropdownItem onClick={openModalDeleteColumn}>Удалить</DropdownItem>
        </Section>
      </DropdownItemGroup>
    </DropdownMenu>
  );
};

const InnerList = memo((props: any) => {
  return props?.tasks?.map((task: any, index: any) => {
    return task?.id ? (
      <Fragment key={task?.id}>
        <AddBetweenTasks
          column={props?.column}
          taskIndex={index}
        ></AddBetweenTasks>
        <Task column={props?.column} task={task} index={index} />
      </Fragment>
    ) : null;
  });
});

const Column = (props: any) => {
  const { addTaskBtnFlag } = useSelector((state: any) => state?.flagReducer);

  const [flag, setFlag] = useState(true);

  return (
    <Draggable draggableId={props?.column?.id} index={props?.index}>
      {(provided, snapshot) => (
        <ColumnTodo
          isDragging={snapshot.isDragging}
          className={`columnTodo ${
            props?.column?.taskIds?.length > props?.column?.limit &&
            props?.column?.limit
              ? "isLimit"
              : ""
          }`}
          {...provided?.draggableProps}
          ref={provided?.innerRef}
        >
          {/* <Title {...provided.dragHandleProps}>{props.column.title}</Title> */}
          <div className="titleWrap" {...provided?.dragHandleProps}>
            <div className="titleColumn">
              <EditTitleColumn
                column={props?.column}
                tasks={props?.tasks}
                flag={flag}
                setFalg={setFlag}
              >
                {props?.column?.title}
              </EditTitleColumn>
              {flag ? (
                <div className="dropmenuTitle">
                  <DropdownMenuTitle column={props?.column}></DropdownMenuTitle>
                </div>
              ) : null}
            </div>
          </div>

          <Droppable droppableId={props?.column?.id} type="task">
            {(provided, snapshot) => (
              <TaskList
                ref={provided?.innerRef}
                {...provided?.droppableProps}
                // isDraggingOver={snapshot.isDraggingOver}
              >
                <InnerList column={props?.column} tasks={props?.tasks} />
                {provided?.placeholder}

                {(addTaskBtnFlag || props?.column?.title === "To do") &&
                props?.column?.title !== "" ? (
                  <AddTask column={props?.column}></AddTask>
                ) : (
                  <div style={{ height: "39px" }}></div>
                )}
              </TaskList>
            )}
          </Droppable>
        </ColumnTodo>
      )}
    </Draggable>
  );
};

export default Column;
