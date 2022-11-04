import React from "react";

import Breadcrumbs, { BreadcrumbsItem } from "@atlaskit/breadcrumbs";
import ButtonGroup from "@atlaskit/button/button-group";
import Button from "@atlaskit/button/standard-button";
import Select from "@atlaskit/select";
import TextField from "@atlaskit/textfield";

import PageHeader from "@atlaskit/page-header";
import EditorSearchIcon from "@atlaskit/icon/glyph/editor/search";

import styles from "./pageHeader.module.scss";
import { useDispatch } from "react-redux";
import { toDoSlice } from "../../store/reducers/ToDoSlice";
import { useCallback } from "react";

const breadcrumbs = (
  <Breadcrumbs onExpand={() => {}}>
    <BreadcrumbsItem text="Some project" key="Some project" />
    <BreadcrumbsItem text="Parent page" key="Parent page" />
  </Breadcrumbs>
);
const actionsContent = (
  <ButtonGroup>
    <Button appearance="primary">Primary Action</Button>
    <Button>Default</Button>
    <Button>...</Button>
  </ButtonGroup>
);

const BarContent = () => {
  const dispatch: any = useDispatch();
  const { searchTasks } = toDoSlice.actions;

  const searchTasksHandler: any = useCallback((e: any) => {
    dispatch(
      searchTasks({
        value: e.target.value,
      })
    );
  }, []);
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: "0 0 200px" }}>
        <TextField
          elemAfterInput={<EditorSearchIcon label="error" />}
          isCompact
          placeholder="Поиск по доске"
          aria-label="Search"
          onChange={searchTasksHandler}
        />
      </div>
      <div style={{ flex: "0 0 200px", marginLeft: 8, zIndex: 100 }}>
        <Select
          spacing="compact"
          placeholder="Choose an option"
          aria-label="Choose an option"
        />
      </div>
    </div>
  );
};

const PageHeaderComplex = () => {
  return (
    <div className={styles.pageHeader}>
      <PageHeader
        breadcrumbs={breadcrumbs}
        actions={actionsContent}
        bottomBar={<BarContent></BarContent>}
      >
        Title describing what page content to expect
      </PageHeader>
    </div>
  );
};

export default PageHeaderComplex;
