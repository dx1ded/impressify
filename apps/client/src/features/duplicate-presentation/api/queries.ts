import { gql } from "~/__generated__"

export const DUPLICATE_PRESENTATION = gql(`#graphql
  mutation DuplicatePresentation($id: ID!) {
    duplicatePresentation(id: $id) {
      id
    }
  }
`)
