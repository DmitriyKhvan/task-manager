import React, { useCallback } from "react";

import Button from "@atlaskit/button/standard-button";

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from "@atlaskit/modal-dialog";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { flagSlice } from "../../../store/reducers/FlagSlice";
import { toDoSlice } from "../../../store/reducers/ToDoSlice";
import styles from "./removeTask.module.scss";

export default function ModalRemoveTask() {
  const { taskData } = useSelector((state: any) => state.flagReducer);
  const dispatch = useDispatch();
  const { setTaskData } = flagSlice.actions;
  const { removeTask } = toDoSlice.actions;
  const closeModal = useCallback(
    () =>
      dispatch(
        setTaskData({
          modal: false,
          taskId: null,
          columnId: null,
        })
      ),
    []
  );

  const removeTaskHandler = useCallback(() => {
    closeModal();
    dispatch(
      removeTask({ columnId: taskData.columnId, taskId: taskData.taskId })
    );
  }, [removeTask]);

  return (
    <ModalTransition>
      {taskData.modal && (
        <Modal onClose={closeModal} width="small">
          <ModalHeader>
            <ModalTitle appearance="danger">
              Удалить {taskData.taskId}?
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p>
              Вы собираетесь навсегда удалить эту задачу, а также связанные с
              ней комментарии, данные и вложения.
            </p>

            <p>Вместо этого вы можете решить ее или закрыть.</p>
          </ModalBody>
          <ModalFooter>
            <Button appearance="danger" onClick={removeTaskHandler} autoFocus>
              Удалить
            </Button>
            <Button appearance="subtle" onClick={closeModal}>
              Отмена
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </ModalTransition>
  );
}
