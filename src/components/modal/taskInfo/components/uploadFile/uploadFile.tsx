import React, { memo } from "react";
import Button from "@atlaskit/button/standard-button";
import AttachmentIcon from "@atlaskit/icon/glyph/attachment";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { toDoSlice } from "../../../../../store/reducers/ToDoSlice";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { flagSlice } from "../../../../../store/reducers/FlagSlice";
import { fetchUploadFiles } from "../../../../../store/reducers/ActionCreators";
import Tooltip from "@atlaskit/tooltip";
import { useMutation } from "@apollo/client";
import { ADD_TASK } from "../../../../../apollo/Mutation";
import { updateStore } from "../../../../../utils/updateStore";

export default memo(function UploadFile(props: any) {
  const [addTaskQuery, { loading, error, data }] = useMutation(ADD_TASK, {
    // onCompleted: (data) => {
    //   dispatch(updateStore(data.TM_addTask.body));
    // },
    // refetchQueries: [{ query: GET_COLUMNS }],
  });

  const { tasks, columns } = useSelector((state: any) => state.toDoReducer);

  const { task, column, tooltipContent, visibleWorld, icon, appearance } =
    props;

  const orderTask = column?.taskIds.findIndex(
    (taskId: any) => taskId === task.id
  );

  const taskFind = tasks[task?.id];
  console.log("taskFind77777777777777777777", taskFind);

  const uploadFileToGraphQl = (file: any) => {
    console.log("filefilefilefile", file);

    addTaskQuery({
      variables: {
        tasks: {
          id: taskFind.id,
          content: taskFind.content,
          files: JSON.stringify(file),
          flag: taskFind.flag,
          links: JSON.stringify(taskFind.links),
          // marks: JSON.stringify(marks.value),
          marks: JSON.stringify(taskFind.marks),
          nodes: JSON.stringify(taskFind.nodes),
          columnId: column.id,
          order: orderTask,
        },
      },
    });
  };

  // const [uploadfiles, setUploadFiles] = useState([]);

  const fileInput: any = useRef(null);
  const dispatch = useDispatch();

  const { setFiles, deleteFile } = toDoSlice.actions;
  const { uploadFileTrigger } = useSelector((state: any) => state.flagReducer);

  const { files, uploadFiles } = useSelector((state: any) => state.toDoReducer);

  const uploadFile: any = () => {
    fileInput.current.click();
  };

  const setFilesUpload = async (e: any) => {
    let currentFiles = e.target.files;
    let tempFiles = [];

    if (currentFiles) {
      for (let i = 1; i < currentFiles.length; i++) {
        tempFiles.push(currentFiles[i]);
      }

      dispatch(setFiles({ files: tempFiles })); // выбранные файлы для загрузки

      for (let i = 0; i < currentFiles.length; i++) {
        // debugger;
        await dispatch(
          fetchUploadFiles(
            currentFiles[i],
            taskFind,
            column,
            uploadFileToGraphQl
          )
        );
        // dispatch(deleteFile());
      }
    }
  };

  return (
    <form id="upload-container" method="POST">
      <input
        id="file-input"
        onChange={setFilesUpload}
        ref={fileInput}
        type="file"
        name="file"
        multiple
      />

      <Tooltip content={tooltipContent}>
        {(tooltipProps) => (
          <Button
            // style={{ width: props.width, height: props.height }}
            {...tooltipProps}
            onClick={uploadFile}
            iconBefore={icon || <AttachmentIcon label="" size="medium" />}
            appearance={appearance || ""}
            // onClick={}
          >
            {visibleWorld && <>Прикрепить</>}
          </Button>
        )}
      </Tooltip>
    </form>
  );
});
