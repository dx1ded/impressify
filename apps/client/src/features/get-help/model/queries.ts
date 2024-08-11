import { gql } from "~/__generated__"

export const SEND_HELP_REQUEST = gql(`#graphql
  mutation SendHelpRequest($text: String!) {
    sendHelpRequest(text: $text)
  }
`)
