import { useMutation } from "@apollo/client";
import { DropdownItem } from "@atlaskit/dropdown-menu";
import { ButtonItem, MenuGroup, Section } from "@atlaskit/menu";
import { useDispatch } from "react-redux";
import { ADD_TASK } from "../../../../apollo/Mutation";
import { flagSlice } from "../../../../store/reducers/FlagSlice";
import { toDoSlice } from "../../../../store/reducers/ToDoSlice";
import { updateStore } from "../../../../utils/updateStore";

const MenuGroupComponent = ({ column, task }: any) => {
  const [addTaskQuery, {}] = useMutation(ADD_TASK, {
    onCompleted: (data) => {
      dispatch(updateStore(data.TM_addTask.body));
    },
    // refetchQueries: [{ query: GET_COLUMNS }],
  });

  console.log("task", task);
  console.log("column", column);

  const dispatch = useDispatch();
  const { setTaskData, setModalTaskData } = flagSlice.actions;
  const { editTask } = toDoSlice.actions;

  const orderTask = column.taskIds.findIndex(
    (taskId: any) => taskId === task.id
  );

  const setTaskDataHandler = () => {
    dispatch(
      setTaskData({
        modal: true,
        taskId: task.id,
        columnId: column.id,
      })
    );
  };

  const modalMarkHandler = () => {
    dispatch(
      setModalTaskData({
        isOpen: true,
        task: task,
        column: column,
      })
    );
  };

  const toggleFlagTaskHandler = (value: any) => {
    addTaskQuery({
      variables: {
        tasks: {
          id: task.id,
          content: task.content,
          files: JSON.stringify(task.files),
          flag: value,
          links: JSON.stringify(task.links),
          marks: JSON.stringify(task.marks),
          nodes: JSON.stringify(task.nodes),
          columnId: column.id,
          order: orderTask,
        },
      },
    });
    // dispatch(
    //   editTask({
    //     taskId: task.id,
    //     data: value,
    //     dataName: "flag",
    //   })
    // );
  };
  return (
    <MenuGroup>
      <Section title="Действия">
        {task.flag ? (
          <DropdownItem onClick={() => toggleFlagTaskHandler(false)}>
            Снять отметку
          </DropdownItem>
        ) : (
          <DropdownItem onClick={() => toggleFlagTaskHandler(true)}>
            Добавить флажок
          </DropdownItem>
        )}

        <DropdownItem onClick={modalMarkHandler}>Добавить метку</DropdownItem>
        <DropdownItem>Добавить родительскую задачу</DropdownItem>
        <DropdownItem>Копировать ссылку на задачу</DropdownItem>
        <DropdownItem onClick={setTaskDataHandler}>Удалить</DropdownItem>
      </Section>
      <Section title="Переместить в">
        <ButtonItem>Нижняя часть столбца</ButtonItem>
      </Section>
    </MenuGroup>
  );
};

export default MenuGroupComponent;
