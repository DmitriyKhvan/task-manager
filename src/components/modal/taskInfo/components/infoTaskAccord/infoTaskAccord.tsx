import React, { memo, useEffect, useState, useRef } from "react";
import Select from "@atlaskit/select";
import "./infoTaskAccord.scss";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import FlagFilledIcon from "@atlaskit/icon/glyph/flag-filled";

import { CreatableSelect } from "@atlaskit/select";
import SelectAvatar from "./components/selectAvatar/selectAvatar";
import { useMutation } from "@apollo/client";
import { toDoSlice } from "../../../../../store/reducers/ToDoSlice";
import { ADD_TASK } from "../../../../../apollo/Mutation";
import { updateStore } from "../../../../../utils/updateStore";
import { flagSlice } from "../../../../../store/reducers/FlagSlice";
import MarksSelector from "./components/marksSelector/marksSelector";
import DateInfo from "./components/dateInfo/dateInfo";

const InfoTaskAccord = memo(({ taskInfo: { task, column, isOpen } }: any) => {
  const [addTaskQuery, { loading, error, data }] = useMutation(ADD_TASK, {
    onCompleted: (data) => {
      dispatch(updateStore(data.TM_addTask.body));
    },
    // refetchQueries: [{ query: GET_COLUMNS }],
  });

  const accordion: any = useRef(null);
  const panel: any = useRef(null);

  const [changeMask, setChangeMask] = useState(false);
  const [descriptionTitle, setDescriptionTitle] = useState(false);

  const { columns, tasks } = useSelector((state: any) => state.toDoReducer);
  const { fromColumnId } = useSelector((state: any) => state.flagReducer);
  const dispatch = useDispatch();
  const { transitionTask } = toDoSlice.actions;
  const { setFromColumnId } = flagSlice.actions;

  const taskFind: any = tasks[task.id];

  const changeMaskHandler = () => {
    setChangeMask(!changeMask);
  };

  console.log(
    "Object.values(columns)",
    Object.values(columns).find((col: any) => col.taskIds.includes(taskFind.id))
  );

  const columnFind: any = Object.values(columns).find((col: any) =>
    col.taskIds.includes(taskFind.id)
  );

  const columnsName = Object.values(columns)
    .map((el: any) => {
      return { label: el.title, value: el.id };
    })
    .filter((el) => el.value !== fromColumnId);

  const defaultValue = {
    label: columnFind.title,
    value: columnFind.id,
  };

  // const accordionHandler = (event: any) => {
  //   setDescriptionTitle(!descriptionTitle);
  //   const el = event.target;
  //   const accordion = el.closest(".accordion");
  //   accordion.classList.toggle("open");
  //   const panel = accordion.nextElementSibling;
  //   panel.classList.toggle("close");
  // };

  const accordionHandler = () => {
    setDescriptionTitle(!descriptionTitle);
    accordion.current.classList.toggle("open");
    panel.current.classList.toggle("close");
  };

  // перемещение тасков в другую колонку
  const changeColumnHandler = (columnId: any) => {
    addTaskQuery({
      variables: {
        tasks: {
          id: taskFind.id,
          content: taskFind.content,
          files: JSON.stringify(taskFind.files),
          flag: taskFind.flag,
          links: JSON.stringify(taskFind.links),
          marks: JSON.stringify(taskFind.marks),
          nodes: JSON.stringify(taskFind.nodes),
          columnId: columnId.value,
          // columnId: columnFind.id,
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
        ref={accordion}
        className="accordion open"
      >
        Сведения{" "}
        {descriptionTitle && (
          <span className="description">Исполнитель, Метки, Автор</span>
        )}
      </button>
      <div ref={panel} className="panel">
        <div className="fieldAccord">
          <div className="label">
            <h2>Исполнитель</h2>
          </div>

          <SelectAvatar />
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
          ) : taskFind.marks.length ? (
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
          <SelectAvatar />
        </div>
      </div>

      <DateInfo task={task}></DateInfo>
    </>
  );
});

export default InfoTaskAccord;
