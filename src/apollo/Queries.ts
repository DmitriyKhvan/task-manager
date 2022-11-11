import { gql } from "@apollo/client";

export const GET_COLUMNS = gql`
  query {
    TM_getColumns {
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
