import { gql } from "~/__generated__"

export const ADD_HISTORY_RECORD = gql(`#graphql
  mutation AddHistoryRecord($presentationId: String!) {
    addRecord(presentationId: $presentationId) {
      id
    }
  }
`)
