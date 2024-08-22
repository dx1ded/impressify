import { gql } from "~/__generated__"

export const RENAME_PRESENTATION = gql(`#graphql
  mutation RenamePresentation($presentationId: ID!, $name: String!) {
    renamePresentation(id: $presentationId, name: $name) {
      id
    }
  }
`)
