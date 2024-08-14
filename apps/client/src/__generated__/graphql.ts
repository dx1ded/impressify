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

export type Element = {
  angle: Scalars['Int']['output'];
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

export type ElementInput = {
  image: Array<ImageInput>;
  shape: Array<ShapeInput>;
  text: Array<TextInput>;
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
  user: User;
};

export type Image = Element & {
  __typename?: 'Image';
  angle: Scalars['Int']['output'];
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

export type ImageInput = {
  angle: Scalars['Int']['input'];
  height: Scalars['Float']['input'];
  id: Scalars['ID']['input'];
  imageUrl: Scalars['String']['input'];
  position: Scalars['Int']['input'];
  scaleX: Scalars['Float']['input'];
  scaleY: Scalars['Float']['input'];
  width: Scalars['Float']['input'];
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addRecord?: Maybe<HistoryRecord>;
  createPresentation?: Maybe<Presentation>;
  deletePresentation?: Maybe<Scalars['Boolean']['output']>;
  duplicatePresentation?: Maybe<Presentation>;
  invite?: Maybe<Scalars['Boolean']['output']>;
  renamePresentation?: Maybe<Presentation>;
  saveSlides?: Maybe<Array<Maybe<Slide>>>;
  sendHelpRequest?: Maybe<Scalars['Boolean']['output']>;
  synchronizePresentationState?: Maybe<PresentationState>;
};


export type MutationAddRecordArgs = {
  presentationId: Scalars['String']['input'];
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
  email: Scalars['String']['input'];
  presentationId: Scalars['String']['input'];
};


export type MutationRenamePresentationArgs = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationSaveSlidesArgs = {
  presentationId: Scalars['String']['input'];
  slides: Array<SlideInput>;
};


export type MutationSendHelpRequestArgs = {
  text: Scalars['String']['input'];
};


export type MutationSynchronizePresentationStateArgs = {
  state: PresentationStateInput;
};

export type Presentation = {
  __typename?: 'Presentation';
  history: History;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  slides: Array<Slide>;
  users: Array<User>;
};

export type PresentationInfo = {
  __typename?: 'PresentationInfo';
  totalImageElements: Scalars['Int']['output'];
  totalShapeElements: Scalars['Int']['output'];
  totalSlides: Scalars['Int']['output'];
  totalTextElements: Scalars['Int']['output'];
  totalUsers: Scalars['Int']['output'];
};

export type PresentationState = {
  __typename?: 'PresentationState';
  _userUpdatedStateId: Scalars['ID']['output'];
  isSaving: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  slides: Array<Slide>;
  users: Array<User>;
};

export type PresentationStateInput = {
  id: Scalars['ID']['input'];
  isSaving: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  slides: Array<SlideInput>;
  users: Array<UserInput>;
};

export type Query = {
  __typename?: 'Query';
  findUserPresentations?: Maybe<Array<Presentation>>;
  getPresentation?: Maybe<Presentation>;
  getPresentationInfo?: Maybe<PresentationInfo>;
  searchPresentations?: Maybe<Array<Presentation>>;
  user?: Maybe<User>;
};


export type QueryFindUserPresentationsArgs = {
  preview: Scalars['Boolean']['input'];
  sortBy: Scalars['String']['input'];
};


export type QueryGetPresentationArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetPresentationInfoArgs = {
  id: Scalars['String']['input'];
};


export type QuerySearchPresentationsArgs = {
  name: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Shape = Element & {
  __typename?: 'Shape';
  angle: Scalars['Int']['output'];
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
  type: Scalars['String']['output'];
  width: Scalars['Float']['output'];
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

export type ShapeInput = {
  angle: Scalars['Int']['input'];
  fillColor: Scalars['String']['input'];
  height: Scalars['Float']['input'];
  id: Scalars['ID']['input'];
  position: Scalars['Int']['input'];
  proportional: Scalars['Boolean']['input'];
  scaleX: Scalars['Float']['input'];
  scaleY: Scalars['Float']['input'];
  strokeColor: Scalars['String']['input'];
  strokeWidth: Scalars['Int']['input'];
  type: Scalars['String']['input'];
  width: Scalars['Float']['input'];
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
};

export type Slide = {
  __typename?: 'Slide';
  bg: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  elements: Array<Element>;
  id: Scalars['ID']['output'];
  position: Scalars['Int']['output'];
  presentation: Presentation;
  thumbnailUrl: Scalars['String']['output'];
  transition: Scalars['String']['output'];
};

export type SlideInput = {
  bg: Scalars['String']['input'];
  elements: ElementInput;
  id: Scalars['ID']['input'];
  thumbnailUrl: Scalars['String']['input'];
  transition: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  presentationUpdated: PresentationState;
};

export type Text = Element & {
  __typename?: 'Text';
  alignment: Scalars['String']['output'];
  angle: Scalars['Int']['output'];
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

export type TextInput = {
  alignment: Scalars['String']['input'];
  angle: Scalars['Int']['input'];
  bold: Scalars['Boolean']['input'];
  borderColor: Scalars['String']['input'];
  fillColor: Scalars['String']['input'];
  fontFamily: Scalars['String']['input'];
  fontSize: Scalars['Int']['input'];
  height: Scalars['Float']['input'];
  id: Scalars['ID']['input'];
  italic: Scalars['Boolean']['input'];
  lineHeight: Scalars['Float']['input'];
  position: Scalars['Int']['input'];
  scaleX: Scalars['Float']['input'];
  scaleY: Scalars['Float']['input'];
  text: Scalars['String']['input'];
  textColor: Scalars['String']['input'];
  underlined: Scalars['Boolean']['input'];
  width: Scalars['Float']['input'];
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  presentations: Array<Presentation>;
  profilePicUrl: Scalars['String']['output'];
  records: Array<HistoryRecord>;
};

export type UserInput = {
  email: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  profilePicUrl: Scalars['String']['input'];
};

export type SlideFieldsFragment = { __typename?: 'Slide', id: string, bg: string, transition: string, thumbnailUrl: string, elements: Array<{ __typename?: 'Image', imageUrl: string, id: string, x: number, y: number, width: number, height: number, angle: number, scaleX: number, scaleY: number } | { __typename?: 'Shape', type: string, fillColor: string, strokeColor: string, strokeWidth: number, proportional: boolean, id: string, x: number, y: number, width: number, height: number, angle: number, scaleX: number, scaleY: number } | { __typename?: 'Text', text: string, textColor: string, fillColor: string, borderColor: string, fontFamily: string, fontSize: number, bold: boolean, italic: boolean, underlined: boolean, alignment: string, lineHeight: number, id: string, x: number, y: number, width: number, height: number, angle: number, scaleX: number, scaleY: number }> };

export type FindUserPresentationsQueryVariables = Exact<{
  preview: Scalars['Boolean']['input'];
  sortBy: Scalars['String']['input'];
}>;


export type FindUserPresentationsQuery = { __typename?: 'Query', findUserPresentations?: Array<{ __typename?: 'Presentation', id: string, name: string, users: Array<{ __typename?: 'User', id: string }>, slides: Array<{ __typename?: 'Slide', thumbnailUrl: string }>, history: { __typename?: 'History', records: Array<{ __typename?: 'HistoryRecord', lastOpened: any, user: { __typename?: 'User', id: string } }> } }> | null };

export type GetPresentationInfoQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetPresentationInfoQuery = { __typename?: 'Query', getPresentationInfo?: { __typename?: 'PresentationInfo', totalImageElements: number, totalShapeElements: number, totalSlides: number, totalTextElements: number, totalUsers: number } | null };

export type GetPresentationQueryVariables = Exact<{
  presentationId: Scalars['String']['input'];
}>;


export type GetPresentationQuery = { __typename?: 'Query', getPresentation?: { __typename?: 'Presentation', id: string, name: string, slides: Array<{ __typename?: 'Slide', id: string, bg: string, transition: string, thumbnailUrl: string, elements: Array<{ __typename?: 'Image', imageUrl: string, id: string, x: number, y: number, width: number, height: number, angle: number, scaleX: number, scaleY: number } | { __typename?: 'Shape', type: string, fillColor: string, strokeColor: string, strokeWidth: number, proportional: boolean, id: string, x: number, y: number, width: number, height: number, angle: number, scaleX: number, scaleY: number } | { __typename?: 'Text', text: string, textColor: string, fillColor: string, borderColor: string, fontFamily: string, fontSize: number, bold: boolean, italic: boolean, underlined: boolean, alignment: string, lineHeight: number, id: string, x: number, y: number, width: number, height: number, angle: number, scaleX: number, scaleY: number }> }>, users: Array<{ __typename?: 'User', id: string, email: string, name: string, profilePicUrl: string }> } | null };

export type SaveSlidesMutationVariables = Exact<{
  presentationId: Scalars['String']['input'];
  slides: Array<SlideInput> | SlideInput;
}>;


export type SaveSlidesMutation = { __typename?: 'Mutation', saveSlides?: Array<{ __typename?: 'Slide', id: string, bg: string, transition: string, thumbnailUrl: string, elements: Array<{ __typename?: 'Image', imageUrl: string, id: string, x: number, y: number, width: number, height: number, angle: number, scaleX: number, scaleY: number } | { __typename?: 'Shape', type: string, fillColor: string, strokeColor: string, strokeWidth: number, proportional: boolean, id: string, x: number, y: number, width: number, height: number, angle: number, scaleX: number, scaleY: number } | { __typename?: 'Text', text: string, textColor: string, fillColor: string, borderColor: string, fontFamily: string, fontSize: number, bold: boolean, italic: boolean, underlined: boolean, alignment: string, lineHeight: number, id: string, x: number, y: number, width: number, height: number, angle: number, scaleX: number, scaleY: number }> } | null> | null };

export type SynchronizePresentationStateMutationVariables = Exact<{
  state: PresentationStateInput;
}>;


export type SynchronizePresentationStateMutation = { __typename?: 'Mutation', synchronizePresentationState?: { __typename: 'PresentationState' } | null };

export type PresentationUpdatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type PresentationUpdatedSubscription = { __typename?: 'Subscription', presentationUpdated: { __typename?: 'PresentationState', isSaving: boolean, name: string, slides: Array<{ __typename?: 'Slide', id: string, bg: string, transition: string, thumbnailUrl: string, elements: Array<{ __typename?: 'Image', imageUrl: string, id: string, x: number, y: number, width: number, height: number, angle: number, scaleX: number, scaleY: number } | { __typename?: 'Shape', type: string, fillColor: string, strokeColor: string, strokeWidth: number, proportional: boolean, id: string, x: number, y: number, width: number, height: number, angle: number, scaleX: number, scaleY: number } | { __typename?: 'Text', text: string, textColor: string, fillColor: string, borderColor: string, fontFamily: string, fontSize: number, bold: boolean, italic: boolean, underlined: boolean, alignment: string, lineHeight: number, id: string, x: number, y: number, width: number, height: number, angle: number, scaleX: number, scaleY: number }> }>, users: Array<{ __typename?: 'User', id: string, email: string, name: string, profilePicUrl: string }> } };

export type AddRecordMutationVariables = Exact<{
  presentationId: Scalars['String']['input'];
}>;


export type AddRecordMutation = { __typename?: 'Mutation', addRecord?: { __typename?: 'HistoryRecord', id: number } | null };

export type CreatePresentationMutationVariables = Exact<{
  name: Scalars['String']['input'];
  template: Scalars['String']['input'];
}>;


export type CreatePresentationMutation = { __typename?: 'Mutation', createPresentation?: { __typename?: 'Presentation', id: string } | null };

export type DeletePresentationMutationVariables = Exact<{
  presentationId: Scalars['ID']['input'];
}>;


export type DeletePresentationMutation = { __typename?: 'Mutation', deletePresentation?: boolean | null };

export type DuplicatePresentationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DuplicatePresentationMutation = { __typename?: 'Mutation', duplicatePresentation?: { __typename?: 'Presentation', id: string } | null };

export type SendHelpRequestMutationVariables = Exact<{
  text: Scalars['String']['input'];
}>;


export type SendHelpRequestMutation = { __typename?: 'Mutation', sendHelpRequest?: boolean | null };

export type RenamePresentationMutationVariables = Exact<{
  presentationId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
}>;


export type RenamePresentationMutation = { __typename?: 'Mutation', renamePresentation?: { __typename?: 'Presentation', id: string } | null };

export type SearchPresentationsQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type SearchPresentationsQuery = { __typename?: 'Query', searchPresentations?: Array<{ __typename?: 'Presentation', id: string, name: string, history: { __typename?: 'History', records: Array<{ __typename?: 'HistoryRecord', lastOpened: any, user: { __typename?: 'User', id: string } }> } }> | null };

export type InviteMutationVariables = Exact<{
  email: Scalars['String']['input'];
  presentationId: Scalars['String']['input'];
}>;


export type InviteMutation = { __typename?: 'Mutation', invite?: boolean | null };

export const SlideFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SlideFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Slide"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bg"}},{"kind":"Field","name":{"kind":"Name","value":"transition"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"elements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"angle"}},{"kind":"Field","name":{"kind":"Name","value":"scaleX"}},{"kind":"Field","name":{"kind":"Name","value":"scaleY"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Text"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"textColor"}},{"kind":"Field","name":{"kind":"Name","value":"fillColor"}},{"kind":"Field","name":{"kind":"Name","value":"borderColor"}},{"kind":"Field","name":{"kind":"Name","value":"fontFamily"}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"bold"}},{"kind":"Field","name":{"kind":"Name","value":"italic"}},{"kind":"Field","name":{"kind":"Name","value":"underlined"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"lineHeight"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Shape"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fillColor"}},{"kind":"Field","name":{"kind":"Name","value":"strokeColor"}},{"kind":"Field","name":{"kind":"Name","value":"strokeWidth"}},{"kind":"Field","name":{"kind":"Name","value":"proportional"}}]}}]}}]}}]} as unknown as DocumentNode<SlideFieldsFragment, unknown>;
export const FindUserPresentationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindUserPresentations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"preview"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findUserPresentations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"preview"},"value":{"kind":"Variable","name":{"kind":"Name","value":"preview"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slides"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastOpened"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindUserPresentationsQuery, FindUserPresentationsQueryVariables>;
export const GetPresentationInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPresentationInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPresentationInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalImageElements"}},{"kind":"Field","name":{"kind":"Name","value":"totalShapeElements"}},{"kind":"Field","name":{"kind":"Name","value":"totalSlides"}},{"kind":"Field","name":{"kind":"Name","value":"totalTextElements"}},{"kind":"Field","name":{"kind":"Name","value":"totalUsers"}}]}}]}}]} as unknown as DocumentNode<GetPresentationInfoQuery, GetPresentationInfoQueryVariables>;
export const GetPresentationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPresentation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPresentation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slides"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SlideFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicUrl"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SlideFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Slide"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bg"}},{"kind":"Field","name":{"kind":"Name","value":"transition"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"elements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"angle"}},{"kind":"Field","name":{"kind":"Name","value":"scaleX"}},{"kind":"Field","name":{"kind":"Name","value":"scaleY"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Text"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"textColor"}},{"kind":"Field","name":{"kind":"Name","value":"fillColor"}},{"kind":"Field","name":{"kind":"Name","value":"borderColor"}},{"kind":"Field","name":{"kind":"Name","value":"fontFamily"}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"bold"}},{"kind":"Field","name":{"kind":"Name","value":"italic"}},{"kind":"Field","name":{"kind":"Name","value":"underlined"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"lineHeight"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Shape"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fillColor"}},{"kind":"Field","name":{"kind":"Name","value":"strokeColor"}},{"kind":"Field","name":{"kind":"Name","value":"strokeWidth"}},{"kind":"Field","name":{"kind":"Name","value":"proportional"}}]}}]}}]}}]} as unknown as DocumentNode<GetPresentationQuery, GetPresentationQueryVariables>;
export const SaveSlidesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveSlides"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slides"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SlideInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveSlides"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"presentationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"slides"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slides"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SlideFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SlideFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Slide"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bg"}},{"kind":"Field","name":{"kind":"Name","value":"transition"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"elements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"angle"}},{"kind":"Field","name":{"kind":"Name","value":"scaleX"}},{"kind":"Field","name":{"kind":"Name","value":"scaleY"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Text"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"textColor"}},{"kind":"Field","name":{"kind":"Name","value":"fillColor"}},{"kind":"Field","name":{"kind":"Name","value":"borderColor"}},{"kind":"Field","name":{"kind":"Name","value":"fontFamily"}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"bold"}},{"kind":"Field","name":{"kind":"Name","value":"italic"}},{"kind":"Field","name":{"kind":"Name","value":"underlined"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"lineHeight"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Shape"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fillColor"}},{"kind":"Field","name":{"kind":"Name","value":"strokeColor"}},{"kind":"Field","name":{"kind":"Name","value":"strokeWidth"}},{"kind":"Field","name":{"kind":"Name","value":"proportional"}}]}}]}}]}}]} as unknown as DocumentNode<SaveSlidesMutation, SaveSlidesMutationVariables>;
export const SynchronizePresentationStateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SynchronizePresentationState"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"state"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PresentationStateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"synchronizePresentationState"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"Variable","name":{"kind":"Name","value":"state"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]} as unknown as DocumentNode<SynchronizePresentationStateMutation, SynchronizePresentationStateMutationVariables>;
export const PresentationUpdatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"PresentationUpdated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"presentationUpdated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSaving"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slides"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SlideFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicUrl"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SlideFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Slide"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bg"}},{"kind":"Field","name":{"kind":"Name","value":"transition"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"elements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"angle"}},{"kind":"Field","name":{"kind":"Name","value":"scaleX"}},{"kind":"Field","name":{"kind":"Name","value":"scaleY"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Text"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"textColor"}},{"kind":"Field","name":{"kind":"Name","value":"fillColor"}},{"kind":"Field","name":{"kind":"Name","value":"borderColor"}},{"kind":"Field","name":{"kind":"Name","value":"fontFamily"}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"bold"}},{"kind":"Field","name":{"kind":"Name","value":"italic"}},{"kind":"Field","name":{"kind":"Name","value":"underlined"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"lineHeight"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Shape"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fillColor"}},{"kind":"Field","name":{"kind":"Name","value":"strokeColor"}},{"kind":"Field","name":{"kind":"Name","value":"strokeWidth"}},{"kind":"Field","name":{"kind":"Name","value":"proportional"}}]}}]}}]}}]} as unknown as DocumentNode<PresentationUpdatedSubscription, PresentationUpdatedSubscriptionVariables>;
export const AddRecordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddRecord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addRecord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"presentationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddRecordMutation, AddRecordMutationVariables>;
export const CreatePresentationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePresentation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"template"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPresentation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"template"},"value":{"kind":"Variable","name":{"kind":"Name","value":"template"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreatePresentationMutation, CreatePresentationMutationVariables>;
export const DeletePresentationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePresentation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePresentation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}}}]}]}}]} as unknown as DocumentNode<DeletePresentationMutation, DeletePresentationMutationVariables>;
export const DuplicatePresentationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DuplicatePresentation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duplicatePresentation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DuplicatePresentationMutation, DuplicatePresentationMutationVariables>;
export const SendHelpRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendHelpRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendHelpRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}}]}]}}]} as unknown as DocumentNode<SendHelpRequestMutation, SendHelpRequestMutationVariables>;
export const RenamePresentationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RenamePresentation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renamePresentation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RenamePresentationMutation, RenamePresentationMutationVariables>;
export const SearchPresentationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchPresentations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchPresentations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastOpened"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SearchPresentationsQuery, SearchPresentationsQueryVariables>;
export const InviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Invite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"presentationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}}}]}]}}]} as unknown as DocumentNode<InviteMutation, InviteMutationVariables>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type Element = {
  angle: Scalars['Int']['output'];
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

export type ElementInput = {
  image: Array<ImageInput>;
  shape: Array<ShapeInput>;
  text: Array<TextInput>;
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
  user: User;
};

export type Image = Element & {
  __typename?: 'Image';
  angle: Scalars['Int']['output'];
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

export type ImageInput = {
  angle: Scalars['Int']['input'];
  height: Scalars['Float']['input'];
  id: Scalars['ID']['input'];
  imageUrl: Scalars['String']['input'];
  position: Scalars['Int']['input'];
  scaleX: Scalars['Float']['input'];
  scaleY: Scalars['Float']['input'];
  width: Scalars['Float']['input'];
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addRecord?: Maybe<HistoryRecord>;
  createPresentation?: Maybe<Presentation>;
  deletePresentation?: Maybe<Scalars['Boolean']['output']>;
  duplicatePresentation?: Maybe<Presentation>;
  invite?: Maybe<Scalars['Boolean']['output']>;
  renamePresentation?: Maybe<Presentation>;
  saveSlides?: Maybe<Array<Maybe<Slide>>>;
  sendHelpRequest?: Maybe<Scalars['Boolean']['output']>;
  synchronizePresentationState?: Maybe<PresentationState>;
};


export type MutationAddRecordArgs = {
  presentationId: Scalars['String']['input'];
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
  email: Scalars['String']['input'];
  presentationId: Scalars['String']['input'];
};


export type MutationRenamePresentationArgs = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationSaveSlidesArgs = {
  presentationId: Scalars['String']['input'];
  slides: Array<SlideInput>;
};


export type MutationSendHelpRequestArgs = {
  text: Scalars['String']['input'];
};


export type MutationSynchronizePresentationStateArgs = {
  state: PresentationStateInput;
};

export type Presentation = {
  __typename?: 'Presentation';
  history: History;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  slides: Array<Slide>;
  users: Array<User>;
};

export type PresentationInfo = {
  __typename?: 'PresentationInfo';
  totalImageElements: Scalars['Int']['output'];
  totalShapeElements: Scalars['Int']['output'];
  totalSlides: Scalars['Int']['output'];
  totalTextElements: Scalars['Int']['output'];
  totalUsers: Scalars['Int']['output'];
};

export type PresentationState = {
  __typename?: 'PresentationState';
  _userUpdatedStateId: Scalars['ID']['output'];
  isSaving: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  slides: Array<Slide>;
  users: Array<User>;
};

export type PresentationStateInput = {
  id: Scalars['ID']['input'];
  isSaving: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  slides: Array<SlideInput>;
  users: Array<UserInput>;
};

export type Query = {
  __typename?: 'Query';
  findUserPresentations?: Maybe<Array<Presentation>>;
  getPresentation?: Maybe<Presentation>;
  getPresentationInfo?: Maybe<PresentationInfo>;
  searchPresentations?: Maybe<Array<Presentation>>;
  user?: Maybe<User>;
};


export type QueryFindUserPresentationsArgs = {
  preview: Scalars['Boolean']['input'];
  sortBy: Scalars['String']['input'];
};


export type QueryGetPresentationArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetPresentationInfoArgs = {
  id: Scalars['String']['input'];
};


export type QuerySearchPresentationsArgs = {
  name: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Shape = Element & {
  __typename?: 'Shape';
  angle: Scalars['Int']['output'];
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
  type: Scalars['String']['output'];
  width: Scalars['Float']['output'];
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

export type ShapeInput = {
  angle: Scalars['Int']['input'];
  fillColor: Scalars['String']['input'];
  height: Scalars['Float']['input'];
  id: Scalars['ID']['input'];
  position: Scalars['Int']['input'];
  proportional: Scalars['Boolean']['input'];
  scaleX: Scalars['Float']['input'];
  scaleY: Scalars['Float']['input'];
  strokeColor: Scalars['String']['input'];
  strokeWidth: Scalars['Int']['input'];
  type: Scalars['String']['input'];
  width: Scalars['Float']['input'];
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
};

export type Slide = {
  __typename?: 'Slide';
  bg: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  elements: Array<Element>;
  id: Scalars['ID']['output'];
  position: Scalars['Int']['output'];
  presentation: Presentation;
  thumbnailUrl: Scalars['String']['output'];
  transition: Scalars['String']['output'];
};

export type SlideInput = {
  bg: Scalars['String']['input'];
  elements: ElementInput;
  id: Scalars['ID']['input'];
  thumbnailUrl: Scalars['String']['input'];
  transition: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  presentationUpdated: PresentationState;
};

export type Text = Element & {
  __typename?: 'Text';
  alignment: Scalars['String']['output'];
  angle: Scalars['Int']['output'];
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

export type TextInput = {
  alignment: Scalars['String']['input'];
  angle: Scalars['Int']['input'];
  bold: Scalars['Boolean']['input'];
  borderColor: Scalars['String']['input'];
  fillColor: Scalars['String']['input'];
  fontFamily: Scalars['String']['input'];
  fontSize: Scalars['Int']['input'];
  height: Scalars['Float']['input'];
  id: Scalars['ID']['input'];
  italic: Scalars['Boolean']['input'];
  lineHeight: Scalars['Float']['input'];
  position: Scalars['Int']['input'];
  scaleX: Scalars['Float']['input'];
  scaleY: Scalars['Float']['input'];
  text: Scalars['String']['input'];
  textColor: Scalars['String']['input'];
  underlined: Scalars['Boolean']['input'];
  width: Scalars['Float']['input'];
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  presentations: Array<Presentation>;
  profilePicUrl: Scalars['String']['output'];
  records: Array<HistoryRecord>;
};

export type UserInput = {
  email: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  profilePicUrl: Scalars['String']['input'];
};
