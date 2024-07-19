import { gql } from "~/__generated__"

export const COPY_PRESENTATION = gql(`#graphql
  mutation CopyPresentation($id: ID!) {
    copyPresentation(id: $id) {
      id
    }
  }
`)
