import React, { memo, useState } from "react";
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
// @ts-ignore
import localization from "moment/locale/ru";

import { CreatableSelect } from "@atlaskit/select";
import FormCustomSelectFieldExample from "./components/selectAvatar/selectAvatar";

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

const MarksSelector = (props: any) => {
  selectOptions = props.task.marks;
  const dispatch = useDispatch();
  const { changeMarksTask } = toDoSlice.actions;

  const [state, setState]: any = useState({
    isLoading: false,
    options: defaultOptions,
    value: props.task.marks,
  });

  const handleChange = (newValue: any, actionMeta: any) => {
    console.group("Value Changed");
    console.log(newValue);
    selectOptions = [];
    newValue.forEach((e: any) => selectOptions.push(e));
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    setState({ ...state, value: selectOptions });

    dispatch(
      changeMarksTask({
        taskId: props.task.id,
        marks: selectOptions,
      })
    );
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

    dispatch(
      changeMarksTask({
        taskId: props.task.id,
        marks: selectOptions,
      })
    );
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
        onBlur={() => props.changeMaskHandler(false)}
        maxMenuWidth="252px"
        defaultMenuIsOpen={true}
        autoFocus={true}
      />
    </div>
  );
};

const InfoTaskAccord = memo((props: any) => {
  console.log(props);
  const [changeMask, setChangeMask] = useState(false);
  const [descriptionTitle, setDescriptionTitle] = useState(false);
  const [toogleDateFormat, setToogleDateFormat] = useState(true);
  const { columns, tasks } = useSelector((state: any) => state.toDoReducer);
  const { fromColumnId } = useSelector((state: any) => state.flagReducer);
  const dispatch = useDispatch();
  const { transitionTask } = toDoSlice.actions;
  const { setFromColumnId } = flagSlice.actions;

  const task: any = tasks[props.taskInfo.task.id];

  const changeMaskHandler = () => {
    setChangeMask(!changeMask);
  };

  console.log("columns", columns);

  const columnsName = Object.values(columns)
    .map((el: any) => {
      return { label: el.title, value: el.id };
    })
    .filter((el) => el.value !== fromColumnId);

  const defaultValue = {
    label: props.taskInfo.column.title,
    value: props.taskInfo.column.id,
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
    dispatch(
      transitionTask({
        fromColumnId,
        toColumnId: columnId.value,
        taskId: props.taskInfo.task.id,
      })
    );

    dispatch(setFromColumnId(columnId.value));
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
        {props.taskInfo.task.flag && (
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
              task={task}
            ></MarksSelector>
          ) : task.marks.length ? (
            <div onClick={changeMaskHandler} className="value">
              <div className="markList">
                {JSON.parse(task.marks).map((mark: any) => (
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
        <div>Создано 2 июня 2022 г., 16:41</div>
        <div>
          Дата обновления{" "}
          {
            // @ts-ignore
            new Date() - new Date() - 18 * 60 * 60 * 1000 > 86400000 ? (
              <span>
                {
                  // @ts-ignore
                  moment(new Date() - 18 * 60 * 60 * 1000)
                    // @ts-ignore
                    .locale("ru", localization)
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
                      moment(new Date() - 18 * 60 * 60 * 1000)
                        // @ts-ignore
                        .locale("ru", localization)
                        .format("DD MMM YYYY HH:mm")
                    }
                  </span>
                ) : (
                  <Tooltip
                    content={
                      // @ts-ignore
                      moment(new Date() - 18 * 60 * 60 * 1000)
                        // @ts-ignore
                        .locale("ru", localization)
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
                          new Date() - 18 * 60 * 60 * 1000
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
