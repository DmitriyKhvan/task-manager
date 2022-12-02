import { useMutation } from "@apollo/client";
import { CreatableSelect } from "@atlaskit/select";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { ADD_TASK } from "../../../../../../../apollo/Mutation";
import { toDoSlice } from "../../../../../../../store/reducers/ToDoSlice";
import { updateStore } from "../../../../../../../utils/updateStore";

const MarksSelector = (props: any) => {
  const { task, column, changeMaskHandler } = props;
  const dispatch = useDispatch();
  const [addTaskQuery, { loading, error, data }] = useMutation(ADD_TASK, {
    onCompleted: (data) => {
      dispatch(updateStore(data.TM_addTask.body));
    },
    // refetchQueries: [{ query: GET_COLUMNS }],
  });

  const orderTask = column?.taskIds.findIndex(
    (taskId: any) => taskId === task.id
  );

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

  let selectOptions: any = task.marks || [];

  const { changeMarksTask } = toDoSlice.actions;

  const [state, setState]: any = useState({
    isLoading: false,
    options: defaultOptions,
    value: task.marks,
  });

  const handleChange = (newValue: any, actionMeta: any) => {
    console.group("Value Changed");
    console.log(newValue);
    selectOptions = [];
    newValue.forEach((e: any) => selectOptions.push(e));
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    setState({ ...state, value: selectOptions });

    addTaskQuery({
      variables: {
        tasks: {
          id: task.id,
          content: task.content,
          files: JSON.stringify(task.files),
          flag: task.flag,
          links: JSON.stringify(task.links),
          // marks: JSON.stringify(marks.value),
          marks: JSON.stringify(selectOptions),
          nodes: JSON.stringify(task.nodes),
          columnId: column.id,
          order: orderTask,
        },
      },
    });

    // dispatch(
    //   changeMarksTask({
    //     taskId: task.id,
    //     marks: selectOptions,
    //   })
    // );
  };

  const handleCreate = (inputValue: any) => {
    // We do not assume how users would like to add newly created options to the existing options list.
    // Instead we pass users through the new value in the onCreate prop
    setState({ isLoading: true });
    console.group("Option created");
    console.log("Wait a moment...");
    const { options } = state;

    const newOption = {
      label: inputValue,
      // value: label.toLowerCase().replace(/\W/g, ""),
      value: inputValue,
    };

    console.log(newOption);

    selectOptions = [...state.value];
    console.log("selectOptions", selectOptions);

    selectOptions.push(newOption);
    console.groupEnd();
    setState({
      isLoading: false,
      options: [...options, newOption],
      value: selectOptions,
    });

    addTaskQuery({
      variables: {
        tasks: {
          id: task.id,
          content: task.content,
          files: JSON.stringify(task.files),
          flag: task.flag,
          links: JSON.stringify(task.links),
          // marks: JSON.stringify(marks.value),
          marks: JSON.stringify(selectOptions),
          nodes: JSON.stringify(task.nodes),
          columnId: column.id,
          order: orderTask,
        },
      },
    });

    // dispatch(
    //   changeMarksTask({
    //     taskId: task.id,
    //     marks: selectOptions,
    //   })
    // );
  };

  const { isLoading, options, value } = state;

  return (
    <div className="createble">
      <CreatableSelect
        inputId="createable-select-example"
        isClearable
        isDisabled={isLoading}
        isLoading={isLoading}
        onChange={handleChange}
        onCreateOption={handleCreate}
        options={options}
        value={value}
        placeholder="Выбрать метку"
        isMulti
        closeMenuOnSelect={false}
        onBlur={() => changeMaskHandler(false)}
        maxMenuWidth="252px"
        defaultMenuIsOpen={true}
        autoFocus={true}
      />
    </div>
  );
};

export default MarksSelector;
