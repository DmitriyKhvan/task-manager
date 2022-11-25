import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addTaskBtnFlag: true,
  taskData: {
    modal: false,
    taskId: null,
    columnId: null,
  },
  columnData: {
    isOpen: false,
    column: null,
  },
  taskInfo: {
    isOpen: false,
    task: null,
    column: null,
  },

  limitTasks: {
    isOpen: false,
    column: null,
  },

  modalTaskData: {
    isOpen: false,
    task: null,
    column: null,
  },

  taskLinks: {
    isOpen: false,
    task: null,
    links: null,
    column: null,
  },

  fromColumnId: null,
};

export const flagSlice = createSlice({
  name: "flag",
  initialState,
  reducers: {
    setAddTaskBtnFlag(state, action) {
      state.addTaskBtnFlag = action.payload;
    },
    setTaskData(state, action) {
      const { modal, taskId, columnId } = action.payload;
      state.taskData = {
        modal,
        taskId,
        columnId,
      };
    },
    modalDeleteColumn(state, action) {
      const { isOpen, column } = action.payload;
      state.columnData = {
        isOpen,
        column,
      };
    },

    modalTaskInfo(state, action) {
      const { isOpen, task, column } = action.payload;
      state.taskInfo = {
        isOpen,
        task,
        column,
      };
    },

    modalLimitTasks(state, action) {
      const { isOpen, column } = action.payload;
      state.limitTasks = {
        isOpen,
        column,
      };
    },

    setModalTaskData(state, action) {
      const { isOpen, task, column } = action.payload;
      state.modalTaskData = {
        isOpen,
        task,
        column,
      };
    },

    modalTaskLinks(state, action) {
      const { isOpen, task, links, column } = action.payload;
      state.taskLinks = {
        isOpen,
        task,
        links,
        column,
      };
    },

    setFromColumnId(state, action) {
      const fromColumnId = action.payload;
      state.fromColumnId = fromColumnId;
    },
  },
});

export default flagSlice.reducer;
