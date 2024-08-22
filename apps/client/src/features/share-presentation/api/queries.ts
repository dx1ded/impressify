import { gql } from "~/__generated__"

export const INVITE_USER = gql(`#graphql
  mutation Invite($email: String!, $presentationId: String!) {
    invite(email: $email, presentationId: $presentationId)
  }
`)
