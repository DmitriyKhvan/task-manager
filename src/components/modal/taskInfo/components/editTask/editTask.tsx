import { useMutation } from "@apollo/client";
import InlineEdit from "@atlaskit/inline-edit";
import TextArea from "@atlaskit/textarea";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ADD_TASK } from "../../../../../apollo/Mutation";
import { toDoSlice } from "../../../../../store/reducers/ToDoSlice";
import { updateStore } from "../../../../../utils/updateStore";

const EditTask = (props: any) => {
  const { task, column } = props;

  const [addTaskQuery, { loading, error, data }] = useMutation(ADD_TASK, {
    onCompleted: (data) => {
      dispatch(updateStore(data.TM_addTask.body));
    },
    // refetchQueries: [{ query: GET_COLUMNS }],
  });

  const { tasks, columns } = useSelector((state: any) => state.toDoReducer);

  const taskFind = tasks[task.id];

  const columnFind: any = Object.values(columns).find((col: any) =>
    col.taskIds.includes(taskFind.id)
  );

  //позиция таска в столбце
  const orderTask = columnFind?.taskIds.findIndex(
    (taskId: any) => taskId === taskFind.id
  );

  const [editContent, setEditContent] = useState(taskFind.content);
  const dispatch = useDispatch();
  const { editTask } = toDoSlice.actions;

  const editTaskHandler = (content: any) => {
    if (content.trim()) {
      setEditContent(content);
      dispatch(
        editTask({
          taskId: taskFind.id,
          data: content,
          dataName: "content",
        })
      );

      addTaskQuery({
        variables: {
          tasks: {
            id: taskFind.id,
            content: content,
            files: JSON.stringify(taskFind.files),
            flag: taskFind.flag,
            links: JSON.stringify(taskFind.links),
            marks: JSON.stringify(taskFind.marks),
            nodes: JSON.stringify(taskFind.nodes),
            columnId: columnFind.id,
            order: orderTask,
          },
        },
      });
    }
  };

  const changeHeight = () => {};

  return (
    <div className="wrapStyles">
      <InlineEdit
        defaultValue={editContent}
        // label="Inline edit textarea (keeps edit view on blur)"
        editView={({ errorMessage, ...fieldProps }: any, ref) => (
          // @ts-ignore - textarea does not pass through ref as a prop
          <h1>
            <TextArea
              rows={1}
              {...fieldProps}
              ref={ref}
              className="editTextAreaTask"
            />
          </h1>
        )}
        readView={() => <div className="taskTitle">{editContent}</div>}
        onEdit={changeHeight}
        onConfirm={editTaskHandler}
        // keepEditViewOpenOnBlur
        // startWithEditViewOpen
        readViewFitContainerWidth
        isRequired
      />
    </div>
  );
};

export default EditTask;
