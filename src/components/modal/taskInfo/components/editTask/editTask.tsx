import { useMutation } from "@apollo/client";
import InlineEdit from "@atlaskit/inline-edit";
import TextArea from "@atlaskit/textarea";
import { useState } from "react";
import { useDispatch } from "react-redux";
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

  //позиция таска в столбце
  const orderTask = column?.taskIds.findIndex(
    (taskId: any) => taskId === task.id
  );

  const [editContent, setEditContent] = useState(task.content);
  const dispatch = useDispatch();
  const { editTask } = toDoSlice.actions;

  const editTaskHandler = (content: any) => {
    if (content.trim()) {
      setEditContent(content);
      dispatch(
        editTask({
          taskId: task.id,
          data: content,
          dataName: "content",
        })
      );

      addTaskQuery({
        variables: {
          tasks: {
            id: task.id,
            content: content,
            files: JSON.stringify(task.files),
            flag: task.flag,
            links: JSON.stringify(task.links),
            marks: JSON.stringify(task.marks),
            nodes: JSON.stringify(task.nodes),
            columnId: column.id,
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
