import React, { memo, useCallback, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { toDoSlice } from "../../../../../store/reducers/ToDoSlice";

import Form, { Field, FormFooter } from "@atlaskit/form";
import ButtonGroup from "@atlaskit/button/button-group";
import LoadingButton from "@atlaskit/button/loading-button";
import Button from "@atlaskit/button/standard-button";
import TextField from "@atlaskit/textfield";

const AddNote = memo((props: any) => {
  const [disable, setDisable] = useState(true);
  const dispatch = useDispatch();
  const { editTask } = toDoSlice.actions;
  const { tasks, columns } = useSelector((state: any) => state.toDoReducer);

  const task = tasks[props.task.task.id];

  const addNote: any = (data: any, form: any) => {
    const nodes: any = [
      ...task.nodes,
      {
        id: Date.now(),
        content: data.content,
        stage: "to-do",
        date: Date.now().toString(),
      },
    ];

    dispatch(
      editTask({
        taskId: props.task.task.id,
        data: nodes,
        dataName: "nodes",
      })
    );

    form.reset({ content: "" });
    setDisable(true);
  };

  const changeNodeHandler = useCallback((event: any) => {
    if (event.target.value) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, []);

  const cancelAddNode = () => {
    props.setVisibleField(false);
  };

  return (
    <div>
      <Form onSubmit={(content, form) => addNote(content, form)}>
        {({ formProps, submitting, reset }) => (
          <form {...formProps}>
            <Field
              aria-required={true}
              name="content"
              defaultValue=""
              // label="Username"
              isRequired
            >
              {({ fieldProps, error, valid }) => (
                <TextField
                  onInput={(e) => changeNodeHandler(e)}
                  placeholder="Что нужно делать?"
                  autoComplete="off"
                  {...fieldProps}
                  autoFocus
                />
              )}
            </Field>
            <div className="formFooter">
              <FormFooter>
                <ButtonGroup>
                  <LoadingButton
                    type="submit"
                    appearance="primary"
                    isLoading={submitting}
                    isDisabled={disable}
                  >
                    Создать
                  </LoadingButton>
                  <Button onClick={cancelAddNode} appearance="subtle">
                    Отменить
                  </Button>
                </ButtonGroup>
              </FormFooter>
            </div>
          </form>
        )}
      </Form>
    </div>
  );
});

export default AddNote;
