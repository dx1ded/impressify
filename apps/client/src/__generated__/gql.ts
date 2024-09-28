/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "#graphql\n  mutation AddHistoryRecord($presentationId: ID!) {\n    addRecord(presentationId: $presentationId) {\n      id\n    }\n  }\n": types.AddHistoryRecordDocument,
    "#graphql\n  mutation Invite($userId: ID!, $presentationId: ID!, $role: Role!) {\n    invite(userId: $userId, presentationId: $presentationId, role: $role)\n  }\n": types.InviteDocument,
    "#graphql\n  mutation Kick($userId: ID!, $presentationId: ID!) {\n    kick(userId: $userId, presentationId: $presentationId)\n  }\n": types.KickDocument,
    "#graphql\n  mutation ChangeUserRole($userId: ID!, $presentationId: ID!, $role: Role!) {\n    changeUserRole(userId: $userId, presentationId: $presentationId, role: $role)\n  }\n": types.ChangeUserRoleDocument,
    "#graphql\n  fragment SlideFields on Slide {\n    id\n    bg\n    transition\n    thumbnailUrl\n    elements {\n      id\n      x\n      y\n      width\n      height\n      angle\n      scaleX\n      scaleY\n\n      ... on Text {\n        text\n        textColor\n        fillColor\n        borderColor\n        fontFamily\n        fontSize\n        bold\n        italic\n        underlined\n        alignment\n        lineHeight\n      }\n\n      ... on Image {\n        imageUrl\n      }\n\n      ... on Shape {\n        type\n        fillColor\n        strokeColor\n        strokeWidth\n        proportional\n      }\n    }\n  }\n": types.SlideFieldsFragmentDoc,
    "#graphql\n  query FindUserPresentations($preview: Boolean!, $sortBy: String!) {\n    findUserPresentations(preview: $preview, sortBy: $sortBy) {\n      id\n      name\n      users {\n        id\n      }\n      slides {\n        thumbnailUrl\n      }\n      history {\n        records {\n          lastOpened\n          user {\n            props {\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n": types.FindUserPresentationsDocument,
    "#graphql\n  query GetPresentationInfo($id: ID!) {\n    getPresentationInfo(id: $id) {\n      totalImageElements\n      totalShapeElements\n      totalSlides\n      totalTextElements\n      totalUsers\n    }\n  }\n": types.GetPresentationInfoDocument,
    "#graphql\n  subscription PresentationListUpdated {\n    presentationListUpdated {\n      type\n      presentation {\n        id\n        name\n        users {\n          id\n        }\n        slides {\n          thumbnailUrl\n        }\n        history {\n          records {\n            lastOpened\n            user {\n              props {\n                id\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.PresentationListUpdatedDocument,
    "#graphql\n  query FindUsers($query: String!, $limit: Int!) {\n    findUsers(query: $query, limit: $limit) {\n      id\n      name\n      email\n      profilePicUrl\n    }\n}\n": types.FindUsersDocument,
    "#graphql\n  mutation CreatePresentation($name: String!, $template: String!) {\n    createPresentation(name: $name, template: $template) {\n      id\n    }\n  }\n": types.CreatePresentationDocument,
    "#graphql\n  mutation DeletePresentation($presentationId: ID!) {\n    deletePresentation(id: $presentationId)\n  }\n": types.DeletePresentationDocument,
    "#graphql\n  mutation DuplicatePresentation($id: ID!) {\n    duplicatePresentation(id: $id) {\n      id\n    }\n  }\n": types.DuplicatePresentationDocument,
    "#graphql\n  mutation SendHelpRequest($text: String!) {\n    sendHelpRequest(text: $text)\n  }\n": types.SendHelpRequestDocument,
    "#graphql\n  mutation RenamePresentation($presentationId: ID!, $name: String!) {\n    renamePresentation(id: $presentationId, name: $name) {\n      id\n    }\n  }\n": types.RenamePresentationDocument,
    "#graphql\n  query SearchPresentations($name: String!) {\n    searchPresentations(name: $name) {\n      id\n      name\n      history {\n        records {\n          lastOpened\n          user {\n            props {\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n": types.SearchPresentationsDocument,
    "#graphql\n  query GetSharePresentationInfo($presentationId: ID!) {\n    getPresentation(id: $presentationId) {\n      name\n      users {\n        role\n        props {\n          id\n          name\n          email\n          profilePicUrl\n        }\n      }\n    }\n  }\n": types.GetSharePresentationInfoDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation AddHistoryRecord($presentationId: ID!) {\n    addRecord(presentationId: $presentationId) {\n      id\n    }\n  }\n"): (typeof documents)["#graphql\n  mutation AddHistoryRecord($presentationId: ID!) {\n    addRecord(presentationId: $presentationId) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation Invite($userId: ID!, $presentationId: ID!, $role: Role!) {\n    invite(userId: $userId, presentationId: $presentationId, role: $role)\n  }\n"): (typeof documents)["#graphql\n  mutation Invite($userId: ID!, $presentationId: ID!, $role: Role!) {\n    invite(userId: $userId, presentationId: $presentationId, role: $role)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation Kick($userId: ID!, $presentationId: ID!) {\n    kick(userId: $userId, presentationId: $presentationId)\n  }\n"): (typeof documents)["#graphql\n  mutation Kick($userId: ID!, $presentationId: ID!) {\n    kick(userId: $userId, presentationId: $presentationId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation ChangeUserRole($userId: ID!, $presentationId: ID!, $role: Role!) {\n    changeUserRole(userId: $userId, presentationId: $presentationId, role: $role)\n  }\n"): (typeof documents)["#graphql\n  mutation ChangeUserRole($userId: ID!, $presentationId: ID!, $role: Role!) {\n    changeUserRole(userId: $userId, presentationId: $presentationId, role: $role)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  fragment SlideFields on Slide {\n    id\n    bg\n    transition\n    thumbnailUrl\n    elements {\n      id\n      x\n      y\n      width\n      height\n      angle\n      scaleX\n      scaleY\n\n      ... on Text {\n        text\n        textColor\n        fillColor\n        borderColor\n        fontFamily\n        fontSize\n        bold\n        italic\n        underlined\n        alignment\n        lineHeight\n      }\n\n      ... on Image {\n        imageUrl\n      }\n\n      ... on Shape {\n        type\n        fillColor\n        strokeColor\n        strokeWidth\n        proportional\n      }\n    }\n  }\n"): (typeof documents)["#graphql\n  fragment SlideFields on Slide {\n    id\n    bg\n    transition\n    thumbnailUrl\n    elements {\n      id\n      x\n      y\n      width\n      height\n      angle\n      scaleX\n      scaleY\n\n      ... on Text {\n        text\n        textColor\n        fillColor\n        borderColor\n        fontFamily\n        fontSize\n        bold\n        italic\n        underlined\n        alignment\n        lineHeight\n      }\n\n      ... on Image {\n        imageUrl\n      }\n\n      ... on Shape {\n        type\n        fillColor\n        strokeColor\n        strokeWidth\n        proportional\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  query FindUserPresentations($preview: Boolean!, $sortBy: String!) {\n    findUserPresentations(preview: $preview, sortBy: $sortBy) {\n      id\n      name\n      users {\n        id\n      }\n      slides {\n        thumbnailUrl\n      }\n      history {\n        records {\n          lastOpened\n          user {\n            props {\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["#graphql\n  query FindUserPresentations($preview: Boolean!, $sortBy: String!) {\n    findUserPresentations(preview: $preview, sortBy: $sortBy) {\n      id\n      name\n      users {\n        id\n      }\n      slides {\n        thumbnailUrl\n      }\n      history {\n        records {\n          lastOpened\n          user {\n            props {\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  query GetPresentationInfo($id: ID!) {\n    getPresentationInfo(id: $id) {\n      totalImageElements\n      totalShapeElements\n      totalSlides\n      totalTextElements\n      totalUsers\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetPresentationInfo($id: ID!) {\n    getPresentationInfo(id: $id) {\n      totalImageElements\n      totalShapeElements\n      totalSlides\n      totalTextElements\n      totalUsers\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  subscription PresentationListUpdated {\n    presentationListUpdated {\n      type\n      presentation {\n        id\n        name\n        users {\n          id\n        }\n        slides {\n          thumbnailUrl\n        }\n        history {\n          records {\n            lastOpened\n            user {\n              props {\n                id\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["#graphql\n  subscription PresentationListUpdated {\n    presentationListUpdated {\n      type\n      presentation {\n        id\n        name\n        users {\n          id\n        }\n        slides {\n          thumbnailUrl\n        }\n        history {\n          records {\n            lastOpened\n            user {\n              props {\n                id\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  query FindUsers($query: String!, $limit: Int!) {\n    findUsers(query: $query, limit: $limit) {\n      id\n      name\n      email\n      profilePicUrl\n    }\n}\n"): (typeof documents)["#graphql\n  query FindUsers($query: String!, $limit: Int!) {\n    findUsers(query: $query, limit: $limit) {\n      id\n      name\n      email\n      profilePicUrl\n    }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation CreatePresentation($name: String!, $template: String!) {\n    createPresentation(name: $name, template: $template) {\n      id\n    }\n  }\n"): (typeof documents)["#graphql\n  mutation CreatePresentation($name: String!, $template: String!) {\n    createPresentation(name: $name, template: $template) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation DeletePresentation($presentationId: ID!) {\n    deletePresentation(id: $presentationId)\n  }\n"): (typeof documents)["#graphql\n  mutation DeletePresentation($presentationId: ID!) {\n    deletePresentation(id: $presentationId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation DuplicatePresentation($id: ID!) {\n    duplicatePresentation(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["#graphql\n  mutation DuplicatePresentation($id: ID!) {\n    duplicatePresentation(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation SendHelpRequest($text: String!) {\n    sendHelpRequest(text: $text)\n  }\n"): (typeof documents)["#graphql\n  mutation SendHelpRequest($text: String!) {\n    sendHelpRequest(text: $text)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  mutation RenamePresentation($presentationId: ID!, $name: String!) {\n    renamePresentation(id: $presentationId, name: $name) {\n      id\n    }\n  }\n"): (typeof documents)["#graphql\n  mutation RenamePresentation($presentationId: ID!, $name: String!) {\n    renamePresentation(id: $presentationId, name: $name) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  query SearchPresentations($name: String!) {\n    searchPresentations(name: $name) {\n      id\n      name\n      history {\n        records {\n          lastOpened\n          user {\n            props {\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["#graphql\n  query SearchPresentations($name: String!) {\n    searchPresentations(name: $name) {\n      id\n      name\n      history {\n        records {\n          lastOpened\n          user {\n            props {\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "#graphql\n  query GetSharePresentationInfo($presentationId: ID!) {\n    getPresentation(id: $presentationId) {\n      name\n      users {\n        role\n        props {\n          id\n          name\n          email\n          profilePicUrl\n        }\n      }\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetSharePresentationInfo($presentationId: ID!) {\n    getPresentation(id: $presentationId) {\n      name\n      users {\n        role\n        props {\n          id\n          name\n          email\n          profilePicUrl\n        }\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;