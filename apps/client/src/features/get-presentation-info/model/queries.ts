import { gql } from "~/__generated__"

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
