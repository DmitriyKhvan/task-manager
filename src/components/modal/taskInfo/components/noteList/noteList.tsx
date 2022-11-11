import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toDoSlice } from "../../../../../store/reducers/ToDoSlice";

import Tooltip from "@atlaskit/tooltip";
import InlineEdit from "@atlaskit/inline-edit";
import Textfield from "@atlaskit/textfield";
import Button from "@atlaskit/button/standard-button";
import EditorEditIcon from "@atlaskit/icon/glyph/editor/edit";
import Select from "@atlaskit/select";
import TrashIcon from "@atlaskit/icon/glyph/trash";

const NoteList = (props: any) => {
  const [editFlag, setEditFlag] = useState(null);
  const dispatch = useDispatch();
  const { editTask } = toDoSlice.actions;
  const { tasks, columns } = useSelector((state: any) => state.toDoReducer);
  const columnsName = Object.values(columns).map((el: any) => {
    // return { label: el.title, value: el.id };
    return { label: el.title, value: el.stage };
  });

  console.log("props", props);
  console.log("columnsName", columnsName);

  const task = tasks[props.task.task.id];
  let sortNodes: any = [];

  if (props.sort.value === "date") {
    sortNodes = task.nodes.slice().sort((a: any, b: any) => {
      if (a[props.sort.value] > b[props.sort.value]) {
        return -1;
      }
      if (a[props.sort.value] < b[props.sort.value]) {
        return 1;
      }

      return 0;
    });
  } else if (props.sort.value === "status") {
    const toDoNode = task.nodes.filter((node: any) => node.stage === "to-do");
    const completeNode = task.nodes.filter(
      (node: any) => node.stage === "done"
    );
    const inProgressNode = task.nodes.filter(
      (node: any) => node.stage !== "to-do" && node.stage !== "done"
    );

    sortNodes = [...toDoNode, ...inProgressNode, ...completeNode];
  } else {
    sortNodes = task.nodes.slice();
  }

  const changeNodeText: any = (value: any, idx: any, stage: any) => {
    setEditFlag(null);
    const nodes = [
      ...sortNodes.slice(0, idx),
      { ...sortNodes[idx], content: value, stage },
      ...sortNodes.slice(idx + 1),
    ];

    dispatch(
      editTask({
        taskId: props.task.task.id,
        data: nodes,
        dataName: "nodes",
      })
    );
  };

  const removeNode: any = (id: any) => {
    const nodes = task.nodes.filter((node: any) => node.id !== id);
    dispatch(
      editTask({
        taskId: props.task.task.id,
        data: nodes,
        dataName: "nodes",
      })
    );
  };

  // не переносит заметки, просто меняет статус в таске
  const changeNodeStatus: any = (stage: any, idx: number) => {
    const nodes = [
      ...sortNodes.slice(0, idx),
      { ...sortNodes[idx], stage: stage.value },
      ...sortNodes.slice(idx + 1),
    ];

    dispatch(
      editTask({
        taskId: props.task.task.id,
        data: nodes,
        dataName: "nodes",
      })
    );
  };

  const openEditNode = (nodeId: any) => {
    setTimeout(() => {
      setEditFlag(nodeId);
    }, 1);

    // setEditFlag(nodeId);
  };

  return (
    <div className="listNode">
      {sortNodes.map((node: any, index: any) => {
        const options = columnsName.filter((e) => e.value !== node.stage);

        const defaultValue = columnsName.find((e) => e.value === node.stage);

        return (
          <Tooltip
            key={index}
            content={editFlag !== node.id ? node.content : ""}
          >
            {(tooltipProps) => (
              <div className="node">
                <div
                  {...tooltipProps}
                  className={`editNode ${
                    editFlag === node.id ? "activeEdit" : ""
                  }`}
                >
                  {editFlag !== node.id ? (
                    <span className="nodeContent">{node.content}</span>
                  ) : null}
                  <InlineEdit
                    defaultValue={node.content}
                    // label="Inline edit"
                    editView={({ errorMessage, ...fieldProps }) => (
                      <Textfield {...fieldProps} autoFocus></Textfield>
                    )}
                    readView={() => (
                      <div className="editFieldNode" data-testid="read-view">
                        {/* {node.content || "Что нужно сделать?"} */}

                        <Tooltip content="Изменить описание">
                          {(tooltipProps) => (
                            <Button
                              {...tooltipProps}
                              iconBefore={
                                <EditorEditIcon
                                  label=""
                                  primaryColor="#5E6C84 "
                                  size="medium"
                                />
                              }
                              appearance="subtle"
                            ></Button>
                          )}
                        </Tooltip>
                      </div>
                    )}
                    onConfirm={(value) => {
                      changeNodeText(value, index, node.stage);
                    }}
                    onEdit={() => openEditNode(node.id)}
                    onCancel={() => setEditFlag(null)}
                    // isEditing
                    // readViewFitContainerWidth
                  />
                </div>

                <div className="rightEditNode">
                  <Select
                    key={Date.now()}
                    inputId="single-select-example"
                    className={`single-select add ${
                      node.stage === "done"
                        ? "complete"
                        : node.stage === "to-do"
                        ? "todo"
                        : ""
                    }`}
                    classNamePrefix="react-select"
                    options={options}
                    defaultValue={defaultValue}
                    isSearchable={false}
                    // menuIsOpen={true}
                    onChange={(value) => changeNodeStatus(value, index)}
                  />
                  {/* <Tooltip content="Удалить">
                    {(tooltipProps) => ( */}
                  <Button
                    // {...tooltipProps}
                    className="removeNode"
                    iconBefore={
                      <TrashIcon label="" primaryColor="" size="medium" />
                    }
                    appearance="subtle"
                    onClick={() => removeNode(node.id)}
                  ></Button>
                  {/* )}
                  </Tooltip> */}
                </div>
              </div>
            )}
          </Tooltip>
        );
      })}
    </div>
  );
};

export default NoteList;
