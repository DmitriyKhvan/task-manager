import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // tasks: {
  //   "task-1": {
  //     id: "task-1",
  //     content:
  //       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio est totam fugiat vitae, deserunt architecto!",
  //     marks: [
  //       {
  //         label: "метка1",
  //         value: "mark1",
  //       },
  //     ],
  //     nodes: [
  //       {
  //         id: 1,
  //         content: "node1",
  //         columnId: "column-3",
  //         date: "2022-07-31T19:00:00.000Z",
  //       },
  //       {
  //         id: 2,
  //         content: "node2",
  //         columnId: "column-2",
  //         date: "2022-08-04T19:00:00.000Z",
  //       },
  //     ],
  //     files: [
  //       {
  //         id: 1,
  //         name: "file1.txt",
  //         size: 123,
  //         createdAt: "29-08-2022 12:55:24",
  //       },
  //     ],
  //     flag: false,
  //     links: [
  //       {
  //         id: 1,
  //         url: "https://flexitev.atlassian.net/jira/software/projects/MSB/boards/1",
  //         text: "test text",
  //       },
  //       {
  //         id: 2,
  //         url: "https://qna.habr.com/",
  //         text: "test text2",
  //       },
  //     ],
  //   },
  //   "task-2": {
  //     id: "task-2",
  //     content: "Watch my favorite show",
  //     marks: [
  //       {
  //         label: "метка2",
  //         value: "mark2",
  //       },
  //     ],
  //     nodes: [],
  //     flag: false,
  //     links: [],
  //   },
  //   "task-3": {
  //     id: "task-3",
  //     content: "Change my phone",
  //     marks: [],
  //     nodes: [],
  //     flag: true,
  //     links: [],
  //   },
  //   "task-4": {
  //     id: "task-4",
  //     content: "Cook dinner",
  //     nodes: [],
  //     marks: [
  //       {
  //         label: "метка1",
  //         value: "mark1",
  //       },
  //       {
  //         label: "метка2",
  //         value: "mark2",
  //       },
  //       {
  //         label: "метка3",
  //         value: "mark3",
  //       },
  //     ],
  //     flag: false,
  //     links: [],
  //   },
  // },
  // columns: {
  //   "column-1": {
  //     id: "column-1",
  //     title: "Новые",
  //     taskIds: ["task-1", "task-2"],
  //     limit: 3,
  //   },
  //   "column-2": {
  //     id: "column-2",
  //     title: "В работе",
  //     taskIds: ["task-3"],
  //     limit: "",
  //   },
  //   "column-3": {
  //     id: "column-3",
  //     title: "Готово",
  //     taskIds: ["task-4"],
  //     limit: "",
  //   },
  // },
  // columnOrder: ["column-1", "column-2", "column-3"],

  tasks: {},
  columns: {},
  columnOrder: [],

  searchValue: "",

  comments: [
    {
      id: Date.now(),
      taskId: "task-1",
      user: {
        fio: "Иванов Иван Иванович",
        avatar: "",
      },
      date: "19.08.2022",
      text: "Какой то текст. Просто что бы было что-то написано.",
    },
    {
      id: Date.now() + 1,
      taskId: "task-1",
      user: {
        fio: "Петров Петр Петрович",
        avatar: "",
      },
      date: "01.08.2022",
      text: "Совершенно другой тестовый текст.",
    },
  ],

  files: [],
  uploadFiles: [],
  progresCurrentFile: null,
};

export const toDoSlice = createSlice({
  name: "toDo",
  initialState,
  reducers: {
    initialTaskList(state: any, action: any) {
      const { tasks, columns, columnOrder } = action.payload;

      state.tasks = tasks;
      state.columns = columns;
      state.columnOrder = columnOrder;
    },

    // updateTodoList(state: any, action: any) {
    //   const { destination, source, draggableId, type } = action.payload;

    //   console.log("destination", destination);
    //   console.log("source", source);
    //   console.log("draggableId", draggableId);
    //   console.log("type", type);

    //   if (!destination) {
    //     return;
    //   }

    //   if (
    //     destination.droppableId === source.droppableId &&
    //     destination.index === source.index
    //   ) {
    //     return;
    //   }

    //   if (type === "column") {
    //     state.columnOrder.splice(source.index, 1);
    //     state.columnOrder.splice(destination.index, 0, draggableId);

    //     return;
    //   }

    //   const start = state.columns[source.droppableId];
    //   const finish = state.columns[destination.droppableId];

    //   if (start === finish) {
    //     // const newTaskIds = Array.from(start.taskIds);
    //     start?.taskIds?.splice(source.index, 1);
    //     start?.taskIds?.splice(destination.index, 0, draggableId);

    //     return start?.taskIds;
    //   }

    //   start?.taskIds?.splice(source.index, 1);

    //   finish?.taskIds.splice(destination.index, 0, draggableId);
    // },

    addTask(state: any, action) {
      const id = `task-${Date.now().toString()}`;
      const { value, columnId, position } = action.payload;

      state.tasks[id] = {
        id,
        content: value,
        marks: [],
        nodes: [],
        flag: false,
        links: [],
      };

      state.columns[columnId].taskIds.splice(position, 0, id);
    },

    addColumn(state: any, action) {
      const id = new Date().toString();
      state.columns[id] = {
        id,
        title: "",
        taskIds: [],
        taskLimit: null,
      };

      state.columnOrder.push(id);
    },

    addTitleColumn(state: any, action) {
      const { columnId, title } = action.payload;

      if (title) {
        state.columns[columnId].title = title;
      } else {
        delete state.columns[columnId];
        state.columnOrder = state.columnOrder.filter(
          (i: any) => i !== columnId
        );
      }
    },

    addLimitTasks(state: any, action) {
      const { columnId, limit } = action.payload;

      state.columns[columnId].limit = limit;
    },

    removeTask(state: any, action) {
      const { columnId, taskId } = action.payload;
      delete state.tasks[taskId];
      state.columns[columnId].taskIds = state.columns[columnId].taskIds.filter(
        (t: any) => t !== taskId
      );
    },

    removeColumn(state: any, action) {
      const { columnId } = action.payload;
      delete state.columns[columnId];
      state.columnOrder = state.columnOrder.filter((c: any) => c !== columnId);
    },

    editTask(state: any, action) {
      const { taskId, data, dataName } = action.payload;
      state.tasks[taskId] = {
        ...state.tasks[taskId],
        [dataName]: data,
      };
      // state.tasks[taskId].content = content;
    },

    addMarksTask(state: any, action) {
      const { taskId, marks } = action.payload;
      state.tasks[taskId].marks = [...state.tasks[taskId].marks, ...marks];
    },

    changeMarksTask(state: any, action) {
      const { taskId, marks } = action.payload;
      // state.tasks[taskId].marks = [];
      state.tasks[taskId].marks = marks;
    },

    removeTaskLink(state: any, action) {
      const { taskId, links } = action.payload;
      state.tasks[taskId].links = links;
    },

    searchTasks(state: any, action) {
      const { value } = action.payload;
      state.searchValue = value;
    },

    transitionTask(state: any, action) {
      const { fromColumnId, toColumnId, taskId } = action.payload;
      state.columns[fromColumnId].taskIds = state.columns[
        fromColumnId
      ].taskIds.filter((task: any) => task !== taskId);
      state.columns[toColumnId].taskIds.unshift(taskId);
    },

    setFiles(state: any, action) {
      const { files } = action.payload;
      console.log("setFiles", files);
      state.files = files;
      // debugger;
    },

    deleteFile(state: any, action) {
      // state.files = state.files.splice(0, 1);
      state.files = [...state.files.slice(1)];
      console.log(state.files);
      // debugger;
    },

    setProgresCurrentFile(state: any, action) {
      const { progresCurrentFile } = action.payload;
      state.progresCurrentFile = progresCurrentFile;
      // debugger;
    },

    setUploadFiles(state: any, action) {
      const { file, task, uploadFileToGraphQl } = action.payload;
      console.log("file", file);
      // state.uploadFiles = state.uploadFiles.push(file);
      // state.uploadFiles = [...state.uploadFiles, file];

      state.tasks[task.id].files = [...state.tasks[task.id].files, file];
      uploadFileToGraphQl(state.tasks[task.id].files);

      state.progresCurrentFile = null;
      state.files = [...state.files.slice(1)];
      console.log("state.uploadFiles", state.uploadFiles);
      // debugger;
    },
  },
});

export default toDoSlice.reducer;
