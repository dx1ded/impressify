import { gql } from "~/__generated__"

export const ELEMENT_FIELDS = gql(`#graphql
  fragment ElementFields on Element {
    id
    layer
    x1
    y1
    x2
    y2
    angle

    ... on Text {
      text
      fillColor
      borderColor
      textColor
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
      fillColor
      strokeColor
      strokeWidth
      aspectRatio
      points
    }
  }
`)
