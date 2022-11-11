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
import styles from "./removeColumn.module.scss";
import { useMutation } from "@apollo/client";
import { REMOVE_COLUMN } from "../../../apollo/Mutation";
import { GET_COLUMNS } from "../../../apollo/Queries";

export default function ModalRemoveColumn() {
  const [removeColumnFetch, { loading, error, data }] = useMutation(
    REMOVE_COLUMN,
    { refetchQueries: [{ query: GET_COLUMNS }] }
  );
  const { columnData } = useSelector((state: any) => state.flagReducer);
  console.log("columnData", columnData);

  const dispatch = useDispatch();
  const { modalDeleteColumn } = flagSlice.actions;
  const { removeColumn } = toDoSlice.actions;
  const closeModal = useCallback(
    () =>
      dispatch(
        modalDeleteColumn({
          isOpen: false,
          column: null,
        })
      ),
    []
  );

  const removeColumnHandler = () => {
    const columnId = columnData.column.id;
    if (columnId) {
      console.log("columnId", columnId);

      removeColumnFetch({
        variables: {
          removedId: columnId,
        },
      });
    }

    if (!error) {
      closeModal();
      // dispatch(removeColumn({ columnId }));
    }
  };

  return (
    <ModalTransition>
      {columnData.isOpen && (
        <Modal onClose={closeModal} width="medium">
          <ModalHeader>
            <ModalTitle appearance="danger">
              Перемещение работ из столбца{" "}
              <span style={{ textTransform: "uppercase" }}>
                «{columnData.column.title}»
              </span>
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p>
              Выберите новое расположение для всех работ со статусом «
              {columnData.column.title}», включая работы в бэклоге.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button appearance="danger" onClick={removeColumnHandler} autoFocus>
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
