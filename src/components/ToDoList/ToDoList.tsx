import React, {
  Fragment,
  memo,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
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
import { arrayToObject, transformData } from "../../utils/transformData";
import {
  ADD_TASK,
  SET_COLUMN_ORDER,
  SET_TASK_ORDER,
} from "../../apollo/Mutation";
import { updateStore } from "../../utils/updateStore";
import { ADD_TASK_SUB } from "../../apollo/subscription";

const InnerList = memo((props: any) => {
  const { searchValue } = useSelector((state: any) => state.toDoReducer);
  const { column, taskMap, index }: any = props;

  const taskArr = Object.values(taskMap).filter((task: any) =>
    task.content.toLowerCase().includes(searchValue.toLowerCase())
  );

  const taskMapTransform = arrayToObject(taskArr);

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
  const state: any = useSelector((state: any) => state.toDoReducer);
  // const [state, setState]: any = useState({
  //   tasks: {},
  //   columns: {},
  //   columnOrder: [],
  // });
  const { initialTaskList /*updateTodoList*/ } = toDoSlice.actions;
  const { setAddTaskBtnFlag } = flagSlice.actions;
  const dispatch = useDispatch();

  const {
    loading,
    error,
    data: initialData,
  } = useQuery(GET_COLUMNS, {
    onCompleted: (data) => {
      //redux thunk
      dispatch(updateStore(data.TM_getColumns.body));

      // setState({
      //   tasks,
      //   columns: columnsObj,
      //   columnOrder,
      // });
    },
  });

  const {
    loading: load,
    error: err,
    data,
  } = useSubscription(ADD_TASK_SUB, {
    onSubscriptionData: (data: any) => {
      console.log("data.taskAdded.body ----", data);
      dispatch(updateStore(data.subscriptionData.data.taskAdded.body));
    },
  });

  const [setTaskOrder, {}] = useMutation(SET_TASK_ORDER, {
    // onCompleted: (data) => {
    //   dispatch(updateStore(data.TM_setTaskOrder.body));
    // },
    // refetchQueries: [{ query: GET_COLUMNS }],
  });

  const [setColumnOrder, {}] = useMutation(SET_COLUMN_ORDER, {
    // refetchQueries: [{ query: GET_COLUMNS }],
  });

  const [addTaskQuery, {}] = useMutation(ADD_TASK, {
    // refetchQueries: [{ query: GET_COLUMNS }],
  });

  let col = null;
  let title: any = null;

  const onDragEnd = (result: any) => {
    /*********** drag & drop logic*************/
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "column") {
      const newColumnOrder = Array.from(state.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...state,
        columnOrder: newColumnOrder,
      };

      // setState(newState);
      dispatch(
        initialTaskList({
          tasks: newState.tasks,
          columns: newState.columns,
          columnOrder: newState.columnOrder,
        })
      );

      setColumnOrder({
        variables: {
          columnIds: newColumnOrder,
        },
      });

      return;
    }

    const home = state.columns[source.droppableId];
    const foreign = state.columns[destination.droppableId];

    if (home === foreign) {
      const newTaskIds = Array.from(home.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newHome = {
        ...home,
        taskIds: newTaskIds,
      };

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newHome.id]: newHome,
        },
      };

      // setState(newState);

      dispatch(
        initialTaskList({
          tasks: newState.tasks,
          columns: newState.columns,
          columnOrder: newState.columnOrder,
        })
      );

      setTaskOrder({
        variables: {
          taskIds: newTaskIds,
        },
      });

      return;
    }

    // moving from one list to another
    const homeTaskIds = Array.from(home.taskIds);
    homeTaskIds.splice(source.index, 1);
    const newHome = {
      ...home,
      taskIds: homeTaskIds,
    };

    const foreingTaskIds = Array.from(foreign.taskIds);
    foreingTaskIds.splice(destination.index, 0, draggableId);
    const newForeign = {
      ...foreign,
      taskIds: foreingTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newHome.id]: newHome,
        [newForeign.id]: newForeign,
      },
    };

    // setState(newState);
    dispatch(
      initialTaskList({
        tasks: newState.tasks,
        columns: newState.columns,
        columnOrder: newState.columnOrder,
      })
    );

    const { id, content, files, flag, links, marks, nodes } =
      state.tasks[draggableId];

    addTaskQuery({
      variables: {
        tasks: {
          id,
          content,
          files: JSON.stringify(files),
          flag,
          links: JSON.stringify(links),
          marks: JSON.stringify(marks),
          nodes: JSON.stringify(nodes),
          columnId: destination.droppableId,
          order: destination.index,
        },
      },
    }),
      /************************/
      dispatch(setAddTaskBtnFlag(true));

    if (title) {
      title.style.position = "sticky";
    }

    if (
      result.destination.droppableId === "col_19" &&
      result.source.droppableId !== "col_19"
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

              {state.columnOrder.map((columnId: any, index: any) => {
                const column: any = state.columns[columnId];

                return (
                  <InnerList
                    key={column.id}
                    column={column}
                    taskMap={state.tasks}
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
