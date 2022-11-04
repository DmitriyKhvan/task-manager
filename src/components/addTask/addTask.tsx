import { useState } from "react";
import TextArea from "@atlaskit/textarea";
import InlineEdit from "@atlaskit/inline-edit";
import AddIcon from "@atlaskit/icon/glyph/add";
import Button from "@atlaskit/button";

import "./addTask.scss";
import { useDispatch } from "react-redux";
import { toDoSlice } from "../../store/reducers/ToDoSlice";
import { useSelector } from "react-redux";

const AddTaskBtn = (props: any) => {
  const isActive = true;
  return (
    <Button
      className={props.title !== "To do" ? "addBtn opacityBtn" : "addBtn"}
      iconBefore={<AddIcon label="add icon" size="small" />}
      appearance="subtle"
    >
      Создать задачу
    </Button>
  );
};

const AddTask = (props: any) => {
  const [editValue, setEditValue] = useState("");
  const { addTask } = toDoSlice.actions;
  const dispatch = useDispatch();

  const addTaskValue = (value: any) => {
    if (value) {
      setEditValue(value);
      dispatch(
        addTask({
          value,
          columnId: props.column.id,
          position: props.column.taskIds.length,
        })
      );
      setEditValue("");
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.target.blur();
      addTaskValue(event.target.value.trim());
    }

    setEditValue("");
  };

  return (
    <div className="textAreaWrap">
      <InlineEdit
        defaultValue={editValue}
        editView={({ errorMessage, ...fieldProps }, ref) => (
          // @ts-ignore - textarea does not pass through ref as a prop
          <TextArea
            placeholder="Что нужно сделать?"
            resize="none"
            {...fieldProps}
            ref={ref}
            onKeyPress={(event) => {
              handleKeyPress(event);
            }}
          />
        )}
        readView={() => <AddTaskBtn title={props.column.title}></AddTaskBtn>}
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
};

export default AddTask;
