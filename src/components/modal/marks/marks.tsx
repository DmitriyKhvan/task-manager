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
import { useMutation } from "@apollo/client";
import { ADD_TASK } from "../../../apollo/Mutation";
import { updateStore } from "../../../utils/updateStore";

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
  selectOptions = [];
  const handleChange = (newValue: any, actionMeta: any) => {
    console.group("Value Changed");
    console.log(newValue);
    // newValue.forEach((e) => selectOptions.push(e));
    // selectOptions = [];
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
  const [addTaskQuery, { loading, error, data }] = useMutation(ADD_TASK, {
    onCompleted: (data) => {
      dispatch(updateStore(data.TM_addTask.body));
    },
    // refetchQueries: [{ query: GET_COLUMNS }],
  });

  const {
    modalTaskData: { isOpen, task, column },
  } = useSelector((state: any) => state.flagReducer);
  const dispatch = useDispatch();
  const { setModalTaskData } = flagSlice.actions;
  const { addMarksTask } = toDoSlice.actions;

  const orderTask = column?.taskIds.findIndex(
    (taskId: any) => taskId === task.id
  );

  const [marks, setMarks] = useState({
    isLoading: false,
    options: defaultOptions,
    value: [],
  });
  const closeModal = () =>
    dispatch(
      setModalTaskData({
        isOpen: false,
        task: null,
      })
    );

  const addMarks = () => {
    // const data = {
    //   id: task.id,
    //   content: task.content,
    //   files: task.files,
    //   flag: task.flag,
    //   links: JSON.stringify(task.links),
    //   // marks: JSON.stringify(marks.value),
    //   marks: [...task.marks, ...marks.value],
    //   nodes: JSON.stringify(task.nodes),
    //   columnId: column.id,
    //   order: orderTask,
    // };

    // console.log("1111", data);

    addTaskQuery({
      variables: {
        tasks: {
          id: task.id,
          content: task.content,
          files: JSON.stringify(task.files),
          flag: task.flag,
          links: JSON.stringify(task.links),
          // marks: JSON.stringify(marks.value),
          marks: JSON.stringify([...task.marks, ...marks.value]),
          nodes: JSON.stringify(task.nodes),
          columnId: column.id,
          order: orderTask,
        },
      },
    });
    // dispatch(
    //   addMarksTask({
    //     taskId: task.id,
    //     marks: marks.value,
    //   })
    // );

    setMarks({ ...marks, value: [] });

    if (!error) {
      closeModal();
    }
  };

  // const removeColumnHandler = useCallback(() => {
  //   closeModal();
  //   dispatch(removeColumn({ columnId: columnData.column.id }));
  // });

  return (
    <ModalTransition>
      {isOpen && (
        <Modal onClose={closeModal} width="medium">
          <ModalHeader>
            <ModalTitle>
              Добавить метки к ключу{" "}
              <span style={{ textTransform: "uppercase" }}>{task.id}</span>
            </ModalTitle>
          </ModalHeader>
          <div className={styles.modalBody}>
            <MarksSelector state={marks} setState={setMarks}></MarksSelector>
          </div>
          <ModalFooter>
            <Button
              isDisabled={marks.value.length ? false : true}
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
