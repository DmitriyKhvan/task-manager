import React, { useState } from "react";

import Tooltip from "@atlaskit/tooltip";
import moment from "moment";
import "moment/dist/locale/ru";

export default function DateInfo({ task }: any) {
  moment.locale("ru");
  const [toogleDateFormat, setToogleDateFormat] = useState(true);

  const toogleDateFormatHandler = () => {
    setToogleDateFormat(!toogleDateFormat);
  };

  return (
    <div className="dateBlock">
      <div>Создано {moment(task.createdAt).format("LLL")}</div>
      <div>
        Дата обновления{" "}
        {
          // @ts-ignore
          // new Date() - new Date() - 18 * 60 * 60 * 1000 > 86400000 ? (
          new Date() - new Date(task.updatedAt) > 86400000 ? (
            <span>{moment(new Date(task.updatedAt)).format("LLL")}</span>
          ) : (
            <>
              {toogleDateFormat ? (
                <span className="dateFormat" onClick={toogleDateFormatHandler}>
                  {moment(new Date(task.updatedAt)).format("LLL")}
                </span>
              ) : (
                <Tooltip
                  content={moment(new Date(task.updatedAt)).format("LLL")}
                  position="right"
                >
                  {(tooltipProps) => (
                    <span
                      {...tooltipProps}
                      className="dateFormat"
                      onClick={toogleDateFormatHandler}
                    >
                      {moment(new Date(task.updatedAt))
                        // .startOf("hour")
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
  );
}
