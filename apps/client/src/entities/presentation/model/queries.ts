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

export const GET_PRESENTATION = gql(`#graphql
  query GetPresentation($presentationId: String!) {
    getPresentation(id: $presentationId) {
      id
      name
      slides {
        id
        bg
        transition
        thumbnailUrl
        elements {
          id
          x
          y
          width
          height
          angle
          scaleX
          scaleY

          ... on Text {
            text
            textColor
            fillColor
            borderColor
            fontFamily
            fontSize
            bold
            italic
            underlined
            alignment
            lineHeight
          }

          ... on Image {
            imageUrl
          }

          ... on Shape {
            type
            fillColor
            strokeColor
            strokeWidth
            proportional
          }
        }
      }
      users {
        id
        email
        name
        profilePicUrl
      }
    }
  }
`)

export const SAVE_SLIDES = gql(`#graphql
  mutation SaveSlides($presentationId: String!, $slides: [SlideInput!]!) {
    saveSlides(presentationId: $presentationId, slides: $slides) {
      id
    }
  }
`)

export const SYNCHRONIZE_PRESENTATION_STATE = gql(`#graphql
  mutation SynchronizePresentationState($changes: PresentationStateInput!) {
    synchronizePresentationState(changes: $changes) {
      name
    }
  }
`)

export const PRESENTATION_UPDATED = gql(`#graphql
  subscription PresentationUpdated {
    presentationUpdated {
      isSaving
      name
      slides {
        id
        bg
        transition
        thumbnailUrl
        elements {
          id
          x
          y
          width
          height
          angle
          scaleX
          scaleY

          ... on Text {
            text
            textColor
            fillColor
            borderColor
            fontFamily
            fontSize
            bold
            italic
            underlined
            alignment
            lineHeight
          }

          ... on Image {
            imageUrl
          }

          ... on Shape {
            type
            fillColor
            strokeColor
            strokeWidth
            proportional
          }
        }
      }
      users {
        id
        email
        name
        profilePicUrl
      }
    }
  }
`)
