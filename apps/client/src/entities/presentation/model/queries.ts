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
        ...SlideFields
      }
    }
  }
`)

export const SAVE_SLIDES = gql(`#graphql
  mutation SaveSlides($presentationId: String!, $slides: [SlideInput!]!) {
    saveSlides(presentationId: $presentationId, slides: $slides) {
      ...SlideFields
    }
  }
`)

export const SYNCHRONIZE_PRESENTATION_STATE = gql(`#graphql
  mutation SynchronizePresentationState($state: PresentationStateInput!) {
    synchronizePresentationState(state: $state) {
      __typename
    }
  }
`)

export const PRESENTATION_UPDATED = gql(`#graphql
  subscription PresentationUpdated($presentationId: String!) {
    presentationUpdated(presentationId: $presentationId) {
      isSaving
      name
      slides {
        ...SlideFields
      }
      connectedUsers {
        id
        name
        profilePicUrl
        currentSlideId
        cursorX
        cursorY
      }
    }
  }
`)
