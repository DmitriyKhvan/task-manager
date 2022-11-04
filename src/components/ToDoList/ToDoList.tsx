import React, { Fragment, memo, useState } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Column from "../column/column";
import AddColumn from "../addColumn/addColumn";
import { useDispatch, useSelector } from "react-redux";
import { toDoSlice } from "../../store/reducers/ToDoSlice";
import BreadcrumbsComp from "../breadcrumbs/breadCrumbs";
import PageHeaderComplex from "../pageHeader/pageHeader";
import { flagSlice } from "../../store/reducers/FlagSlice";
import ModalRemoveTask from "../modal/removeTask/removeTask";
import styles from "./ToDoList.module.scss";
import ModalRemoveColumn from "../modal/removeColumn/removeColumn";
import TaskInfo from "../modal/taskInfo/taskInfo";
import ModalLimitTasks from "../modal/limitTasks/limitTasks";
import ModalMarks from "../modal/marks/marks";

// class InnerList extends React.PureComponent {
//   render() {
//     const { column, taskMap, index } = this.props;
//     const tasks = column.taskIds.map((taskId) => taskMap[taskId]);
//     return <Column column={column} tasks={tasks} index={index} />;
//   }
// }

const InnerList = memo((props: any) => {
  const { searchValue } = useSelector((state: any) => state.toDoReducer);
  const { column, taskMap, index }: any = props;

  const taskArr = Object.values(taskMap).filter((task: any) =>
    task.content.toLowerCase().includes(searchValue.toLowerCase())
  );

  const taskMapTransform: any = taskArr.reduce(
    (result: any, item: any, index: any) => {
      let key: any = Object.values(item)[0];
      result[key] = { ...item };
      return result;
    },
    {}
  );

  // const tasks = column.taskIds.map((taskId) => taskMap[taskId]);
  const tasks = column.taskIds.map((taskId: any) => {
    if (taskMapTransform[taskId]) {
      return taskMapTransform[taskId];
    }
    return undefined;
  });
  // .filter((task) => task);

  return <Column column={column} tasks={tasks} index={index} />;
});

const ToDoList = () => {
  const list: any = useSelector((state: any) => state.toDoReducer);
  const { updateTodoList } = toDoSlice.actions;
  const { setAddTaskBtnFlag } = flagSlice.actions;
  const dispatch = useDispatch();

  let col = null;
  let title: any = null;

  const onDragEnd = (result: any) => {
    dispatch(setAddTaskBtnFlag(true));
    dispatch(updateTodoList(result));
    if (title) {
      title.style.position = "sticky";
    }

    if (
      result.destination.droppableId === "column-3" &&
      result.source.droppableId !== "column-3"
    ) {
      setTimeout(() => {
        const task: any = document.querySelector(
          `div[data-rbd-draggable-id='${result.draggableId}']`
        );

        task.classList.add("active");

        setTimeout(() => {
          task.classList.remove("active");
        }, 500);
      });
    }
  };

  const onBeforeDragStart = (result: any) => {
    dispatch(setAddTaskBtnFlag(false));
    // setTimeout(() => {
    //   col = document.querySelector(
    //     `div[data-rbd-draggable-id='${result.draggableId}']`
    //   );
    //   title = col.querySelector(".titleWrap");
    //   if (title) {
    //     col.style.top = "223px";
    //     title.style.position = "relative";
    //   }
    // });
  };

  const handleScroll = (event: any) => {
    const el = event.target;
    const titles = el.querySelectorAll(".titleColumn");

    const hScrolPos = el.scrollLeft;
    const vScrolPos = el.scrollTop;

    const invisibleWidth = el.scrollWidth - el.clientWidth;
    const invisibleHeight = el.scrollHeight - el.clientHeight;

    const elRightMar: any = document.getElementById("rightMargin");
    const elLeftMar: any = document.getElementById("leftMargin");

    if (hScrolPos > 0 && hScrolPos < invisibleWidth) {
      elRightMar.style.boxShadow =
        "0 80px 0 #ffffff, -5px -2px 7px rgba(9, 30, 66, 0.08)";
      elRightMar.style.zIndex = "50";
      elLeftMar.style.boxShadow =
        "0 80px 0 #ffffff, 5px -2px 7px rgba(9, 30, 66, 0.08)";
      elLeftMar.style.zIndex = "50";
    } else if (hScrolPos === 0 && invisibleWidth) {
      elLeftMar.style.boxShadow = "none";
      elLeftMar.style.zIndex = "10";

      elRightMar.style.boxShadow =
        "0 80px 0 #ffffff, -5px -2px 7px rgba(9, 30, 66, 0.08)";
      elRightMar.style.zIndex = "50";
    } else if (hScrolPos === invisibleWidth && invisibleWidth) {
      elRightMar.style.boxShadow = "none";
      elRightMar.style.zIndex = "10";

      elLeftMar.style.boxShadow =
        "0 80px 0 #ffffff, 5px -2px 7px rgba(9, 30, 66, 0.08)";
      elLeftMar.style.zIndex = "50";
    } else {
      elRightMar.style.boxShadow = "none";
      elRightMar.style.zIndex = "10";
      elLeftMar.style.boxShadow = "none";
      elLeftMar.style.zIndex = "10";
    }

    if (vScrolPos !== invisibleHeight) {
      titles.forEach((e: any) => e.classList.remove("add"));
    } else if (vScrolPos > 0) {
      titles.forEach((e: any) => e.classList.add("add"));
    }
  };

  return (
    <div
      onScroll={handleScroll}
      id="wrapToDoContainer"
      className={styles.wrapToDoContainer}
    >
      <DragDropContext
        onDragEnd={onDragEnd}
        onBeforeDragStart={onBeforeDragStart}
      >
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided: any) => (
            <div
              className={styles.toDoContainer}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div id="leftMargin" className={styles.leftMargin}></div>

              {list.columnOrder.map((columnId: any, index: any) => {
                const column: any = list.columns[columnId];

                return (
                  <InnerList
                    key={column.id}
                    column={column}
                    taskMap={list.tasks}
                    index={index}
                  />
                );
              })}
              {provided.placeholder}
              <AddColumn></AddColumn>

              {/* Модальное окно удаление задачи */}
              <ModalRemoveTask></ModalRemoveTask>

              {/* Модальное окно удаление колонки */}
              <ModalRemoveColumn></ModalRemoveColumn>

              <TaskInfo></TaskInfo>

              <ModalLimitTasks></ModalLimitTasks>

              <ModalMarks></ModalMarks>

              <div id="rightMargin" className={styles.rightMargin}></div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ToDoList;
