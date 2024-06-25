import { gql } from "~/__generated__"

export const DELETE_PRESENTATION = gql(`#graphql
  mutation DeletePresentation($presentationId: ID!) {
    deletePresentation(id: $presentationId)
  }
`)
