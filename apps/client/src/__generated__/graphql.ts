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
  height: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  scaleX: Scalars['Int']['output'];
  scaleY: Scalars['Int']['output'];
  slide: Slide;
  width: Scalars['Int']['output'];
  x: Scalars['Int']['output'];
  y: Scalars['Int']['output'];
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
  height: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  imageUrl: Scalars['String']['output'];
  scaleX: Scalars['Int']['output'];
  scaleY: Scalars['Int']['output'];
  slide: Slide;
  width: Scalars['Int']['output'];
  x: Scalars['Int']['output'];
  y: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addRecord?: Maybe<HistoryRecord>;
  createPresentation?: Maybe<Presentation>;
  deletePresentation?: Maybe<Scalars['Boolean']['output']>;
  renamePresentation?: Maybe<Presentation>;
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


export type MutationRenamePresentationArgs = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Presentation = {
  __typename?: 'Presentation';
  history: History;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  slides: Array<Slide>;
  users: Array<User>;
};

export type Query = {
  __typename?: 'Query';
  findUserPresentations?: Maybe<Array<Presentation>>;
  getPresentation?: Maybe<Presentation>;
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
  height: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  proportional: Scalars['Boolean']['output'];
  scaleX: Scalars['Int']['output'];
  scaleY: Scalars['Int']['output'];
  slide: Slide;
  strokeColor: Scalars['String']['output'];
  strokeWidth: Scalars['Int']['output'];
  type: Scalars['String']['output'];
  width: Scalars['Int']['output'];
  x: Scalars['Int']['output'];
  y: Scalars['Int']['output'];
};

export type Slide = {
  __typename?: 'Slide';
  createdAt: Scalars['Date']['output'];
  elements: Array<Element>;
  id: Scalars['ID']['output'];
  presentation: Presentation;
  thumbnailUrl: Scalars['String']['output'];
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
  height: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  italic: Scalars['Boolean']['output'];
  lineHeight: Scalars['Int']['output'];
  scaleX: Scalars['Int']['output'];
  scaleY: Scalars['Int']['output'];
  slide: Slide;
  text: Scalars['String']['output'];
  textColor: Scalars['String']['output'];
  underlined: Scalars['Boolean']['output'];
  width: Scalars['Int']['output'];
  x: Scalars['Int']['output'];
  y: Scalars['Int']['output'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  presentations: Array<Presentation>;
  profilePicUrl: Scalars['String']['output'];
  records: Array<HistoryRecord>;
};

export type FindUserPresentationsQueryVariables = Exact<{
  preview: Scalars['Boolean']['input'];
  sortBy: Scalars['String']['input'];
}>;


export type FindUserPresentationsQuery = { __typename?: 'Query', findUserPresentations?: Array<{ __typename?: 'Presentation', id: string, name: string, users: Array<{ __typename?: 'User', id: string }>, slides: Array<{ __typename?: 'Slide', thumbnailUrl: string }>, history: { __typename?: 'History', records: Array<{ __typename?: 'HistoryRecord', lastOpened: any, user: { __typename?: 'User', id: string } }> } }> | null };

export type GetPresentationQueryVariables = Exact<{
  presentationId: Scalars['String']['input'];
}>;


export type GetPresentationQuery = { __typename?: 'Query', getPresentation?: { __typename?: 'Presentation', id: string, name: string, slides: Array<{ __typename?: 'Slide', thumbnailUrl: string, id: string, elements: Array<{ __typename?: 'Image', imageUrl: string, id: number, x: number, y: number, width: number, height: number, angle: number, scaleX: number, scaleY: number } | { __typename?: 'Shape', type: string, fillColor: string, strokeColor: string, strokeWidth: number, proportional: boolean, id: number, x: number, y: number, width: number, height: number, angle: number, scaleX: number, scaleY: number } | { __typename?: 'Text', text: string, textColor: string, fillColor: string, borderColor: string, fontFamily: string, fontSize: number, bold: boolean, italic: boolean, underlined: boolean, alignment: string, lineHeight: number, id: number, x: number, y: number, width: number, height: number, angle: number, scaleX: number, scaleY: number }> }> } | null };

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

export type RenamePresentationMutationVariables = Exact<{
  presentationId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
}>;


export type RenamePresentationMutation = { __typename?: 'Mutation', renamePresentation?: { __typename?: 'Presentation', id: string } | null };

export type SearchPresentationsQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type SearchPresentationsQuery = { __typename?: 'Query', searchPresentations?: Array<{ __typename?: 'Presentation', id: string, name: string, history: { __typename?: 'History', records: Array<{ __typename?: 'HistoryRecord', lastOpened: any, user: { __typename?: 'User', id: string } }> } }> | null };


export const FindUserPresentationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindUserPresentations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"preview"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findUserPresentations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"preview"},"value":{"kind":"Variable","name":{"kind":"Name","value":"preview"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slides"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastOpened"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindUserPresentationsQuery, FindUserPresentationsQueryVariables>;
export const GetPresentationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPresentation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPresentation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slides"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"elements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"angle"}},{"kind":"Field","name":{"kind":"Name","value":"scaleX"}},{"kind":"Field","name":{"kind":"Name","value":"scaleY"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Text"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"textColor"}},{"kind":"Field","name":{"kind":"Name","value":"fillColor"}},{"kind":"Field","name":{"kind":"Name","value":"borderColor"}},{"kind":"Field","name":{"kind":"Name","value":"fontFamily"}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"bold"}},{"kind":"Field","name":{"kind":"Name","value":"italic"}},{"kind":"Field","name":{"kind":"Name","value":"underlined"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"lineHeight"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Shape"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fillColor"}},{"kind":"Field","name":{"kind":"Name","value":"strokeColor"}},{"kind":"Field","name":{"kind":"Name","value":"strokeWidth"}},{"kind":"Field","name":{"kind":"Name","value":"proportional"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetPresentationQuery, GetPresentationQueryVariables>;
export const AddRecordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddRecord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addRecord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"presentationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddRecordMutation, AddRecordMutationVariables>;
export const CreatePresentationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePresentation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"template"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPresentation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"template"},"value":{"kind":"Variable","name":{"kind":"Name","value":"template"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreatePresentationMutation, CreatePresentationMutationVariables>;
export const DeletePresentationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePresentation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePresentation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}}}]}]}}]} as unknown as DocumentNode<DeletePresentationMutation, DeletePresentationMutationVariables>;
export const RenamePresentationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RenamePresentation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renamePresentation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"presentationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RenamePresentationMutation, RenamePresentationMutationVariables>;
export const SearchPresentationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchPresentations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchPresentations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastOpened"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SearchPresentationsQuery, SearchPresentationsQueryVariables>;
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
  height: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  scaleX: Scalars['Int']['output'];
  scaleY: Scalars['Int']['output'];
  slide: Slide;
  width: Scalars['Int']['output'];
  x: Scalars['Int']['output'];
  y: Scalars['Int']['output'];
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
  height: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  imageUrl: Scalars['String']['output'];
  scaleX: Scalars['Int']['output'];
  scaleY: Scalars['Int']['output'];
  slide: Slide;
  width: Scalars['Int']['output'];
  x: Scalars['Int']['output'];
  y: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addRecord?: Maybe<HistoryRecord>;
  createPresentation?: Maybe<Presentation>;
  deletePresentation?: Maybe<Scalars['Boolean']['output']>;
  renamePresentation?: Maybe<Presentation>;
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


export type MutationRenamePresentationArgs = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Presentation = {
  __typename?: 'Presentation';
  history: History;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  slides: Array<Slide>;
  users: Array<User>;
};

export type Query = {
  __typename?: 'Query';
  findUserPresentations?: Maybe<Array<Presentation>>;
  getPresentation?: Maybe<Presentation>;
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
  height: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  proportional: Scalars['Boolean']['output'];
  scaleX: Scalars['Int']['output'];
  scaleY: Scalars['Int']['output'];
  slide: Slide;
  strokeColor: Scalars['String']['output'];
  strokeWidth: Scalars['Int']['output'];
  type: Scalars['String']['output'];
  width: Scalars['Int']['output'];
  x: Scalars['Int']['output'];
  y: Scalars['Int']['output'];
};

export type Slide = {
  __typename?: 'Slide';
  createdAt: Scalars['Date']['output'];
  elements: Array<Element>;
  id: Scalars['ID']['output'];
  presentation: Presentation;
  thumbnailUrl: Scalars['String']['output'];
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
  height: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  italic: Scalars['Boolean']['output'];
  lineHeight: Scalars['Int']['output'];
  scaleX: Scalars['Int']['output'];
  scaleY: Scalars['Int']['output'];
  slide: Slide;
  text: Scalars['String']['output'];
  textColor: Scalars['String']['output'];
  underlined: Scalars['Boolean']['output'];
  width: Scalars['Int']['output'];
  x: Scalars['Int']['output'];
  y: Scalars['Int']['output'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  presentations: Array<Presentation>;
  profilePicUrl: Scalars['String']['output'];
  records: Array<HistoryRecord>;
};
