import React from "react";

import { css, jsx } from "@emotion/core";

const slotLabelStyles = css({
  textAlign: "center",
});

const SlotLabel = ({ children, isSmall = false }: any) => {
  const Component = isSmall ? "h4" : "h3";
  return <Component css={slotLabelStyles}>{children}</Component>;
};

export default SlotLabel;
