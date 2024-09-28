import { gql } from "~/__generated__"

export const FIND_USER_PRESENTATIONS = gql(`#graphql
  query FindUserPresentations($preview: Boolean!, $sortBy: String!) {
    findUserPresentations(preview: $preview, sortBy: $sortBy) {
      id
      name
      users {
        id
      }
      slides {
        thumbnailUrl
      }
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

export const GET_PRESENTATION_INFO = gql(`#graphql
  query GetPresentationInfo($id: ID!) {
    getPresentationInfo(id: $id) {
      totalImageElements
      totalShapeElements
      totalSlides
      totalTextElements
      totalUsers
    }
  }
`)

export const PRESENTATION_LIST_UPDATED = gql(`#graphql
  subscription PresentationListUpdated {
    presentationListUpdated {
      type
      presentation {
        id
        name
        users {
          id
        }
        slides {
          thumbnailUrl
        }
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
  }
`)
