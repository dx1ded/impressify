import { gql } from "~/__generated__"

export const SEARCH_PRESENTATIONS = gql(`#graphql
  query SearchPresentations($name: String!) {
    searchPresentations(name: $name) {
      id
      name
      history {
        records {
          lastOpened
          user {
            props {
              id
            }
          }
        }
      }
    }
  }
`)
