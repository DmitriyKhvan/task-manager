import React from "react";

import Breadcrumbs, { BreadcrumbsItem } from "@atlaskit/breadcrumbs";

const BreadcrumbsComp = () => {
  return (
    <Breadcrumbs>
      <BreadcrumbsItem href="/item" text="Проекты" />
      <BreadcrumbsItem href="/item" text="MSB" />
    </Breadcrumbs>
  );
};

export default BreadcrumbsComp;
