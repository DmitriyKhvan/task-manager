import React, { memo, useCallback, useRef, useState } from "react";

import Breadcrumbs, { BreadcrumbsItem } from "@atlaskit/breadcrumbs";
// import Button from "@atlaskit/button/standard-button";
import CrossIcon from "@atlaskit/icon/glyph/cross";
import LikeIcon from "@atlaskit/icon/glyph/like";
import MoreIcon from "@atlaskit/icon/glyph/more";
import ShareIcon from "@atlaskit/icon/glyph/share";
import WatchIcon from "@atlaskit/icon/glyph/watch";
import UnlockFilledIcon from "@atlaskit/icon/glyph/unlock-filled";
import EditFilledIcon from "@atlaskit/icon/glyph/edit-filled";
import CheckboxIcon from "@atlaskit/icon/glyph/checkbox";

import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from "@atlaskit/dropdown-menu";

import { ButtonItem, MenuGroup, Section } from "@atlaskit/menu";

import { N500, T500 } from "@atlaskit/theme/colors";
import { token } from "@atlaskit/tokens";

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from "@atlaskit/modal-dialog";
import { useSelector, useDispatch } from "react-redux";
import { flagSlice } from "../../../store/reducers/FlagSlice";

import "./taskInfo.scss";

import TextArea from "@atlaskit/textarea";
import InlineEdit from "@atlaskit/inline-edit";
import { toDoSlice } from "../../../store/reducers/ToDoSlice";

import ChildIssuesIcon from "@atlaskit/icon/glyph/child-issues";

import Textfield from "@atlaskit/textfield";
import Select from "@atlaskit/select";
import ProgressBar from "@atlaskit/progress-bar";

import ButtonGroup from "@atlaskit/button/button-group";
import LoadingButton from "@atlaskit/button/loading-button";
import Button from "@atlaskit/button/standard-button";
import TextField from "@atlaskit/textfield";
import Tooltip from "@atlaskit/tooltip";

import EditorAddIcon from "@atlaskit/icon/glyph/editor/add";

import TrashIcon from "@atlaskit/icon/glyph/trash";
import EditorEditIcon from "@atlaskit/icon/glyph/editor/edit";
import LinkIcon from "@atlaskit/icon/glyph/link";
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down";
import WorldIcon from "@atlaskit/icon/glyph/world";
import AttachmentIcon from "@atlaskit/icon/glyph/attachment";

import AddNote from "./components/addNote/addNode";
import AddLink from "./components/addLink/addLink";
import TaskLinks from "./components/taskLinks/taskLinks";

import UploadFile from "./components/uploadFile/uploadFile";
import FileList from "./components/fileList/fileList";
import NoteList from "./components/noteList/noteList";
import { useMutation } from "@apollo/client";
import { ADD_TASK } from "../../../apollo/Mutation";
import { updateStore } from "../../../utils/updateStore";
import EditTask from "./components/editTask/editTask";
import InfoTaskAccord from "./components/infoTaskAccord/infoTaskAccord";
import ModalRemoveTaskItem from "../removeTaskItem/relmoveTaskItem";
import EditorConvertToMarkdown from "../../comments/comments";

export default memo(function TaskInfo() {
  const [drag, setDrag] = useState(false);
  const [visibleField, setVisibleField] = useState(false);
  const [visibleAddLink, setVisibleAddLink] = useState(false);

  const [visibleWorld, setVisibleWorld] = useState(true);

  const [sort, setSort] = useState({ value: "", label: "" });

  const { taskInfo } = useSelector((state: any) => state.flagReducer);

  console.log("taskInfo", taskInfo);

  const { tasks, columns } = useSelector((state: any) => state.toDoReducer);

  const { setFiles } = toDoSlice.actions;

  const columnsName = Object.values(columns).map((el: any) => {
    return { label: el.title, value: el.id };
  });

  const dispatch = useDispatch();
  const { modalTaskInfo } = flagSlice.actions;

  const nodes = tasks[taskInfo?.task?.id]?.nodes?.length;
  const links = tasks[taskInfo?.task?.id]?.links?.length;

  const toDoNodes = tasks[taskInfo?.task?.id]?.nodes.filter(
    (node: any) => node.stage === "to-do"
  )?.length;

  const compliteNodes = tasks[taskInfo?.task?.id]?.nodes.filter(
    (node: any) => node.stage === "done"
  )?.length;

  const inProgress = nodes - toDoNodes - compliteNodes;

  const oneNodePercent = 100 / nodes;

  const percentCompleteTask = compliteNodes / nodes;

  const closeModal = () =>
    dispatch(
      modalTaskInfo({
        isOpen: false,
        task: null,
        column: null,
      })
    );

  if (taskInfo.isOpen) {
    setTimeout(() => {
      const ele: any = document.getElementById("resizeMe");

      let x = 0;
      let w = 0;

      const mouseDownHandler = function (e: any) {
        x = e.clientX;

        const styles = window.getComputedStyle(ele);
        w = parseInt(styles.width, 10);

        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);
      };

      const mouseMoveHandler = function (e: any) {
        const dx = e.clientX - x;

        ele.style.width = `${w + dx}px`;

        if (w + dx < 640) {
          setVisibleWorld(false);
        } else {
          setVisibleWorld(true);
        }
      };

      const mouseUpHandler = function () {
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
      };

      const resizer = ele.querySelector(".resizer");
      resizer.addEventListener("mousedown", mouseDownHandler);
    }, 100);
  }

  const addNoteFieldHandler = () => {
    setVisibleField(true);
  };

  const addTaskLinkHandler = () => {
    setVisibleAddLink(true);
  };

  const sortNodes = (sort: any) => {
    setSort(sort);
  };

  const dragStartHandler = (e: any) => {
    e.preventDefault();
    // if (e.dataTransfer.files.length)
    setDrag(true);
  };

  const dragLeaveHandler = (e: any) => {
    e.preventDefault();
    setDrag(false);
  };

  const onDropHandler = (e: any) => {
    e.preventDefault();
    let files: any = [...e.dataTransfer.files];

    files.createDate = new Date();
    dispatch(
      setFiles({
        files,
      })
    );

    setDrag(false);
  };

  return (
    <div>
      {/* <Button appearance="primary" onClick={openModal}>
        Open modal
      </Button> */}

      <ModalTransition>
        {taskInfo.isOpen && (
          <Modal
            // width="calc(100vw - 120px)"
            width="1280px"
            height="calc(100vh - 119px)"
            onClose={closeModal}
          >
            <div className="modal">
              <ModalHeader>
                {/* <ModalTitle>Custom modal header</ModalTitle> */}
                <div className="breadcrumbWrap">
                  <Button
                    className="breadcrumbEpic"
                    iconBefore={<EditFilledIcon label="" size="small" />}
                    appearance="subtle"
                  >
                    Добавить Эпик
                  </Button>
                  <span className="separate">/</span>
                  <DropdownMenu
                    trigger={({ triggerRef, ...props }) => (
                      <Button
                        className="breadcrumbCheck"
                        {...props}
                        iconBefore={
                          <CheckboxIcon
                            // width="28px"
                            // height="28px"
                            // primaryColor={token("color.text.subtle", T500)}
                            primaryColor="#4BADE8"
                            label="Checkbox"
                          />
                        }
                        ref={triggerRef}
                      />
                    )}
                  >
                    <div className="taskMenu add">
                      <DropdownItemGroup>
                        <MenuGroup>
                          <Section title="ИЗМЕНИТЬ ТИП ЗАДАЧИ">
                            <ButtonItem
                              iconBefore={
                                <CheckboxIcon
                                  // width="28px"
                                  // height="28px"
                                  primaryColor="#4BADE8"
                                  label="Checkbox"
                                />
                              }
                            >
                              Задача
                            </ButtonItem>
                          </Section>
                        </MenuGroup>
                      </DropdownItemGroup>
                    </div>
                  </DropdownMenu>
                  <Button className="breadcrumbMark" appearance="subtle-link">
                    {taskInfo.task.id}
                  </Button>

                  <Button
                    style={{
                      opacity: 0,
                      width: 0,
                      height: 0,
                    }}
                    autoFocus
                  ></Button>
                </div>
                <div className="btnsWrap">
                  <Button appearance="subtle">
                    <UnlockFilledIcon
                      label="UnlockFilled"
                      primaryColor={token("color.text.subtle", N500)}
                    />
                  </Button>
                  <div className="watchWrap">
                    <Button appearance="subtle">
                      <WatchIcon
                        label="Watch"
                        primaryColor={token("color.text.subtle", N500)}
                      />
                      <span className="countWatch">1</span>
                    </Button>
                  </div>

                  <Button appearance="subtle">
                    <LikeIcon
                      label="Like"
                      primaryColor={token("color.text.subtle", N500)}
                    />
                  </Button>

                  <Button appearance="subtle">
                    <ShareIcon
                      label="Share"
                      primaryColor={token("color.text.subtle", N500)}
                    />
                  </Button>
                  <Button appearance="subtle">
                    <MoreIcon
                      label="More"
                      primaryColor={token("color.text.subtle", N500)}
                    />
                  </Button>
                  <Button appearance="subtle" onClick={closeModal}>
                    <CrossIcon
                      label="Close Modal"
                      primaryColor={token("color.text.subtle", N500)}
                    />
                  </Button>
                </div>
              </ModalHeader>
              <div
                onDragStart={(e) => dragStartHandler(e)}
                onDragLeave={(e) => dragLeaveHandler(e)}
                onDragOver={(e) => dragStartHandler(e)}
                className="dropAreaWrap"
              >
                {drag && (
                  <div
                    onDragStart={(e) => dragStartHandler(e)}
                    onDragLeave={(e) => dragLeaveHandler(e)}
                    onDragOver={(e) => dragStartHandler(e)}
                    onDrop={(e) => onDropHandler(e)}
                    className="dropArea"
                  ></div>
                )}

                <div className="modalBody">
                  <div className="modalContent">
                    <div id="resizeMe" className="resizable leftPart">
                      {/* <ModalTitle>{taskInfo.task.content}</ModalTitle> */}
                      <div className="leftPartContent">
                        <div className="leftPartContentWrap">
                          <EditTask
                            task={taskInfo.task}
                            column={taskInfo.column}
                          ></EditTask>
                          <div className="buttonGroup">
                            <ButtonGroup>
                              <UploadFile
                                task={taskInfo.task}
                                column={taskInfo.column}
                                visibleWorld={visibleWorld}
                                tooltipContent="Добавить вложение"
                              ></UploadFile>

                              <Tooltip content="Добавить заметку">
                                {(tooltipProps: any) => (
                                  <Button
                                    {...tooltipProps}
                                    iconBefore={
                                      <ChildIssuesIcon label="" size="medium" />
                                    }
                                    appearance=""
                                    onClick={addNoteFieldHandler}
                                  >
                                    {visibleWorld && <>Добавить заметку</>}
                                  </Button>
                                )}
                              </Tooltip>

                              <div>
                                <Tooltip content="Добавить заметку">
                                  {(tooltipProps: any) => (
                                    <Button
                                      {...tooltipProps}
                                      onClick={addTaskLinkHandler}
                                      className="addLink"
                                      iconBefore={
                                        <LinkIcon label="" size="medium" />
                                      }
                                      appearance=""
                                    >
                                      {visibleWorld && (
                                        <>Добавить ссылку на веб-страницу</>
                                      )}
                                    </Button>
                                  )}
                                </Tooltip>

                                {/* <Tooltip content="Добавить ссылку на веб-страницу и т. д.">
                                  {(tooltipProps) => (
                                    <DropdownMenu
                                      placement="bottom-end"
                                      trigger={({ triggerRef, ...props }) => (
                                        <span {...tooltipProps}>
                                          <Button
                                            className="addLinkMenu"
                                            {...props}
                                            iconBefore={
                                              <ChevronDownIcon label="more" />
                                            }
                                            ref={triggerRef}
                                          />
                                        </span>
                                      )}
                                    >
                                      <DropdownItemGroup>
                                        <DropdownItem
                                          iconBefore={
                                            <WorldIcon label="world" />
                                          }
                                          // onClick={addTaskLinkHandler}
                                        >
                                          Добавить ссылку на веб-страницу
                                        </DropdownItem>
                                      </DropdownItemGroup>
                                    </DropdownMenu>
                                  )}
                                </Tooltip> */}
                              </div>
                            </ButtonGroup>
                          </div>

                          <FileList
                            task={taskInfo.task}
                            column={taskInfo.column}
                          ></FileList>

                          {nodes ? (
                            <>
                              <div className="progressBarBlock">
                                <div className="progressBarTitleBlock">
                                  <h4 className="progressBarTitle">Заметки</h4>
                                  <div className="sortNodes">
                                    <div className="selectNode">
                                      <DropdownMenu
                                        trigger={`Сортировка: ${sort?.label}`}
                                      >
                                        <DropdownItemGroup>
                                          {(sort.value === "status" ||
                                            !sort.value) && (
                                            <DropdownItem
                                              onClick={() =>
                                                sortNodes({
                                                  value: "date",
                                                  label: "дата создания",
                                                })
                                              }
                                            >
                                              Дата создания
                                            </DropdownItem>
                                          )}
                                          {(sort.value === "date" ||
                                            !sort.value) && (
                                            <DropdownItem
                                              onClick={() =>
                                                sortNodes({
                                                  value: "status",
                                                  label: "статус",
                                                })
                                              }
                                            >
                                              Статус
                                            </DropdownItem>
                                          )}
                                          {sort.value && (
                                            <Section hasSeparator>
                                              <DropdownItem
                                                onClick={() =>
                                                  sortNodes({
                                                    value: "",
                                                    label: "",
                                                  })
                                                }
                                              >
                                                Рейтинг (по умолчанию)
                                              </DropdownItem>
                                            </Section>
                                          )}
                                        </DropdownItemGroup>
                                      </DropdownMenu>
                                    </div>

                                    <div>
                                      <Button
                                        className="addNoteBtn"
                                        onClick={addNoteFieldHandler}
                                        iconBefore={
                                          <EditorAddIcon
                                            label=""
                                            size="medium"
                                          />
                                        }
                                        appearance="subtle"
                                      ></Button>
                                    </div>
                                  </div>
                                </div>
                                <div className="percent">
                                  <div className="progressBarWrap">
                                    <Tooltip
                                      content={`Готовых задач: ${compliteNodes} из ${nodes}`}
                                    >
                                      {(tooltipProps) => (
                                        <div
                                          {...tooltipProps}
                                          style={{
                                            width: `${Math.round(
                                              compliteNodes * oneNodePercent
                                            )}%`,
                                          }}
                                          className={`progressBar complete ${
                                            inProgress * oneNodePercent === 0 ||
                                            compliteNodes * oneNodePercent ===
                                              100
                                              ? "add"
                                              : ""
                                          }`}
                                        ></div>
                                      )}
                                    </Tooltip>

                                    <Tooltip
                                      content={`Задач в работе: ${inProgress} из ${nodes}`}
                                    >
                                      {(tooltipProps) => (
                                        <div
                                          {...tooltipProps}
                                          style={{
                                            width: `${Math.round(
                                              inProgress * oneNodePercent
                                            )}%`,
                                          }}
                                          className={`progressBar inProgress ${
                                            compliteNodes * oneNodePercent ===
                                              0 ||
                                            inProgress * oneNodePercent === 100
                                              ? "add"
                                              : ""
                                          }`}
                                        ></div>
                                      )}
                                    </Tooltip>

                                    <Tooltip
                                      content={`Задач к выполнению: ${toDoNodes} из ${nodes}`}
                                    >
                                      {(tooltipProps) => (
                                        <div
                                          {...tooltipProps}
                                          style={{
                                            width: `${Math.round(
                                              toDoNodes * oneNodePercent
                                            )}%`,
                                          }}
                                          className={`progressBar todo ${
                                            toDoNodes * oneNodePercent === 100
                                              ? "add"
                                              : ""
                                          }`}
                                        ></div>
                                      )}
                                    </Tooltip>
                                  </div>

                                  <div className="percentComplete">
                                    <span>Готово</span>
                                    <span>
                                      {Math.round(percentCompleteTask * 100)} %
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <NoteList task={taskInfo} sort={sort}></NoteList>
                            </>
                          ) : null}

                          {visibleField && (
                            <AddNote
                              task={taskInfo}
                              setVisibleField={setVisibleField}
                            ></AddNote>
                          )}

                          {links ? (
                            <TaskLinks
                              setVisibleAddLink={setVisibleAddLink}
                              task={taskInfo}
                            ></TaskLinks>
                          ) : null}

                          {visibleAddLink && (
                            <AddLink
                              task={taskInfo}
                              setVisibleAddLink={setVisibleAddLink}
                            ></AddLink>
                          )}

                          {/* <EditorWithFeedback></EditorWithFeedback> */}
                          {/* <EditorConvertToMarkdown></EditorConvertToMarkdown> */}
                        </div>
                      </div>
                      <div className="resizer resizerR "></div>
                    </div>

                    <div className="rightPart">
                      {/* {taskInfo.task.marks.some((e) => e.value === "mark1") && (
                        <div>
                          <p>Правый контент c меткой 1</p>
                          <Button appearance="primary">Метка 1</Button>
                        </div>
                      )}

                      {taskInfo.task.marks.some((e) => e.value === "mark2") && (
                        <div>
                          <p>Другой контент c меткой 2</p>
                          <Button appearance="warning">Метка 2</Button>
                        </div>
                      )}

                      {taskInfo.task.marks.some((e) => e.value === "mark3") && (
                        <div>
                          <p>Соврешенно другой контент c меткой 3</p>
                          <Button appearance="danger">Метка 3</Button>
                        </div>
                      )} */}

                      <InfoTaskAccord taskInfo={taskInfo}></InfoTaskAccord>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </ModalTransition>

      <ModalRemoveTaskItem></ModalRemoveTaskItem>
    </div>
  );
});
