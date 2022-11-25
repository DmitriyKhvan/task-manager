import { toDoSlice } from "../store/reducers/ToDoSlice";
import { arrayToObject, transformData } from "./transformData";

export const updateStore = (data: any) => (dispatch: any) => {
  const { initialTaskList /*updateTodoList*/ } = toDoSlice.actions;
  let { tasks, columns, columnOrder } = transformData(data);

  dispatch(initialTaskList({ tasks, columns, columnOrder }));
  // debugger;
  return;
};
