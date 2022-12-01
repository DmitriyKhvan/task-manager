import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
// @ts-ignore
import localization from "moment/locale/ru";
import ImageIcon from "@atlaskit/icon/glyph/image";
import humanFileSize from "../../../../../pipes/fileSizeFormat";
import Button from "@atlaskit/button";
import TrashIcon from "@atlaskit/icon/glyph/trash";
import WatchIcon from "@atlaskit/icon/glyph/watch";
import DownloadIcon from "@atlaskit/icon/glyph/download";
import MoreIcon from "@atlaskit/icon/glyph/more";
import EditorAddIcon from "@atlaskit/icon/glyph/editor/add";
import Badge from "@atlaskit/badge";
import Pagination from "@atlaskit/pagination";
import { useRef } from "react";

import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from "@atlaskit/dropdown-menu";

import styles from "./fileList.module.scss";
import { useDispatch } from "react-redux";
import { flagSlice } from "../../../../../store/reducers/FlagSlice";
import { useCallback } from "react";
import { toDoSlice } from "../../../../../store/reducers/ToDoSlice";
import { fetchUploadFiles } from "../../../../../store/reducers/ActionCreators";

import axios from "axios";
import UploadFile from "../uploadFile/uploadFile";
import { useMutation } from "@apollo/client";
import { ADD_TASK } from "../../../../../apollo/Mutation";
import { updateStore } from "../../../../../utils/updateStore";
import uploadFile from "../uploadFile/uploadFile";

export default memo(function FileList(props: any) {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const { modalTaskEdit } = flagSlice.actions;

  const { task, column } = props;

  const { files, tasks, progresCurrentFile } = useSelector(
    (state: any) => state.toDoReducer
  );

  const taskFind = tasks[task.id];
  const filesUpload = taskFind.files.slice(6 * (page - 1), 6 * page);

  console.log("filesUpload", filesUpload);

  const modalFileHandler = (id: any) => {
    const files = taskFind.files.filter((file: any) => file.id !== id);

    const orderTask = column?.taskIds.findIndex(
      (taskId: any) => taskId === taskFind.id
    );

    const taskEdit = {
      id: taskFind.id,
      columnId: column.id,
      content: taskFind.content,
      flag: taskFind.flag,
      links: JSON.stringify(taskFind.links),
      marks: JSON.stringify(taskFind.marks),
      files: JSON.stringify(files),
      nodes: JSON.stringify(taskFind.nodes),
      order: orderTask,
    };

    dispatch(
      modalTaskEdit({
        isOpen: true,
        task: taskEdit,
        title: "Удалить вложение?",
        content: <p>Он будет удален без возможности восстановления.</p>,
      })
    );
  };

  const downloadFile = (id: any, name: any) => {
    const url = `http://10.1.1.177:9002/file/downloadById?id=${id}&name=${name}`;
    const downloadLink = document.createElement("a");
    // downloadLink.setAttribute("download", name);
    downloadLink.setAttribute("download", "");
    downloadLink.href = url;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  };

  // const downloadFile = async (id, name) => {
  //   axios({
  //     url: `http://10.1.1.177:9002/file/downloadById?id=${id}`,
  //     method: "GET",
  //     // headers: {
  //     //   "Content-Type": "application/octet-stream",
  //     // },
  //     responseType: "blob",
  //   }).then((response) => {
  //     console.log(new Blob([response.data]));
  //     let url = URL.createObjectURL(new Blob([response.data]));
  //     console.log(url);
  //     let link = document.createElement("a");
  //     link.href = url;
  //     // link.setAttribute("download", name);
  //     link.download = name;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);

  //     URL.revokeObjectURL(url);
  //   });
  // };

  const iconType: any = {
    "application/pdf": "pdf-document",
    "image/svg+xml": "image",
    "image/png": "image",
    "image/jpeg": "image",
    "image/jpg": "image",
    "application/x-msdownload": "generic",
    "application/x-zip-compressed": "archive",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      "excel-spreadsheet",
    "application/msword": "word-document",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "word-document",
    "image/gif": "image",
    "audio/mpeg": "audio",
    "video/mp4": "video",
  };

  const pagination = (e: any, page: any) => {
    console.log(e);
    console.log(page);
    setPage(page);
  };

  return taskFind.files.length || files.length ? (
    <>
      <div className={styles.fileListTitleBlock}>
        <h4 className={styles.fileListTitle}>
          Вложения ({files.length || taskFind.files.length})
        </h4>
        <div className={styles.funcBlock}>
          <DropdownMenu
            placement="bottom-end"
            trigger={({ triggerRef, ...props }) => (
              <Button
                className={styles.addFileMenu}
                {...props}
                iconBefore={<MoreIcon size="small" label="more" />}
                ref={triggerRef}
              />
            )}
          >
            <DropdownItemGroup>
              <DropdownItem>Выбрать представление "Лента"</DropdownItem>
              <DropdownItem elemAfter={<Badge>{files.length}</Badge>}>
                Скачать все
              </DropdownItem>
              <DropdownItem>Удалить все</DropdownItem>
            </DropdownItemGroup>
          </DropdownMenu>

          <div className={styles.addFiles}>
            <UploadFile
              task={taskFind}
              column={column}
              icon={<EditorAddIcon label="" size="medium" />}
              appearance="subtle"
              visibleWorld={false}
              tooltipContent=""
              // width="24px"
              // height="24px"
            ></UploadFile>
          </div>
        </div>
      </div>
      <div className={styles.fileList}>
        <table>
          <thead>
            <tr>
              <th>
                <span>
                  <span>Имя</span>
                </span>
              </th>
              <th>
                <span>Размер</span>
              </th>
              <th>
                <span>Дата добавления</span>
              </th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* загруженные файлы на сервер */}
            {filesUpload.length &&
              filesUpload.map((file: any) => {
                return (
                  <tr key={file.id}>
                    <td>
                      <div className={styles.fileNameBlock}>
                        <div className={styles.fileNameIcon}>
                          {/* <ImageIcon /> */}
                          {/* {file.type} */}
                          <i
                            className={`icon-${
                              iconType[file.contentType]
                                ? iconType[file.contentType]
                                : "generic"
                            }`}
                          >
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                        </div>
                        <div className={styles.fileNameWrap}>
                          <span className={styles.fileNamePart1}>
                            {file.fileName.slice(0, -4)}
                          </span>
                          <span className={styles.fileNamePart2}>
                            {file.fileName.slice(-4)}
                          </span>
                          {/* <span>{file.progress}</span> */}
                        </div>
                      </div>
                    </td>
                    <td>{humanFileSize(file.fileSize, true, 1)}</td>

                    <td>
                      {moment(file.createdAt)
                        // @ts-ignore
                        .locale("ru", localization)
                        .format("DD MMM YYYY HH:mm")}
                    </td>
                    <td>
                      {/* 2 */}
                      <Button
                        onClick={() => modalFileHandler(file.id)}
                        style={{ fontSize: "14px" }}
                        iconBefore={<TrashIcon label="" size="medium" />}
                        appearance="subtle"
                      ></Button>
                    </td>
                    <td>
                      {/* {file.url} */}
                      {/* <a
                      href={`http://10.1.1.177:9002/file/downloadById?id=${file.id}&name=${file.name}`}
                      // href={file.url}
                      // download={file.name}
                      download="Перевод Justice"
                    >
                      Скачать
                    </a> */}
                      <Button
                        onClick={() => downloadFile(file.id, file.fileName)}
                        style={{ fontSize: "14px" }}
                        iconBefore={<DownloadIcon label="" size="medium" />}
                        appearance="subtle"
                      ></Button>
                    </td>
                  </tr>
                );
              })}

            {/* файлы в процессе загрузки */}
            {progresCurrentFile && (
              <tr key={progresCurrentFile.lastModified}>
                <td>
                  <div className={styles.fileNameBlock}>
                    <div className={styles.fileNameIcon}>
                      {/* <ImageIcon /> */}
                      {/* {file.type} */}
                      <i
                        className={`icon-${
                          iconType[progresCurrentFile.type]
                            ? iconType[progresCurrentFile.type]
                            : "generic"
                        }`}
                      >
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                    </div>
                    <div className={styles.fileNameWrap}>
                      <span className={styles.fileNamePart1}>
                        {progresCurrentFile.name.slice(0, -4)}
                      </span>
                      <span className={styles.fileNamePart2}>
                        {progresCurrentFile.name.slice(-4)}
                      </span>
                      {/* <span>{file.progress}</span> */}
                    </div>
                  </div>
                </td>
                <td>{humanFileSize(progresCurrentFile.size, true, 1)}</td>
                <td>
                  {moment(progresCurrentFile.lastModified)
                    // @ts-ignore
                    .locale("ru", localization)
                    .format("DD MMM YYYY HH:mm")}
                </td>
                <td>
                  {progresCurrentFile.progress < 100 ? (
                    <Button
                      isDisabled={true}
                      style={{ fontSize: "14px" }}
                      iconBefore={<WatchIcon label="" size="medium" />}
                      appearance="subtle"
                    ></Button>
                  ) : (
                    <>
                      1
                      <Button
                        style={{ fontSize: "14px" }}
                        iconBefore={<TrashIcon label="" size="medium" />}
                        appearance="subtle"
                      ></Button>
                    </>
                  )}
                </td>
                <td>
                  {/* <Button
                    // onClick={() => downloadFile(file.id, file.fileName)}
                    style={{ fontSize: "14px" }}
                    iconBefore={<DownloadIcon label="" size="medium" />}
                    appearance="subtle"
                  ></Button> */}
                  {/* {file.url} */}
                  {/* <a
                        href={`http://10.1.1.177:9002/file/downloadById?id=${file.id}&name=${file.name}`}
                        // href={file.url}
                        // download={file.name}
                        download="Перевод Justice"
                      >
                        Скачать
                      </a> */}
                  {/* <Button
                    // onClick={() => downloadFile(file.id, file.name)}
                    style={{ fontSize: "14px" }}
                    iconBefore={<DownloadIcon label="" size="medium" />}
                    appearance="subtle"
                  ></Button> */}
                </td>
              </tr>
            )}

            {/* файлы выбранные для загрузки */}
            {files &&
              files.map((file: any) => {
                return (
                  <tr key={file.lastModified}>
                    <td>
                      <div className={styles.fileNameBlock}>
                        <div className={styles.fileNameIcon}>
                          {/* <ImageIcon /> */}
                          {/* {file.type} */}
                          <i
                            className={`icon-${
                              iconType[file.type]
                                ? iconType[file.type]
                                : "generic"
                            }`}
                          >
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                        </div>
                        <div className={styles.fileNameWrap}>
                          <span className={styles.fileNamePart1}>
                            {file.name.slice(0, -4)}
                          </span>
                          <span className={styles.fileNamePart2}>
                            {file.name.slice(-4)}
                          </span>
                          {/* <span>{file.progress}</span> */}
                        </div>
                      </div>
                    </td>
                    <td>{humanFileSize(file.size, true, 1)}</td>
                    <td>
                      {moment(file.lastModified)
                        // @ts-ignore
                        .locale("ru", localization)
                        .format("DD MMM YYYY HH:mm")}
                    </td>
                    <td>
                      <Button
                        isDisabled={true}
                        style={{ fontSize: "14px" }}
                        iconBefore={<WatchIcon label="" size="medium" />}
                        appearance="subtle"
                      ></Button>
                    </td>
                    <td>
                      {/* {file.url} */}
                      {/* <a
                        href={`http://10.1.1.177:9002/file/downloadById?id=${file.id}&name=${file.name}`}
                        // href={file.url}
                        // download={file.name}
                        download="Перевод Justice"
                      >
                        Скачать
                      </a> */}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <Pagination
            onChange={(e, page) => pagination(e, page)}
            pages={Array.from(
              { length: Math.ceil(taskFind.files.length / 6) },
              (v, k) => k + 1
            )}
          />
        </div>
      </div>
    </>
  ) : null;
});
