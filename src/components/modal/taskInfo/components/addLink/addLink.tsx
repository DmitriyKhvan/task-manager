import React, { Fragment, memo, useState } from "react";

import ButtonGroup from "@atlaskit/button/button-group";
import LoadingButton from "@atlaskit/button/loading-button";
import Button from "@atlaskit/button/standard-button";
import TextField from "@atlaskit/textfield";
import styles from "./addLink.module.scss";

import Form, {
  ErrorMessage,
  Field,
  FormFooter,
  FormHeader,
  FormSection,
  HelperMessage,
  ValidMessage,
} from "@atlaskit/form";
import { useDispatch } from "react-redux";
import { toDoSlice } from "../../../../../store/reducers/ToDoSlice";
import { useSelector } from "react-redux";
import { useCallback } from "react";
import { useMutation } from "@apollo/client";
import { ADD_TASK } from "../../../../../apollo/Mutation";
import { updateStore } from "../../../../../utils/updateStore";

const AddLink = memo(
  ({ task: { task, column, isOpen }, setVisibleAddLink }: any) => {
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

    const [disable, setDisable] = useState(true);
    const dispatch: any = useDispatch();
    const { editTask } = toDoSlice.actions;
    const { tasks } = useSelector((state: any) => state.toDoReducer);

    const taskFind = tasks[task.id];

    const addLinkHandler: any = (data: any, form: any) => {
      const { url, text }: any = data;

      const links = [
        ...taskFind.links,
        {
          id: Date.now(),
          url,
          text,
        },
      ];

      addTaskQuery({
        variables: {
          tasks: {
            id: task.id,
            content: task.content,
            files: task.files,
            flag: task.flag,
            links: JSON.stringify(links),
            marks: JSON.stringify(task.marks),
            nodes: JSON.stringify(task.nodes),
            columnId: column.id,
            order: orderTask,
          },
        },
      });

      // dispatch(
      //   editTask({
      //     taskId: task.id,
      //     data: links,
      //     dataName: "links",
      //   })
      // );

      if (!error) {
        form.reset({ url: "", text: "" });
        setDisable(true);
      }
    };

    const validate = (e: any): any => {
      if (
        e.match(
          /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
        )
        // e.length > 1
      ) {
        setDisable(false);
        return false;
      }
      setDisable(true);
      return true;
    };

    return (
      <div>
        <Form onSubmit={addLinkHandler}>
          {({ formProps, submitting }) => (
            <form {...formProps}>
              <div className={styles.linkWrap}>
                <Field
                  // aria-required={true}
                  name="url"
                  defaultValue=""
                  label="URL"
                  validate={validate}
                >
                  {({ fieldProps, error }) => (
                    <Fragment>
                      <TextField
                        autoComplete="off"
                        {...fieldProps}
                        placeholder="htts://www.example.com"
                        autoFocus
                      />

                      {error && (
                        <ErrorMessage>
                          Введите действительный URL-адрес, начинающийся с
                          http:// или https://
                        </ErrorMessage>
                      )}
                    </Fragment>
                  )}
                </Field>

                <Field
                  aria-required={true}
                  name="text"
                  defaultValue=""
                  label="Текст ссылки"
                >
                  {({ fieldProps, error, valid }) => (
                    <TextField
                      {...fieldProps}
                      placeholder="Добавить описание"
                    />
                  )}
                </Field>
              </div>
              <div className={styles.formFooter}>
                <FormFooter>
                  <ButtonGroup>
                    <LoadingButton
                      type="submit"
                      appearance="primary"
                      isLoading={submitting}
                      isDisabled={disable}
                    >
                      Связать
                    </LoadingButton>
                    <Button
                      onClick={() => setVisibleAddLink(false)}
                      appearance="subtle"
                    >
                      Отмена
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

export default AddLink;
