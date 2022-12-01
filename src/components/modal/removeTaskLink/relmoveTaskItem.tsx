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
import styles from "./removeTaskLink.module.scss";
import { useMutation } from "@apollo/client";
import { ADD_TASK } from "../../../apollo/Mutation";
import { updateStore } from "../../../utils/updateStore";

export default function ModalRemoveTaskItem() {
  const [addTaskQuery, { loading, error, data }] = useMutation(ADD_TASK, {
    onCompleted: (data) => {
      dispatch(updateStore(data.TM_addTask.body));
    },
    // refetchQueries: [{ query: GET_COLUMNS }],
  });

  const { taskEdit } = useSelector((state: any) => state.flagReducer);
  const dispatch = useDispatch();
  const { modalTaskEdit }: any = flagSlice.actions;
  const { removeTaskLink }: any = toDoSlice.actions;

  const closeModal = () =>
    dispatch(
      modalTaskEdit({
        isOpen: false,
        task: null,
      })
    );

  const removeTaskLinkHandler: any = () => {
    addTaskQuery({
      variables: {
        tasks: taskEdit.task,
      },
    });

    if (!error) {
      closeModal();
      // dispatch(
      //   removeTaskLink({ taskId: taskLinks.task.id, links: taskLinks.links })
      // );
    }
  };

  return (
    <ModalTransition>
      {taskEdit.isOpen && (
        <Modal onClose={closeModal} width="small">
          <ModalHeader>
            <ModalTitle appearance="danger">{taskEdit.title}</ModalTitle>
          </ModalHeader>
          <ModalBody>{taskEdit.content}</ModalBody>
          <ModalFooter>
            <Button
              appearance="primary"
              onClick={removeTaskLinkHandler}
              autoFocus
            >
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
