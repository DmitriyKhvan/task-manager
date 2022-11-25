import { memo, useState } from "react";
import TextArea from "@atlaskit/textarea";
import InlineEdit from "@atlaskit/inline-edit";
import Button from "@atlaskit/button";
import NewFeature24Icon from "@atlaskit/icon-object/glyph/new-feature/24";

import styles from "./addBetweenTasks.module.scss";
import { toDoSlice } from "../../store/reducers/ToDoSlice";
import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/client";
import { ADD_TASK } from "../../apollo/Mutation";
import { GET_COLUMNS } from "../../apollo/Queries";
import { updateStore } from "../../utils/updateStore";

const AddBetweenTasksBtn = () => {
  return (
    <Button
      className={styles.addBetweenTasksBtn}
      iconBefore={<NewFeature24Icon label="add icon" size="small" />}
      appearance="primary"
    ></Button>
  );
};

const AddBetweenTasks = memo((props: any) => {
  const [addTaskQuery, { loading, error, data }] = useMutation(ADD_TASK, {
    onCompleted: (data) => {
      dispatch(updateStore(data.TM_addTask.body));
    },
    // refetchQueries: [{ query: GET_COLUMNS }],
  });

  const [editValue, setEditValue] = useState("");
  const { addTask } = toDoSlice.actions;
  const dispatch = useDispatch();

  const addTaskValue = (value: any) => {
    if (value) {
      dispatch(
        addTask({
          value,
          columnId: props.column.id,
          position: props.taskIndex,
        })
      );

      addTaskQuery({
        variables: {
          tasks: {
            // id: `task_${Date.now().toString()}`,
            columnId: props.column.id,
            content: value,
            files: "[]",
            flag: false,
            links: "[]",
            marks: "[]",
            nodes: "[]",
            order: props.taskIndex,
          },
        },
      });
    }
  };

  const handleKeyPress: any = (event: any, fieldProps: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.target.blur();
      addTaskValue(event.target.value.trim());
    }

    setEditValue("");
  };

  return (
    <div className={styles.textAreaWrap}>
      <InlineEdit
        defaultValue={editValue}
        editView={({ errorMessage, ...fieldProps }, ref) => (
          // @ts-ignore - textarea does not pass through ref as a prop
          <TextArea
            className={styles.textAreaBetweenTasks}
            placeholder="Что нужно сделать?"
            resize="none"
            {...fieldProps}
            ref={ref}
            onKeyPress={(event) => handleKeyPress(event)}
          />
        )}
        readView={() => {
          return (
            <div className={styles.addBetweenTasksBtnWrap}>
              <AddBetweenTasksBtn></AddBetweenTasksBtn>
            </div>
            // <div className={styles.addBetweenTasksBtn}>
            //   <NewFeature24Icon></NewFeature24Icon>
            // </div>
          );
        }}
        onConfirm={(value) => {
          // setEditValue(value);
          // addTaskValue(value);
        }}
        // keepEditViewOpenOnBlur
        readViewFitContainerWidth
        hideActionButtons
      />
    </div>
  );
});

export default AddBetweenTasks;
