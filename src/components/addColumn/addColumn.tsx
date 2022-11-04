import Button from "@atlaskit/button";
// import NewFeature24Icon from "@atlaskit/icon-object/glyph/new-feature/24";
import AddIcon from "@atlaskit/icon/glyph/add";
import { useDispatch, useSelector } from "react-redux";
import { toDoSlice } from "../../store/reducers/ToDoSlice";

import styles from "./addColumn.module.scss";

const AddColumn = (props: any) => {
  const { addColumn }: any = toDoSlice.actions;
  const dispatch = useDispatch();
  const { columns } = useSelector((state: any) => state.toDoReducer);
  const newColumn = Object.values(columns).findIndex(
    (c: any) => c.title === ""
  );

  const addColumnHandler = () => {
    dispatch(addColumn());
    setTimeout(() => {
      const el: any = document.getElementById("wrapToDoContainer");
      el.scrollTo(el.scrollWidth, 0);
    });
  };
  return newColumn === -1 ? (
    <Button
      onClick={addColumnHandler}
      className={styles.addColumnBtn}
      iconBefore={<AddIcon label="add icon" size="medium" />}
    ></Button>
  ) : null;
};

export default AddColumn;
