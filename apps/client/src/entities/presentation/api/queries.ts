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
            id
          }
        }
      }
    }
  }
`)

export const GET_PRESENTATION_INFO = gql(`#graphql
  query GetPresentationInfo($id: String!) {
    getPresentationInfo(id: $id) {
      totalImageElements
      totalShapeElements
      totalSlides
      totalTextElements
      totalUsers
    }
  }
`)
