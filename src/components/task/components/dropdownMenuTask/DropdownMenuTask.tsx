import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from "@atlaskit/dropdown-menu";
import { ButtonItem, MenuGroup, Section } from "@atlaskit/menu";
import Button from "@atlaskit/button/standard-button";
import MoreIcon from "@atlaskit/icon/glyph/more";
import { useDispatch } from "react-redux";
import { flagSlice } from "../../../../store/reducers/FlagSlice";
import { toDoSlice } from "../../../../store/reducers/ToDoSlice";
import MenuGroupComponent from "../menuGroupComponent/MenuGroupComponent";

const DropdownMenuTask = (props: any) => {
  return (
    <DropdownMenu
      placement="bottom-end"
      trigger={({ triggerRef, ...props }) => (
        <Button
          {...props}
          iconBefore={<MoreIcon label="more" />}
          ref={triggerRef}
        />
      )}
    >
      <div className="taskMenu">
        <DropdownItemGroup>
          <MenuGroupComponent
            column={props.column}
            task={props.task}
          ></MenuGroupComponent>
        </DropdownItemGroup>
      </div>
    </DropdownMenu>
  );
};

export default DropdownMenuTask;
