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
    }
  }
`)

export const SAVE_SLIDES = gql(`#graphql
  mutation SaveSlides($presentationId: String!, $slides: [SlideInput!]!) {
    saveSlides(presentationId: $presentationId, slides: $slides) {
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
  }
`)
