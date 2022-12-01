import React, { memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import Button from "@atlaskit/button";
import Tooltip from "@atlaskit/tooltip";
import EditorCloseIcon from "@atlaskit/icon/glyph/editor/close";
import WorldIcon from "@atlaskit/icon/glyph/world";
import EditorAddIcon from "@atlaskit/icon/glyph/editor/add";
import EditorLinkIcon from "@atlaskit/icon/glyph/editor/link";

import styles from "./taskLinks.module.scss";
import { useDispatch } from "react-redux";
import { flagSlice } from "../../../../../store/reducers/FlagSlice";
import favicon from "../../../../../assets/link.svg";
import axios from "axios";

const TaskLinks = memo(
  ({ task: { task, column, isOpen }, setVisibleAddLink }: any) => {
    const img: any = useRef(null);

    const { tasks } = useSelector((state: any) => state.toDoReducer);
    const dispatch = useDispatch();
    const { modalTaskEdit } = flagSlice.actions;

    const taskFind = tasks[task.id];

    const modalLinkHandler = (id: any) => {
      const links = taskFind.links.filter((link: any) => link.id !== id);
      const orderTask = column?.taskIds.findIndex(
        (taskId: any) => taskId === taskFind?.id
      );

      const taskEdit = {
        id: taskFind.id,
        columnId: column.id,
        content: taskFind.content,
        flag: taskFind.flag,
        links: JSON.stringify(links),
        marks: JSON.stringify(taskFind.marks),
        files: JSON.stringify(taskFind.files),
        nodes: JSON.stringify(taskFind.nodes),
        order: orderTask,
      };
      dispatch(
        modalTaskEdit({
          isOpen: true,
          task: taskEdit,
          title: "Удалить эту ссылку на веб-страницу?",
          content: <p>При желании вы сможете добавить ссылку снова.</p>,
        })
      );
    };

    const errorImg = (e: any) => {
      console.log("errorImg", e);
      img.current.src = favicon;
    };

    return (
      <div className={styles.taskLinksWrap}>
        <div className={styles.titleTaskLinks}>
          <h4>Ссылки на веб-страницы</h4>
          <div>
            <Button
              className={styles.addTaskLink}
              onClick={() => setVisibleAddLink(true)}
              iconBefore={<EditorAddIcon label="" size="medium" />}
              appearance="subtle"
            ></Button>
          </div>
        </div>

        <ul className={styles.taskLinks}>
          {taskFind.links.map((link: any, index: any) => {
            const u = new URL(link.url);

            // console.log(new URL(link.url));
            // faviconFetch(u);
            // const favicon = await axios.get(
            //   `url(${u.protocol}://${u.host}/favicon.ico`
            // );
            // console.log("favicon", favicon);
            // console.log(`${u.protocol}://${u.host}/favicon.ico`);
            return (
              <li key={link.id} className={styles.item}>
                <a href={link.url} target="blank" className={styles.itemLink}>
                  <div className="iconLink">
                    {/* <WorldIcon></WorldIcon> */}
                    {/* <span className={styles.iconLinkWrap}>
                    <span
                      className={styles.iconLink}
                      style={{
                        backgroundImage: `url(${u.protocol}://${u.host}/favicon.ico`,
                        // backgroundImage: `url(${favicon})`,
                      }}
                    ></span>
                  </span> */}

                    <span className={styles.iconLinkWrap}>
                      <img
                        className={styles.iconLink}
                        src={`${u.protocol}//${u.host}/favicon.ico`}
                        ref={img}
                        onError={errorImg}
                      ></img>
                    </span>
                  </div>
                  <Tooltip content={link.text || link.url}>
                    {(tooltipProps) => (
                      <p className={styles.textLink} {...tooltipProps}>
                        {link.text || link.url}
                      </p>
                    )}
                  </Tooltip>
                </a>
                <Button
                  onClick={() => modalLinkHandler(link.id)}
                  className={styles.removeLink}
                  iconBefore={
                    <EditorCloseIcon
                      label=""
                      primaryColor="#5E6C84 "
                      size="medium"
                    />
                  }
                  appearance="subtle"
                ></Button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
);

export default TaskLinks;
