import { gql } from "~/__generated__"

export const ADD_RECORD = gql(`#graphql
  mutation AddRecord($presentationId: String!) {
    addRecord(presentationId: $presentationId) {
      id
    }
  }
`)
