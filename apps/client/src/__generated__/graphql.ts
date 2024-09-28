/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export enum Alignment {
  Center = 'CENTER',
  Left = 'LEFT',
  Right = 'RIGHT'
}

export type Element = {
  angle: Scalars['Float']['output'];
  height: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  position: Scalars['Int']['output'];
  scaleX: Scalars['Float']['output'];
  scaleY: Scalars['Float']['output'];
  slide: Slide;
  width: Scalars['Float']['output'];
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

export type History = {
  __typename?: 'History';
  id: Scalars['Int']['output'];
  presentation: Presentation;
  records: Array<HistoryRecord>;
};

export type HistoryRecord = {
  __typename?: 'HistoryRecord';
  history: History;
  id: Scalars['Int']['output'];
  lastOpened: Scalars['Date']['output'];
  user: PresentationUser;
};

export type Image = Element & {
  __typename?: 'Image';
  angle: Scalars['Float']['output'];
  height: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  position: Scalars['Int']['output'];
  scaleX: Scalars['Float']['output'];
  scaleY: Scalars['Float']['output'];
  slide: Slide;
  width: Scalars['Float']['output'];
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addRecord?: Maybe<HistoryRecord>;
  changeUserRole?: Maybe<Result>;
  createPresentation?: Maybe<Presentation>;
  deletePresentation?: Maybe<Result>;
  duplicatePresentation?: Maybe<Presentation>;
  invite?: Maybe<Result>;
  kick?: Maybe<Result>;
  renamePresentation?: Maybe<Presentation>;
  sendHelpRequest?: Maybe<Result>;
};


export type MutationAddRecordArgs = {
  presentationId: Scalars['ID']['input'];
};


export type MutationChangeUserRoleArgs = {
  presentationId: Scalars['ID']['input'];
  role: Role;
  userId: Scalars['ID']['input'];
};


export type MutationCreatePresentationArgs = {
  name: Scalars['String']['input'];
  template: Scalars['String']['input'];
};


export type MutationDeletePresentationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDuplicatePresentationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationInviteArgs = {
  presentationId: Scalars['ID']['input'];
  role: Role;
  userId: Scalars['ID']['input'];
};


export type MutationKickArgs = {
  presentationId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationRenamePresentationArgs = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationSendHelpRequestArgs = {
  text: Scalars['String']['input'];
};

export type Presentation = {
  __typename?: 'Presentation';
  history: History;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  slides: Array<Slide>;
  users: Array<PresentationUser>;
};

export type PresentationInfo = {
  __typename?: 'PresentationInfo';
  totalImageElements: Scalars['Int']['output'];
  totalShapeElements: Scalars['Int']['output'];
  totalSlides: Scalars['Int']['output'];
  totalTextElements: Scalars['Int']['output'];
  totalUsers: Scalars['Int']['output'];
};

export type PresentationUpdate = {
  __typename?: 'PresentationUpdate';
  presentation: Presentation;
  type: PresentationUpdateType;
  userIds?: Maybe<Array<Scalars['ID']['output']>>;
};

export enum PresentationUpdateType {
  Added = 'ADDED',
  Changed = 'CHANGED',
  Deleted = 'DELETED'
}

export type PresentationUser = {
  __typename?: 'PresentationUser';
  id: Scalars['Int']['output'];
  presentation: Presentation;
  props: User;
  record?: Maybe<HistoryRecord>;
  role: Role;
};

export type Query = {
  __typename?: 'Query';
  findUserPresentations?: Maybe<Array<Presentation>>;
  findUsers?: Maybe<Array<User>>;
  getPresentation?: Maybe<Presentation>;
  getPresentationInfo?: Maybe<PresentationInfo>;
  searchPresentations?: Maybe<Array<Presentation>>;
  user?: Maybe<User>;
};


export type QueryFindUserPresentationsArgs = {
  preview: Scalars['Boolean']['input'];
  sortBy: Scalars['String']['input'];
};


export type QueryFindUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QueryGetPresentationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPresentationInfoArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySearchPresentationsArgs = {
  name: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export enum Result {
  Error = 'ERROR',
  NotAllowed = 'NOT_ALLOWED',
  NotFound = 'NOT_FOUND',
  Success = 'SUCCESS'
}

export enum Role {
  Creator = 'CREATOR',
  Editor = 'EDITOR',
  Reader = 'READER'
}

export type Shape = Element & {
  __typename?: 'Shape';
  angle: Scalars['Float']['output'];
  fillColor: Scalars['String']['output'];
  height: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  position: Scalars['Int']['output'];
  proportional: Scalars['Boolean']['output'];
  scaleX: Scalars['Float']['output'];
  scaleY: Scalars['Float']['output'];
  slide: Slide;
  strokeColor: Scalars['String']['output'];
  strokeWidth: Scalars['Int']['output'];
  type: ShapeType;
  width: Scalars['Float']['output'];
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

export enum ShapeType {
  Arrow = 'ARROW',
  Circle = 'CIRCLE',
  Line = 'LINE',
  Rectangle = 'RECTANGLE',
  Square = 'SQUARE',
  Star = 'STAR'
}

export type Slide = {
  __typename?: 'Slide';
  bg: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  elements: Array<Element>;
  id: Scalars['ID']['output'];
  position: Scalars['Int']['output'];
  presentation: Presentation;
  thumbnailUrl: Scalars['String']['output'];
  transition: Transition;
};

export type Subscription = {
  __typename?: 'Subscription';
  presentationListUpdated: PresentationUpdate;
};

export type Text = Element & {
  __typename?: 'Text';
  alignment: Alignment;
  angle: Scalars['Float']['output'];
  bold: Scalars['Boolean']['output'];
  borderColor: Scalars['String']['output'];
  fillColor: Scalars['String']['output'];
  fontFamily: Scalars['String']['output'];
  fontSize: Scalars['Int']['output'];
  height: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  italic: Scalars['Boolean']['output'];
  lineHeight: Scalars['Float']['output'];
  position: Scalars['Int']['output'];
  scaleX: Scalars['Float']['output'];
  scaleY: Scalars['Float']['output'];
  slide: Slide;
  text: Scalars['String']['output'];
  textColor: Scalars['String']['output'];
  underlined: Scalars['Boolean']['output'];
  width: Scalars['Float']['output'];
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

export enum Transition {
  Fade = 'FADE',
  Flip = 'FLIP',
  None = 'NONE',
  SlidesFromRight = 'SLIDES_FROM_RIGHT',
  SlideFromLeft = 'SLIDE_FROM_LEFT'
}

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  profilePicUrl: Scalars['String']['output'];
};

export type AddHistoryRecordMutationVariables = Exact<{
  presentationId: Scalars['ID']['input'];
}>;


export type AddHistoryRecordMutation = { __typename?: 'Mutation', addRecord?: { __typename?: 'HistoryRecord', id: number } | null };

export type InviteMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  presentationId: Scalars['ID']['input'];
  role: Role;
}>;


export type InviteMutation = { __typename?: 'Mutation', invite?: Result | null };

export type KickMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  presentationId: Scalars['ID']['input'];
}>;


export type KickMutation = { __typename?: 'Mutation', kick?: Result | null };

export type ChangeUserRoleMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  presentationId: Scalars['ID']['input'];
  role: Role;
}>;


export type ChangeUserRoleMutation = { __typename?: 'Mutation', changeUserRole?: Result | null };

export type SlideFieldsFragment = { __typename?: 'Slide', id: string, bg: string, transition: Transition, thumbnailUrl: string, elements: Array<{ __typename?: 'Image', imageUrl: string, id: string, x: number, y: number, width: number, height: number, angle: number, scaleX: number, scaleY: number } | { __typename?: 'Shape', type: ShapeType, fillColor: string, strokeColor: string, strokeWidth: number, proportional: boolean, id: string, x: number, y: number, width: number, height: number, angle: number, scaleX: number, scaleY: number } | { __typename?: 'Text', text: string, textColor: string, fillColor: string, borderColor: string, fontFamily: string, fontSize: number, bold: boolean, italic: boolean, underlined: boolean, alignment: Alignment, lineHeight: number, id: string, x: number, y: number, width: number, height: number, angle: number, scaleX: number, scaleY: number }> };

export type FindUserPresentationsQueryVariables = Exact<{
  preview: Scalars['Boolean']['input'];
  sortBy: Scalars['String']['input'];
}>;


export type FindUserPresentationsQuery = { __typename?: 'Query', findUserPresentations?: Array<{ __typename?: 'Presentation', id: string, name: string, users: Array<{ __typename?: 'PresentationUser', id: number }>, slides: Array<{ __typename?: 'Slide', thumbnailUrl: string }>, history: { __typename?: 'History', records: Array<{ __typename?: 'HistoryRecord', lastOpened: any, user: { __typename?: 'PresentationUser', props: { __typename?: 'User', id: string } } }> } }> | null };

export type GetPresentationInfoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPresentationInfoQuery = { __typename?: 'Query', getPresentationInfo?: { __typename?: 'PresentationInfo', totalImageElements: number, totalShapeElements: number, totalSlides: number, totalTextElements: number, totalUsers: number } | null };

export type PresentationListUpdatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type PresentationListUpdatedSubscription = { __typename?: 'Subscription', presentationListUpdated: { __typename?: 'PresentationUpdate', type: PresentationUpdateType, presentation: { __typename?: 'Presentation', id: string, name: string, users: Array<{ __typename?: 'PresentationUser', id: number }>, slides: Array<{ __typename?: 'Slide', thumbnailUrl: string }>, history: { __typename?: 'History', records: Array<{ __typename?: 'HistoryRecord', lastOpened: any, user: { __typename?: 'PresentationUser', props: { __typename?: 'User', id: string } } }> } } } };

export type FindUsersQueryVariables = Exact<{
  query: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
}>;


export type FindUsersQuery = { __typename?: 'Query', findUsers?: Array<{ __typename?: 'User', id: string, name: string, email: string, profilePicUrl: string }> | null };

export type CreatePresentationMutationVariables = Exact<{
  name: Scalars['String']['input'];
  template: Scalars['String']['input'];
}>;


export type CreatePresentationMutation = { __typename?: 'Mutation', createPresentation?: { __typename?: 'Presentation', id: string } | null };

export type DeletePresentationMutationVariables = Exact<{
  presentationId: Scalars['ID']['input'];
}>;


export type DeletePresentationMutation = { __typename?: 'Mutation', deletePresentation?: Result | null };

export type DuplicatePresentationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DuplicatePresentationMutation = { __typename?: 'Mutation', duplicatePresentation?: { __typename?: 'Presentation', id: string } | null };

export type SendHelpRequestMutationVariables = Exact<{
  text: Scalars['String']['input'];
}>;


export type SendHelpRequestMutation = { __typename?: 'Mutation', sendHelpRequest?: Result | null };

export type RenamePresentationMutationVariables = Exact<{
  presentationId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
}>;


export type RenamePresentationMutation = { __typename?: 'Mutation', renamePresentation?: { __typename?: 'Presentation', id: string } | null };

export type SearchPresentationsQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type SearchPresentationsQuery = { __typename?: 'Query', searchPresentations?: Array<{ __typename?: 'Presentation', id: string, name: string, history: { __typename?: 'History', records: Array<{ __typename?: 'HistoryRecord', lastOpened: any, user: { __typename?: 'PresentationUser', id: number } }> } }> | null };

export type GetSharePresentationInfoQueryVariables = Exact<{
  presentationId: Scalars['ID']['input'];
}>;


export type GetSharePresentationInfoQuery = { __typename?: 'Query', getPresentation?: { __typename?: 'Presentation', name: string, users: Array<{ __typename?: 'PresentationUser', role: Role, props: { __typename?: 'User', id: string, name: string, email: string, profilePicUrl: string } }> } | null };

export const SlideFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SlideFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Slide"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bg"}},{"kind":"Field","name":{"kind":"Name","value":"transition"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"elements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"angle"}},{"kind":"Field","name":{"kind":"Name","value":"scaleX"}},{"kind":"Field","name":{"kind":"Name","value":"scaleY"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Text"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"textColor"}},{"kind":"Field","name":{"kind":"Name","value":"fillColor"}},{"kind":"Field","name":{"kind":"Name","value":"borderColor"}},{"kind":"Field","name":{"kind":"Name","value":"fontFamily"}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"bold"}},{"kind":"Field","name":{"kind":"Name","value":"italic"}},{"kind":"Field","name":{"kind":"Name","value":"underlined"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"lineHeight"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Shape"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fillColor"}},{"kind":"Field","name":{"kind":"Name","value":"strokeColor"}},{"kind":"Field","name":{"kind":"Name","value":"strokeWidth"}},{"kind":"Field","name":{"kind":"Name","value":"proportional"}}]}}]}}]}}]} as unknown as DocumentNode<SlideFieldsFragment, unknown>;
export const AddHistoryRecordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddHistoryRecord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addRecord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"presentationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddHistoryRecordMutation, AddHistoryRecordMutationVariables>;
export const InviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Invite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"role"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Role"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"presentationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"role"},"value":{"kind":"Variable","name":{"kind":"Name","value":"role"}}}]}]}}]} as unknown as DocumentNode<InviteMutation, InviteMutationVariables>;
export const KickDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Kick"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kick"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"presentationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}}}]}]}}]} as unknown as DocumentNode<KickMutation, KickMutationVariables>;
export const ChangeUserRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangeUserRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"role"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Role"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeUserRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"presentationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"role"},"value":{"kind":"Variable","name":{"kind":"Name","value":"role"}}}]}]}}]} as unknown as DocumentNode<ChangeUserRoleMutation, ChangeUserRoleMutationVariables>;
export const FindUserPresentationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindUserPresentations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"preview"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findUserPresentations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"preview"},"value":{"kind":"Variable","name":{"kind":"Name","value":"preview"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slides"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastOpened"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"props"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindUserPresentationsQuery, FindUserPresentationsQueryVariables>;
export const GetPresentationInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPresentationInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPresentationInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalImageElements"}},{"kind":"Field","name":{"kind":"Name","value":"totalShapeElements"}},{"kind":"Field","name":{"kind":"Name","value":"totalSlides"}},{"kind":"Field","name":{"kind":"Name","value":"totalTextElements"}},{"kind":"Field","name":{"kind":"Name","value":"totalUsers"}}]}}]}}]} as unknown as DocumentNode<GetPresentationInfoQuery, GetPresentationInfoQueryVariables>;
export const PresentationListUpdatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"PresentationListUpdated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"presentationListUpdated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"presentation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slides"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastOpened"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"props"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<PresentationListUpdatedSubscription, PresentationListUpdatedSubscriptionVariables>;
export const FindUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicUrl"}}]}}]}}]} as unknown as DocumentNode<FindUsersQuery, FindUsersQueryVariables>;
export const CreatePresentationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePresentation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"template"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPresentation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"template"},"value":{"kind":"Variable","name":{"kind":"Name","value":"template"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreatePresentationMutation, CreatePresentationMutationVariables>;
export const DeletePresentationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePresentation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePresentation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}}}]}]}}]} as unknown as DocumentNode<DeletePresentationMutation, DeletePresentationMutationVariables>;
export const DuplicatePresentationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DuplicatePresentation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duplicatePresentation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DuplicatePresentationMutation, DuplicatePresentationMutationVariables>;
export const SendHelpRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendHelpRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendHelpRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}}]}]}}]} as unknown as DocumentNode<SendHelpRequestMutation, SendHelpRequestMutationVariables>;
export const RenamePresentationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RenamePresentation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renamePresentation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RenamePresentationMutation, RenamePresentationMutationVariables>;
export const SearchPresentationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchPresentations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchPresentations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastOpened"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SearchPresentationsQuery, SearchPresentationsQueryVariables>;
export const GetSharePresentationInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSharePresentationInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPresentation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"props"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicUrl"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetSharePresentationInfoQuery, GetSharePresentationInfoQueryVariables>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export enum Alignment {
  Center = 'CENTER',
  Left = 'LEFT',
  Right = 'RIGHT'
}

export type Element = {
  angle: Scalars['Float']['output'];
  height: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  position: Scalars['Int']['output'];
  scaleX: Scalars['Float']['output'];
  scaleY: Scalars['Float']['output'];
  slide: Slide;
  width: Scalars['Float']['output'];
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

export type History = {
  __typename?: 'History';
  id: Scalars['Int']['output'];
  presentation: Presentation;
  records: Array<HistoryRecord>;
};

export type HistoryRecord = {
  __typename?: 'HistoryRecord';
  history: History;
  id: Scalars['Int']['output'];
  lastOpened: Scalars['Date']['output'];
  user: PresentationUser;
};

export type Image = Element & {
  __typename?: 'Image';
  angle: Scalars['Float']['output'];
  height: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  position: Scalars['Int']['output'];
  scaleX: Scalars['Float']['output'];
  scaleY: Scalars['Float']['output'];
  slide: Slide;
  width: Scalars['Float']['output'];
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addRecord?: Maybe<HistoryRecord>;
  changeUserRole?: Maybe<Result>;
  createPresentation?: Maybe<Presentation>;
  deletePresentation?: Maybe<Result>;
  duplicatePresentation?: Maybe<Presentation>;
  invite?: Maybe<Result>;
  kick?: Maybe<Result>;
  renamePresentation?: Maybe<Presentation>;
  sendHelpRequest?: Maybe<Result>;
};


export type MutationAddRecordArgs = {
  presentationId: Scalars['ID']['input'];
};


export type MutationChangeUserRoleArgs = {
  presentationId: Scalars['ID']['input'];
  role: Role;
  userId: Scalars['ID']['input'];
};


export type MutationCreatePresentationArgs = {
  name: Scalars['String']['input'];
  template: Scalars['String']['input'];
};


export type MutationDeletePresentationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDuplicatePresentationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationInviteArgs = {
  presentationId: Scalars['ID']['input'];
  role: Role;
  userId: Scalars['ID']['input'];
};


export type MutationKickArgs = {
  presentationId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationRenamePresentationArgs = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationSendHelpRequestArgs = {
  text: Scalars['String']['input'];
};

export type Presentation = {
  __typename?: 'Presentation';
  history: History;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  slides: Array<Slide>;
  users: Array<PresentationUser>;
};

export type PresentationInfo = {
  __typename?: 'PresentationInfo';
  totalImageElements: Scalars['Int']['output'];
  totalShapeElements: Scalars['Int']['output'];
  totalSlides: Scalars['Int']['output'];
  totalTextElements: Scalars['Int']['output'];
  totalUsers: Scalars['Int']['output'];
};

export type PresentationUpdate = {
  __typename?: 'PresentationUpdate';
  presentation: Presentation;
  type: PresentationUpdateType;
  userIds?: Maybe<Array<Scalars['ID']['output']>>;
};

export enum PresentationUpdateType {
  Added = 'ADDED',
  Changed = 'CHANGED',
  Deleted = 'DELETED'
}

export type PresentationUser = {
  __typename?: 'PresentationUser';
  id: Scalars['Int']['output'];
  presentation: Presentation;
  props: User;
  record?: Maybe<HistoryRecord>;
  role: Role;
};

export type Query = {
  __typename?: 'Query';
  findUserPresentations?: Maybe<Array<Presentation>>;
  findUsers?: Maybe<Array<User>>;
  getPresentation?: Maybe<Presentation>;
  getPresentationInfo?: Maybe<PresentationInfo>;
  searchPresentations?: Maybe<Array<Presentation>>;
  user?: Maybe<User>;
};


export type QueryFindUserPresentationsArgs = {
  preview: Scalars['Boolean']['input'];
  sortBy: Scalars['String']['input'];
};


export type QueryFindUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QueryGetPresentationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPresentationInfoArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySearchPresentationsArgs = {
  name: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export enum Result {
  Error = 'ERROR',
  NotAllowed = 'NOT_ALLOWED',
  NotFound = 'NOT_FOUND',
  Success = 'SUCCESS'
}

export enum Role {
  Creator = 'CREATOR',
  Editor = 'EDITOR',
  Reader = 'READER'
}

export type Shape = Element & {
  __typename?: 'Shape';
  angle: Scalars['Float']['output'];
  fillColor: Scalars['String']['output'];
  height: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  position: Scalars['Int']['output'];
  proportional: Scalars['Boolean']['output'];
  scaleX: Scalars['Float']['output'];
  scaleY: Scalars['Float']['output'];
  slide: Slide;
  strokeColor: Scalars['String']['output'];
  strokeWidth: Scalars['Int']['output'];
  type: ShapeType;
  width: Scalars['Float']['output'];
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

export enum ShapeType {
  Arrow = 'ARROW',
  Circle = 'CIRCLE',
  Line = 'LINE',
  Rectangle = 'RECTANGLE',
  Square = 'SQUARE',
  Star = 'STAR'
}

export type Slide = {
  __typename?: 'Slide';
  bg: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  elements: Array<Element>;
  id: Scalars['ID']['output'];
  position: Scalars['Int']['output'];
  presentation: Presentation;
  thumbnailUrl: Scalars['String']['output'];
  transition: Transition;
};

export type Subscription = {
  __typename?: 'Subscription';
  presentationListUpdated: PresentationUpdate;
};

export type Text = Element & {
  __typename?: 'Text';
  alignment: Alignment;
  angle: Scalars['Float']['output'];
  bold: Scalars['Boolean']['output'];
  borderColor: Scalars['String']['output'];
  fillColor: Scalars['String']['output'];
  fontFamily: Scalars['String']['output'];
  fontSize: Scalars['Int']['output'];
  height: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  italic: Scalars['Boolean']['output'];
  lineHeight: Scalars['Float']['output'];
  position: Scalars['Int']['output'];
  scaleX: Scalars['Float']['output'];
  scaleY: Scalars['Float']['output'];
  slide: Slide;
  text: Scalars['String']['output'];
  textColor: Scalars['String']['output'];
  underlined: Scalars['Boolean']['output'];
  width: Scalars['Float']['output'];
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

export enum Transition {
  Fade = 'FADE',
  Flip = 'FLIP',
  None = 'NONE',
  SlidesFromRight = 'SLIDES_FROM_RIGHT',
  SlideFromLeft = 'SLIDE_FROM_LEFT'
}

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  profilePicUrl: Scalars['String']['output'];
};
