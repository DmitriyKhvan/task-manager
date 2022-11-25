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

export default function ModalRemoveTaskLink() {
  const [addTaskQuery, { loading, error, data }] = useMutation(ADD_TASK, {
    onCompleted: (data) => {
      dispatch(updateStore(data.TM_addTask.body));
    },
    // refetchQueries: [{ query: GET_COLUMNS }],
  });

  const { taskLinks } = useSelector((state: any) => state.flagReducer);
  const dispatch = useDispatch();
  const { modalTaskLinks }: any = flagSlice.actions;
  const { removeTaskLink }: any = toDoSlice.actions;

  const orderTask = taskLinks.column?.taskIds.findIndex(
    (taskId: any) => taskId === taskLinks.task?.id
  );

  const closeModal = () =>
    dispatch(
      modalTaskLinks({
        isOpen: false,
        task: null,
        links: null,
        column: null,
      })
    );

  const removeTaskLinkHandler: any = () => {
    addTaskQuery({
      variables: {
        tasks: {
          id: taskLinks.task.id,
          content: taskLinks.task.content,
          files: taskLinks.task.files,
          flag: taskLinks.task.flag,
          links: JSON.stringify(taskLinks.links),
          marks: JSON.stringify(taskLinks.task.marks),
          nodes: JSON.stringify(taskLinks.task.nodes),
          columnId: taskLinks.column.id,
          order: orderTask,
        },
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
