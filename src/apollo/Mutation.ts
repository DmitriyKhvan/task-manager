import { gql } from "@apollo/client";

export const ADD_COLUMN = gql`
  mutation ADD_COLUMN($columns: [AddColumnDto!]) {
    TM_addColumn(payload: { columns: $columns }) {
      body {
        columnOrder
        columns {
          createdAt
          createdBy
          id
          limit
          stage
          taskIds
          title
        }
        tasks {
          content
          createdAt
          createdBy
          files
          flag
          links
          id
          marks
          nodes
          updatedAt
          updatedBy
        }
      }
      message
      status
    }
  }
`;

export const REMOVE_COLUMN = gql`
  mutation REMOVE_COLUMN($portableId: String, $removedId: String) {
    TM_removeColumn(
      payload: { portableId: $portableId, removedId: $removedId }
    ) {
      body {
        columnOrder
        columns {
          createdAt
          createdBy
          id
          limit
          taskIds
          title
        }
        tasks {
          content
          createdAt
          createdBy
          files
          flag
          links
          id
          marks
          nodes
          updatedAt
          updatedBy
        }
      }
      message
      status
    }
  }
`;

export const REMOVE_TASK = gql`
  mutation REMOVE_TASK($removedId: String!) {
    TM_removeTask(removedId: $removedId) {
      body {
        columnOrder
        columns {
          createdAt
          createdBy
          id
          limit
          stage
          taskIds
          title
        }
        tasks {
          content
          createdAt
          createdBy
          files
          flag
          links
          id
          marks
          nodes
          updatedAt
          updatedBy
        }
      }
      message
      status
    }
  }
`;

export const ADD_TASK = gql`
  mutation ADD_TASK($tasks: AddTaskDto) {
    TM_addTask(payload: { tasks: $tasks }) {
      body {
        columnOrder
        columns {
          createdAt
          createdBy
          id
          limit
          stage
          taskIds
          title
        }
        tasks {
          content
          createdAt
          createdBy
          files
          flag
          links
          id
          marks
          nodes
          updatedAt
          updatedBy
        }
      }
      message
      status
    }
  }
`;

export const SET_TASK_ORDER = gql`
  mutation SET_TASK_ORDER($taskIds: [String!]) {
    TM_setTaskOrder(payload: { taskIds: $taskIds }) {
      body {
        columnOrder
        columns {
          createdAt
          createdBy
          id
          limit
          stage
          taskIds
          title
        }
        tasks {
          content
          createdAt
          createdBy
          files
          flag
          links
          id
          marks
          nodes
          updatedAt
          updatedBy
        }
      }
      message
      status
    }
  }
`;

export const SET_COLUMN_ORDER = gql`
  mutation SET_COLUMN_ORDER($columnIds: [String!]) {
    TM_setColumnOrder(payload: { columnIds: $columnIds }) {
      body {
        columnOrder
        columns {
          createdAt
          createdBy
          id
          limit
          stage
          taskIds
          title
        }
        tasks {
          content
          createdAt
          createdBy
          files
          flag
          links
          id
          marks
          nodes
          updatedAt
          updatedBy
        }
      }
      message
      status
    }
  }
`;
