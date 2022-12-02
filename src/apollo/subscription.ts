import { gql } from "@apollo/client";

export const ADD_TASK_SUB = gql`
  subscription {
    taskAdded {
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
