import React, { Component, useCallback } from "react";

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

import { CreatableSelect, OptionType, ValueType } from "@atlaskit/select";
import styles from "./marks.module.scss";
import { useState } from "react";

const defaultOptions = [
  { label: "Adelaide", value: "adelaide" },
  { label: "Brisbane", value: "brisbane" },
  { label: "Canberra", value: "canberra" },
  { label: "Darwin", value: "darwin" },
  { label: "Hobart", value: "hobart" },
  { label: "Melbourne", value: "melbourne" },
  { label: "Perth", value: "perth" },
  { label: "Sydney", value: "sydney" },
];

const createOption = (label: any) => ({
  label,
  // value: label.toLowerCase().replace(/\W/g, ""),
  value: label,
});

let selectOptions: any = [];

const MarksSelector = (props: any) => {
  const handleChange = (newValue: any, actionMeta: any) => {
    console.group("Value Changed");
    console.log(newValue);
    // newValue.forEach((e) => selectOptions.push(e));
    selectOptions = [];
    newValue.forEach((e: any) => selectOptions.push(e));
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    props.setState({ ...props.state, value: selectOptions });
  };

  const handleCreate = (inputValue: any) => {
    // We do not assume how users would like to add newly created options to the existing options list.
    // Instead we pass users through the new value in the onCreate prop
    props.setState({ isLoading: true });
    console.group("Option created");
    console.log("Wait a moment...");
    const { options } = props.state;
    const newOption = createOption(inputValue);

    selectOptions.push(newOption);
    console.log(newOption);
    console.groupEnd();
    props.setState({
      isLoading: false,
      options: [...options, newOption],
      value: selectOptions,
    });
  };

  const { isLoading, options, value } = props.state;
  return (
    <>
      <label htmlFor="createable-select-example">
        Начните набирать для поиска и создания меток
      </label>
      <CreatableSelect
        inputId="createable-select-example"
        isClearable
        isDisabled={isLoading}
        isLoading={isLoading}
        onChange={handleChange}
        onCreateOption={handleCreate}
        options={options}
        value={value}
        placeholder="Метки"
        isMulti
      />
    </>
  );
};

export default function ModalMarks() {
  const { modalTaskData } = useSelector((state: any) => state.flagReducer);
  const dispatch = useDispatch();
  const { setModalTaskData } = flagSlice.actions;
  const { addMarksTask } = toDoSlice.actions;

  const [state, setState] = useState({
    isLoading: false,
    options: defaultOptions,
    value: [],
  });
  const closeModal = useCallback(
    () =>
      dispatch(
        setModalTaskData({
          isOpen: false,
          task: null,
        })
      ),
    []
  );

  const addMarks = useCallback(() => {
    dispatch(
      addMarksTask({
        taskId: modalTaskData.task.id,
        marks: state.value,
      })
    );

    setState({ ...state, value: [] });

    closeModal();
  }, [addMarksTask, setState, closeModal]);

  // const removeColumnHandler = useCallback(() => {
  //   closeModal();
  //   dispatch(removeColumn({ columnId: columnData.column.id }));
  // });

  return (
    <ModalTransition>
      {modalTaskData.isOpen && (
        <Modal onClose={closeModal} width="medium">
          <ModalHeader>
            <ModalTitle>
              Добавить метки к ключу{" "}
              <span style={{ textTransform: "uppercase" }}>
                {modalTaskData.task.id}
              </span>
            </ModalTitle>
          </ModalHeader>
          <div className={styles.modalBody}>
            <MarksSelector state={state} setState={setState}></MarksSelector>
          </div>
          <ModalFooter>
            <Button
              isDisabled={state.value.length ? false : true}
              appearance="primary"
              onClick={addMarks}
              autoFocus
            >
              Готово
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
