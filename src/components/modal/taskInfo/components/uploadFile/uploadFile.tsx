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

export default memo(function UploadFile(props: any) {
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

      dispatch(setFiles({ files: tempFiles }));

      for (let i = 0; i < currentFiles.length; i++) {
        // debugger;
        await dispatch(fetchUploadFiles(currentFiles[i]));
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

      <Tooltip content={props.tooltipContent}>
        {(tooltipProps) => (
          <Button
            // style={{ width: props.width, height: props.height }}
            {...tooltipProps}
            onClick={uploadFile}
            iconBefore={props.icon || <AttachmentIcon label="" size="medium" />}
            appearance={props.appearance || ""}
            // onClick={}
          >
            {props.visibleWorld && <>Прикрепить</>}
          </Button>
        )}
      </Tooltip>
    </form>
  );
});
