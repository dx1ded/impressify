import { gql } from "~/__generated__"

export const GET_HELP = gql(`#graphql
  mutation GetHelp($text: String!) {
    getHelp(text: $text)
  }
`)
