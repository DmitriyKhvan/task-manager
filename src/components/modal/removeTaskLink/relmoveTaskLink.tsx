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

export default function ModalRemoveTaskLink() {
  const { taskLinks } = useSelector((state: any) => state.flagReducer);
  const dispatch = useDispatch();
  const { modalTaskLinks }: any = flagSlice.actions;
  const { removeTaskLink }: any = toDoSlice.actions;
  const closeModal = useCallback(
    () =>
      dispatch(
        modalTaskLinks({
          isOpen: false,
          task: null,
          links: null,
        })
      ),
    []
  );

  const removeTaskLinkHandler: any = useCallback(() => {
    closeModal();
    dispatch(
      removeTaskLink({ taskId: taskLinks.task.id, links: taskLinks.links })
    );
  }, []);

  return (
    <ModalTransition>
      {taskLinks.isOpen && (
        <Modal onClose={closeModal} width="small">
          <ModalHeader>
            <ModalTitle appearance="danger">
              Удалить эту ссылку на веб-страницу?
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p>При желании вы сможете добавить ссылку снова.</p>
          </ModalBody>
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
