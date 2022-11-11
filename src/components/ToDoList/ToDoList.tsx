import React, { Fragment, memo, useCallback, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
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
import { GET_COLUMNS } from "../../apollo/Queries";
import arrayToObject from "../../utils/arrayToObject";

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

  // const searchTasks = useMemo(() => {
  //   return () => {
  //     console.log("searchTasks");
  //     return Object.values(taskMap).filter((task: any) =>
  //       task.content.toLowerCase().includes(searchValue.toLowerCase())
  //     );
  //   };
  // }, [searchValue]);

  const taskArr = Object.values(taskMap).filter((task: any) =>
    task.content.toLowerCase().includes(searchValue.toLowerCase())
  );

  console.log("taskArr", taskArr);

  const taskMapTransform = arrayToObject(taskArr);

  console.log("taskMapTransform", taskMapTransform);

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
  const { initialTaskList, updateTodoList } = toDoSlice.actions;
  const { setAddTaskBtnFlag } = flagSlice.actions;
  const dispatch = useDispatch();

  const { loading, error, data } = useQuery(GET_COLUMNS, {
    onCompleted: (data) => {
      let { tasks, columns, columnOrder } = data.TM_getColumns.body;
      console.log("data", data);

      tasks = tasks.map((task: any) => {
        return {
          ...task,
          links: JSON.parse(task.links),
          marks: JSON.parse(task.marks),
          nodes: JSON.parse(task.nodes),
        };
      });

      const tasksObj = arrayToObject(tasks);

      const columnsObj = arrayToObject(columns);

      dispatch(initialTaskList({ tasksObj, columnsObj, columnOrder }));
    },
  });

  console.log("list", list);

  let col = null;
  let title: any = null;

  const onDragEnd = (result: any) => {
    console.log("result", result);

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
