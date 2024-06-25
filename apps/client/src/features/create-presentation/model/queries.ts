import { gql } from "~/__generated__"

export const CREATE_PRESENTATION = gql(`#graphql
  mutation CreatePresentation($name: String!, $template: String!) {
    createPresentation(name: $name, template: $template) {
      id
    }
  }
`)
