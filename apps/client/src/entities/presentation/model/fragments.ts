import { gql } from "~/__generated__"

export const SLIDE_FIELDS = gql(`#graphql
    fragment SlideFields on Slide {
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
`)
