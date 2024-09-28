import { gql } from "~/__generated__"

export const ADD_HISTORY_RECORD = gql(`#graphql
  mutation AddHistoryRecord($presentationId: ID!) {
    addRecord(presentationId: $presentationId) {
      id
    }
  }
`)
