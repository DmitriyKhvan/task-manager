import React, { Fragment, useCallback, useRef, useState } from "react";

import Button from "@atlaskit/button/standard-button";
import Textfield from "@atlaskit/textfield";

import Modal, {
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTransition,
} from "@atlaskit/modal-dialog";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { flagSlice } from "../../../store/reducers/FlagSlice";

import Form, {
  ErrorMessage,
  Field,
  FormSection,
  HelperMessage,
  ValidMessage,
} from "@atlaskit/form";
import { toDoSlice } from "../../../store/reducers/ToDoSlice";

import styles from "./limitTasks.module.scss";
import { useMutation } from "@apollo/client";
import { ADD_COLUMN } from "../../../apollo/Mutation";
import { GET_COLUMNS } from "../../../apollo/Queries";

export default function ModalLimitTasks() {
  const [updateColumn, { loading, error, data }] = useMutation(ADD_COLUMN, {
    refetchQueries: [GET_COLUMNS],
  });
  const { limitTasks } = useSelector((state: any) => state.flagReducer);
  const dispatch = useDispatch();
  const { modalLimitTasks } = flagSlice.actions;
  const { addLimitTasks } = toDoSlice.actions;
  const closeModal = useCallback(
    () =>
      dispatch(
        modalLimitTasks({
          isOpen: false,
          column: null,
        })
      ),
    []
  );

  const submitHandler = (data: any) => {
    console.log("data", data);

    updateColumn({
      variables: {
        columns: [
          {
            id: limitTasks.column.id,
            taskLimit: data.limitTask ? Number(data.limitTask) : null,
          },
        ],
      },
    });
    // dispatch(
    //   addLimitTasks({
    //     columnId: limitTasks.column.id,
    //     limit: Number(data.limitTask),
    //   })
    // );
    if (!error) {
      closeModal();
    }
  };

  const focusRef = useRef();

  const validate = (value: any) => {
    if (Number(value) >= 0 && Number(value) <= 999) {
      return undefined;
    }
    return "NOT_NUMBER";
  };

  return (
    <ModalTransition>
      {limitTasks.isOpen && (
        <Modal autoFocus={focusRef} onClose={closeModal} width="small">
          <Form onSubmit={submitHandler}>
            {({ formProps, submitting, reset }) => (
              <form {...formProps}>
                <ModalHeader>
                  <ModalTitle>Ограничение для столбца</ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <p>
                    Этот столбец будет выделен, если число задач в нем превысит
                    указанное ограничение.
                  </p>

                  <div className={styles.formSectionWrap}>
                    <Field
                      // aria-required={true}
                      name="limitTask"
                      label="Максимальное число задач"
                      defaultValue={limitTasks.column.limit}
                      // isRequired
                      validate={validate}
                    >
                      {({ fieldProps, error, valid, meta }: any) => {
                        return (
                          <Fragment>
                            <div className={styles.textfieldWrap}>
                              <div className={styles.textfield}>
                                <Textfield
                                  ref={focusRef}
                                  type="text"
                                  maxLength={3}
                                  {...fieldProps}
                                  placeholder="Без ограничений"
                                  // onChange={setLimitHandler}
                                />
                                {/* {error && !valid && (
                              <HelperMessage>
                                Use 8 or more characters with a mix of letters,
                                numbers and symbols.
                              </HelperMessage>
                            )} */}
                                {error ? (
                                  <ErrorMessage>
                                    Введите число от 0 до 999
                                  </ErrorMessage>
                                ) : (
                                  <div className={styles.mocDiv}></div>
                                )}
                                {/* {valid && meta.dirty ? (
                              <ValidMessage>Awesome password!</ValidMessage>
                            ) : null} */}
                              </div>
                              {/* <pre>
                                {JSON.stringify(fieldProps.value, null, 2)}
                              </pre> */}
                              {(fieldProps.value || fieldProps.value === 0) && (
                                <Button
                                  className={styles.resetLimit}
                                  appearance="subtle"
                                  onClick={() => {
                                    reset({ limitTask: "" });
                                  }}
                                >
                                  Сбросить ограничение
                                </Button>
                              )}
                            </div>
                            <div className={styles.btns}>
                              <Button
                                isDisabled={error}
                                type="submit"
                                appearance="primary"
                                autoFocus
                              >
                                Сохранить
                              </Button>

                              <Button onClick={closeModal} appearance="subtle">
                                Отмена
                              </Button>
                            </div>
                          </Fragment>
                        );
                      }}
                    </Field>
                  </div>
                </ModalBody>
                {/* <ModalFooter>
                  <Button type="submit" appearance="primary" autoFocus>
                    Сохранить
                  </Button>
                  <Button onClick={closeModal} appearance="subtle">
                    Отмена
                  </Button>
                </ModalFooter> */}
              </form>
            )}
          </Form>
        </Modal>
      )}
    </ModalTransition>
  );
}
