/* eslint-disable */
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
  id: Scalars['Int']['output'];
  layer: Scalars['Int']['output'];
  slide: Slide;
  x1: Scalars['Int']['output'];
  x2: Scalars['Int']['output'];
  y1: Scalars['Int']['output'];
  y2: Scalars['Int']['output'];
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
  lastOpened: Scalars['Date']['output'];
  user: User;
};

export type Image = Element & {
  __typename?: 'Image';
  angle: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  imageUrl: Scalars['String']['output'];
  layer: Scalars['Int']['output'];
  slide: Slide;
  x1: Scalars['Int']['output'];
  x2: Scalars['Int']['output'];
  y1: Scalars['Int']['output'];
  y2: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPresentation?: Maybe<Presentation>;
  deletePresentation?: Maybe<Scalars['Boolean']['output']>;
  renamePresentation?: Maybe<Presentation>;
};


export type MutationCreatePresentationArgs = {
  name: Scalars['String']['input'];
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
  user?: Maybe<User>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Shape = Element & {
  __typename?: 'Shape';
  angle: Scalars['Int']['output'];
  aspectRatio?: Maybe<Scalars['String']['output']>;
  fillColor: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  layer: Scalars['Int']['output'];
  points: Array<Array<Scalars['Int']['output']>>;
  slide: Slide;
  strokeColor: Scalars['String']['output'];
  strokeWidth: Scalars['Int']['output'];
  x1: Scalars['Int']['output'];
  x2: Scalars['Int']['output'];
  y1: Scalars['Int']['output'];
  y2: Scalars['Int']['output'];
};

export type Slide = {
  __typename?: 'Slide';
  elements: Array<Element>;
  id: Scalars['ID']['output'];
  presentation: Presentation;
};

export type Text = Element & {
  __typename?: 'Text';
  angle: Scalars['Int']['output'];
  bold: Scalars['Boolean']['output'];
  borderColor: Scalars['String']['output'];
  fillColor: Scalars['String']['output'];
  fontFamily: Scalars['String']['output'];
  fontSize: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  italic: Scalars['Boolean']['output'];
  layer: Scalars['Int']['output'];
  lineHeight: Scalars['Int']['output'];
  slide: Slide;
  text: Scalars['String']['output'];
  textColor: Scalars['String']['output'];
  underlined: Scalars['Boolean']['output'];
  x1: Scalars['Int']['output'];
  x2: Scalars['Int']['output'];
  y1: Scalars['Int']['output'];
  y2: Scalars['Int']['output'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  presentations: Array<Presentation>;
  profilePicUrl: Scalars['String']['output'];
};

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
  id: Scalars['Int']['output'];
  layer: Scalars['Int']['output'];
  slide: Slide;
  x1: Scalars['Int']['output'];
  x2: Scalars['Int']['output'];
  y1: Scalars['Int']['output'];
  y2: Scalars['Int']['output'];
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
  lastOpened: Scalars['Date']['output'];
  user: User;
};

export type Image = Element & {
  __typename?: 'Image';
  angle: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  imageUrl: Scalars['String']['output'];
  layer: Scalars['Int']['output'];
  slide: Slide;
  x1: Scalars['Int']['output'];
  x2: Scalars['Int']['output'];
  y1: Scalars['Int']['output'];
  y2: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPresentation?: Maybe<Presentation>;
  deletePresentation?: Maybe<Scalars['Boolean']['output']>;
  renamePresentation?: Maybe<Presentation>;
};


export type MutationCreatePresentationArgs = {
  name: Scalars['String']['input'];
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
  user?: Maybe<User>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Shape = Element & {
  __typename?: 'Shape';
  angle: Scalars['Int']['output'];
  aspectRatio?: Maybe<Scalars['String']['output']>;
  fillColor: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  layer: Scalars['Int']['output'];
  points: Array<Array<Scalars['Int']['output']>>;
  slide: Slide;
  strokeColor: Scalars['String']['output'];
  strokeWidth: Scalars['Int']['output'];
  x1: Scalars['Int']['output'];
  x2: Scalars['Int']['output'];
  y1: Scalars['Int']['output'];
  y2: Scalars['Int']['output'];
};

export type Slide = {
  __typename?: 'Slide';
  elements: Array<Element>;
  id: Scalars['ID']['output'];
  presentation: Presentation;
};

export type Text = Element & {
  __typename?: 'Text';
  angle: Scalars['Int']['output'];
  bold: Scalars['Boolean']['output'];
  borderColor: Scalars['String']['output'];
  fillColor: Scalars['String']['output'];
  fontFamily: Scalars['String']['output'];
  fontSize: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  italic: Scalars['Boolean']['output'];
  layer: Scalars['Int']['output'];
  lineHeight: Scalars['Int']['output'];
  slide: Slide;
  text: Scalars['String']['output'];
  textColor: Scalars['String']['output'];
  underlined: Scalars['Boolean']['output'];
  x1: Scalars['Int']['output'];
  x2: Scalars['Int']['output'];
  y1: Scalars['Int']['output'];
  y2: Scalars['Int']['output'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  presentations: Array<Presentation>;
  profilePicUrl: Scalars['String']['output'];
};
