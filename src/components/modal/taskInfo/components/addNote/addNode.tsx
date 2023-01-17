import React, { memo, useCallback, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { toDoSlice } from "../../../../../store/reducers/ToDoSlice";

import Form, { Field, FormFooter } from "@atlaskit/form";
import ButtonGroup from "@atlaskit/button/button-group";
import LoadingButton from "@atlaskit/button/loading-button";
import Button from "@atlaskit/button/standard-button";
import TextField from "@atlaskit/textfield";
import { useMutation } from "@apollo/client";
import { ADD_TASK } from "../../../../../apollo/Mutation";
import { updateStore } from "../../../../../utils/updateStore";

const AddNote = memo(
  ({ task: { column, isOpen, task }, setVisibleField }: any) => {
    const [addTaskQuery, { loading, error, data }] = useMutation(ADD_TASK, {
      onCompleted: (data) => {
        dispatch(updateStore(data.TM_addTask.body));
      },
      // refetchQueries: [{ query: GET_COLUMNS }],
    });

    const [disable, setDisable] = useState(true);
    const dispatch = useDispatch();
    const { editTask } = toDoSlice.actions;
    const { tasks, columns } = useSelector((state: any) => state.toDoReducer);

    const taskFind = tasks[task.id];

    const columnFind: any = Object.values(columns).find((col: any) =>
      col.taskIds.includes(taskFind.id)
    );

    const orderTask = column?.taskIds.findIndex(
      (taskId: any) => taskId === taskFind.id
    );

    const addNote: any = (data: any, form: any) => {
      const nodes: any = [
        ...taskFind.nodes,
        {
          id: Date.now(),
          content: data.content,
          stage: "to-do",
          date: Date.now().toString(),
        },
      ];

      addTaskQuery({
        variables: {
          tasks: {
            id: task.id,
            content: task.content,
            files: JSON.stringify(task.files),
            flag: task.flag,
            links: JSON.stringify(task.links),
            // marks: JSON.stringify(marks.value),
            marks: JSON.stringify(task.marks),
            nodes: JSON.stringify(nodes),
            // columnId: column.id,
            columnId: columnFind.id,
            order: orderTask,
          },
        },
      });

      // dispatch(
      //   editTask({
      //     taskId: task.id,
      //     data: nodes,
      //     dataName: "nodes",
      //   })
      // );

      if (!error) {
        form.reset({ content: "" });
        setDisable(true);
      }
    };

    const changeNodeHandler = (event: any) => {
      if (event.target.value) {
        setDisable(false);
      } else {
        setDisable(true);
      }
    };

    const cancelAddNode = () => {
      setVisibleField(false);
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
  }
);

export default AddNote;
