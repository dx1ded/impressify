import { gql } from "~/__generated__"

export const CREATE_PRESENTATION = gql(`#graphql
  mutation CreatePresentation($name: String!, $templateId: Int) {
    createPresentation(name: $name, templateId: $templateId) {
      id
    }
  }
`)
