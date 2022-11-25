import React, { memo, useEffect, useState } from "react";
import { useRef } from "react";
import Select from "@atlaskit/select";
import "./infoTaskAccord.scss";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toDoSlice } from "../../store/reducers/ToDoSlice";
import { useCallback } from "react";
import { flagSlice } from "../../store/reducers/FlagSlice";
import FlagFilledIcon from "@atlaskit/icon/glyph/flag-filled";
import Tooltip from "@atlaskit/tooltip";
import moment from "moment";

import "moment/locale/ru";

import { CreatableSelect } from "@atlaskit/select";
import FormCustomSelectFieldExample from "./components/selectAvatar/selectAvatar";
import { useMutation } from "@apollo/client";
import { ADD_TASK } from "../../apollo/Mutation";
import { updateStore } from "../../utils/updateStore";

const createOption = (label: any) => ({
  label,
  // value: label.toLowerCase().replace(/\W/g, ""),
  value: label,
});

let selectOptions: any = [];

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

const MarksSelector = ({ task, column, changeMaskHandler }: any) => {
  const [addTaskQuery, { loading, error, data }] = useMutation(ADD_TASK, {
    onCompleted: (data) => {
      dispatch(updateStore(data.TM_addTask.body));
    },
    // refetchQueries: [{ query: GET_COLUMNS }],
  });

  const orderTask = column?.taskIds.findIndex(
    (taskId: any) => taskId === task.id
  );

  selectOptions = task.marks;
  const dispatch = useDispatch();
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
          files: task.files,
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
    const newOption = createOption(inputValue);

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
          files: task.files,
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

const InfoTaskAccord = memo(({ taskInfo: { task, column, isOpen } }: any) => {
  console.log("task", task);
  useEffect(() => {
    // moment.locale("ru");
    console.log(moment());
  }, []);

  const [addTaskQuery, { loading, error, data }] = useMutation(ADD_TASK, {
    onCompleted: (data) => {
      dispatch(updateStore(data.TM_addTask.body));
    },
    // refetchQueries: [{ query: GET_COLUMNS }],
  });

  const [changeMask, setChangeMask] = useState(false);
  const [descriptionTitle, setDescriptionTitle] = useState(false);
  const [toogleDateFormat, setToogleDateFormat] = useState(true);
  const { columns, tasks } = useSelector((state: any) => state.toDoReducer);
  const { fromColumnId } = useSelector((state: any) => state.flagReducer);
  const dispatch = useDispatch();
  const { transitionTask } = toDoSlice.actions;
  const { setFromColumnId } = flagSlice.actions;

  const taskFind: any = tasks[task.id];

  const changeMaskHandler = () => {
    setChangeMask(!changeMask);
  };

  const columnsName = Object.values(columns)
    .map((el: any) => {
      return { label: el.title, value: el.id };
    })
    .filter((el) => el.value !== fromColumnId);

  const defaultValue = {
    label: column.title,
    value: column.id,
  };

  const accordionHandler = (event: any) => {
    setDescriptionTitle(!descriptionTitle);
    const el = event.target;
    const accordion = el.closest(".accordion");
    accordion.classList.toggle("open");
    const panel = accordion.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  };

  // перемещение таксков в другую колонку
  const changeColumnHandler = (columnId: any) => {
    addTaskQuery({
      variables: {
        tasks: {
          id: task.id,
          content: task.content,
          files: task.files,
          flag: task.flag,
          links: JSON.stringify(task.links),
          marks: JSON.stringify(task.marks),
          nodes: JSON.stringify(task.nodes),
          columnId: columnId.value,
          order: 0,
        },
      },
    });

    // dispatch(
    //   transitionTask({
    //     fromColumnId,
    //     toColumnId: columnId.value,
    //     taskId: task.id,
    //   })
    // );

    if (!error) {
      dispatch(setFromColumnId(columnId.value));
    }
  };

  // const toogleDateFormatHandler = useCallback(() => {
  //   setToogleDateFormat(!toogleDateFormat);
  // }, []);

  const toogleDateFormatHandler = () => {
    setToogleDateFormat(!toogleDateFormat);
  };

  return (
    <>
      <div className="selectColumn">
        <Select
          inputId="single-select-example"
          className={`single-select ${
            columns[fromColumnId].stage === "to-do"
              ? "todo"
              : columns[fromColumnId].stage === "done"
              ? "done"
              : ""
          }`}
          classNamePrefix="react-select"
          options={columnsName}
          defaultValue={defaultValue}
          isSearchable={false}
          minMenuWidth={"400"}
          maxMenuWidth={"400"}
          onChange={changeColumnHandler}
          // defaultMenuIsOpen={true}
        />
        {task.flag && (
          <div className="noted">
            <span className="icon">
              <FlagFilledIcon label=""></FlagFilledIcon>
            </span>
            <span className="text">Отмеченно</span>
          </div>
        )}
      </div>
      <button
        onClick={accordionHandler}
        // ref={accordion}
        className="accordion open"
      >
        Сведения{" "}
        {descriptionTitle && (
          <span className="description">Исполнитель, Метки, Автор</span>
        )}
      </button>
      <div className="panel" style={{ display: "block" }}>
        <div className="fieldAccord">
          <div className="label">
            <h2>Исполнитель</h2>
          </div>

          <FormCustomSelectFieldExample></FormCustomSelectFieldExample>
        </div>

        <div className="fieldAccord">
          <div className="label">
            <h2>Метки</h2>
          </div>
          {changeMask ? (
            <MarksSelector
              changeMaskHandler={changeMaskHandler}
              task={taskFind}
              column={column}
            ></MarksSelector>
          ) : task.marks.length ? (
            <div onClick={changeMaskHandler} className="value">
              <div className="markList">
                {taskFind.marks.map((mark: any) => (
                  <a href="#" className="mark" key={mark.value}>
                    {mark.label}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="value">
              <div onClick={changeMaskHandler}>
                <span>Нет</span>
              </div>
            </div>
          )}
        </div>

        <div className="fieldAccord">
          <div className="label">
            <h2>Автор</h2>
          </div>
          {/* <div className="value">
            <span>SIROJIDDIN BARATOV</span>
          </div> */}
          <FormCustomSelectFieldExample></FormCustomSelectFieldExample>
        </div>
      </div>

      <div className="dateBlock">
        <div>Создано {moment(task.createdAt).locale("ru").format("LLL")}</div>
        <div>
          Дата обновления{" "}
          {
            // @ts-ignore
            // new Date() - new Date() - 18 * 60 * 60 * 1000 > 86400000 ? (
            new Date() - new Date(task.updatedAt) > 86400000 ? (
              <span>
                {
                  // @ts-ignore
                  moment(new Date(task.updatedAt))
                    // @ts-ignore
                    .locale("ru")
                    .format("DD MMM YYYY HH:mm")
                }
              </span>
            ) : (
              <>
                {toogleDateFormat ? (
                  <span
                    className="dateFormat"
                    onClick={toogleDateFormatHandler}
                  >
                    {
                      // @ts-ignore
                      moment(new Date(task.updatedAt))
                        // @ts-ignore
                        .locale("ru")
                        .format("DD MMM YYYY HH:mm")
                    }
                  </span>
                ) : (
                  <Tooltip
                    content={
                      // @ts-ignore
                      moment(new Date(task.updatedAt))
                        // @ts-ignore
                        .locale("ru")
                        .format("DD MMM YYYY HH:mm")
                    }
                    position="right"
                  >
                    {(tooltipProps) => (
                      <span
                        {...tooltipProps}
                        className="dateFormat"
                        onClick={toogleDateFormatHandler}
                      >
                        {moment(
                          // @ts-ignore
                          new Date(task.updatedAt)
                        )
                          .startOf("hour")
                          .fromNow()}
                      </span>
                    )}
                  </Tooltip>
                )}
              </>
            )
          }
        </div>
        {/* <div>Решено вчера</div> */}
      </div>
    </>
  );
});

export default InfoTaskAccord;
