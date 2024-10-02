import { gql } from "~/__generated__"

export const FIND_TEMPLATES = gql(`#graphql
  query FindTemplates {
    findTemplates {
      id
      name
      presentation {
        slides {
          thumbnailUrl
        }
      }
    }
  }
`)
