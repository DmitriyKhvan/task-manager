import { toDoSlice } from "./ToDoSlice";
import axios from "axios";

export const fetchUploadFiles =
  (file: any, task: any, column: any, uploadFileToGraphQl: any) =>
  async (dispatch: any) => {
    console.log("task55555555555555", task);
    // debugger;

    const { setUploadFiles, setProgresCurrentFile, deleteFile } =
      toDoSlice.actions;

    try {
      let formData = new FormData();
      formData.append("files", file);
      formData.append("source", "toDoList");
      await axios
        .post("http://10.1.1.177:9002/file/upload", formData, {
          headers: {
            // "X-CSRFTOKEN": getCookie("csrftoken"),
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            let progresCurrentFile = {
              progress: 0,
              lastModified: file.lastModified,
              type: file.type,
              name: file.name,
              size: file.size,
            };

            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            progresCurrentFile.progress = percentCompleted;
            // debugger;

            dispatch(
              setProgresCurrentFile({ progresCurrentFile: progresCurrentFile })
            );
          },
        })
        .then((response) => {
          // dispatch(setProgresCurrentFile({ progresCurrentFile: null }));
          console.log("res", response.data.file_details);

          // const file = response.data.file_details.map((file) => {
          //   return {
          //     type: file.contentType,
          //     name: file.fileName,
          //     size: file.fileSize,
          //     id: file.id,
          //     url: file.url,
          //     lastModified: file.createdAt,
          //   };
          // });

          const fileUpload = response.data.file_details[0];

          if (fileUpload) {
            dispatch(
              setUploadFiles({
                file: fileUpload,
                task,
                uploadFileToGraphQl,
              })
            );

            // dispatch(deleteFile());
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };
