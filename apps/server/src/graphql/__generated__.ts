import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;


/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  Element: ( Image ) | ( Shape ) | ( Text );
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Alignment: Alignment;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  Element: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Element']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  History: ResolverTypeWrapper<History>;
  HistoryRecord: ResolverTypeWrapper<HistoryRecord>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Image: ResolverTypeWrapper<Image>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Presentation: ResolverTypeWrapper<Presentation>;
  PresentationInfo: ResolverTypeWrapper<PresentationInfo>;
  PresentationUpdate: ResolverTypeWrapper<PresentationUpdate>;
  PresentationUpdateType: PresentationUpdateType;
  PresentationUser: ResolverTypeWrapper<PresentationUser>;
  Query: ResolverTypeWrapper<{}>;
  Result: Result;
  Role: Role;
  Shape: ResolverTypeWrapper<Shape>;
  ShapeType: ShapeType;
  Slide: ResolverTypeWrapper<Omit<Slide, 'elements'> & { elements: Array<ResolversTypes['Element']> }>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  Text: ResolverTypeWrapper<Text>;
  Transition: Transition;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  Date: Scalars['Date']['output'];
  Element: ResolversInterfaceTypes<ResolversParentTypes>['Element'];
  Float: Scalars['Float']['output'];
  History: History;
  HistoryRecord: HistoryRecord;
  ID: Scalars['ID']['output'];
  Image: Image;
  Int: Scalars['Int']['output'];
  Mutation: {};
  Presentation: Presentation;
  PresentationInfo: PresentationInfo;
  PresentationUpdate: PresentationUpdate;
  PresentationUser: PresentationUser;
  Query: {};
  Shape: Shape;
  Slide: Omit<Slide, 'elements'> & { elements: Array<ResolversParentTypes['Element']> };
  String: Scalars['String']['output'];
  Subscription: {};
  Text: Text;
  User: User;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type ElementResolvers<ContextType = any, ParentType extends ResolversParentTypes['Element'] = ResolversParentTypes['Element']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Image' | 'Shape' | 'Text', ParentType, ContextType>;
  angle?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  scaleX?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  scaleY?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  slide?: Resolver<ResolversTypes['Slide'], ParentType, ContextType>;
  width?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  x?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  y?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export type HistoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['History'] = ResolversParentTypes['History']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  presentation?: Resolver<ResolversTypes['Presentation'], ParentType, ContextType>;
  records?: Resolver<Array<ResolversTypes['HistoryRecord']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HistoryRecordResolvers<ContextType = any, ParentType extends ResolversParentTypes['HistoryRecord'] = ResolversParentTypes['HistoryRecord']> = ResolversObject<{
  history?: Resolver<ResolversTypes['History'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastOpened?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['PresentationUser'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = ResolversObject<{
  angle?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  scaleX?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  scaleY?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  slide?: Resolver<ResolversTypes['Slide'], ParentType, ContextType>;
  width?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  x?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  y?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addRecord?: Resolver<Maybe<ResolversTypes['HistoryRecord']>, ParentType, ContextType, RequireFields<MutationAddRecordArgs, 'presentationId'>>;
  changeUserRole?: Resolver<Maybe<ResolversTypes['Result']>, ParentType, ContextType, RequireFields<MutationChangeUserRoleArgs, 'presentationId' | 'role' | 'userId'>>;
  createPresentation?: Resolver<Maybe<ResolversTypes['Presentation']>, ParentType, ContextType, RequireFields<MutationCreatePresentationArgs, 'name' | 'template'>>;
  deletePresentation?: Resolver<Maybe<ResolversTypes['Result']>, ParentType, ContextType, RequireFields<MutationDeletePresentationArgs, 'id'>>;
  duplicatePresentation?: Resolver<Maybe<ResolversTypes['Presentation']>, ParentType, ContextType, RequireFields<MutationDuplicatePresentationArgs, 'id'>>;
  invite?: Resolver<Maybe<ResolversTypes['Result']>, ParentType, ContextType, RequireFields<MutationInviteArgs, 'presentationId' | 'role' | 'userId'>>;
  kick?: Resolver<Maybe<ResolversTypes['Result']>, ParentType, ContextType, RequireFields<MutationKickArgs, 'presentationId' | 'userId'>>;
  renamePresentation?: Resolver<Maybe<ResolversTypes['Presentation']>, ParentType, ContextType, RequireFields<MutationRenamePresentationArgs, 'id' | 'name'>>;
  sendHelpRequest?: Resolver<Maybe<ResolversTypes['Result']>, ParentType, ContextType, RequireFields<MutationSendHelpRequestArgs, 'text'>>;
}>;

export type PresentationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Presentation'] = ResolversParentTypes['Presentation']> = ResolversObject<{
  history?: Resolver<ResolversTypes['History'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slides?: Resolver<Array<ResolversTypes['Slide']>, ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['PresentationUser']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PresentationInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PresentationInfo'] = ResolversParentTypes['PresentationInfo']> = ResolversObject<{
  totalImageElements?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalShapeElements?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalSlides?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalTextElements?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalUsers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PresentationUpdateResolvers<ContextType = any, ParentType extends ResolversParentTypes['PresentationUpdate'] = ResolversParentTypes['PresentationUpdate']> = ResolversObject<{
  presentation?: Resolver<ResolversTypes['Presentation'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['PresentationUpdateType'], ParentType, ContextType>;
  userIds?: Resolver<Maybe<Array<ResolversTypes['ID']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PresentationUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['PresentationUser'] = ResolversParentTypes['PresentationUser']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  presentation?: Resolver<ResolversTypes['Presentation'], ParentType, ContextType>;
  props?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  record?: Resolver<Maybe<ResolversTypes['HistoryRecord']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  findUserPresentations?: Resolver<Maybe<Array<ResolversTypes['Presentation']>>, ParentType, ContextType, RequireFields<QueryFindUserPresentationsArgs, 'preview' | 'sortBy'>>;
  findUsers?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType, RequireFields<QueryFindUsersArgs, 'query'>>;
  getPresentation?: Resolver<Maybe<ResolversTypes['Presentation']>, ParentType, ContextType, RequireFields<QueryGetPresentationArgs, 'id'>>;
  getPresentationInfo?: Resolver<Maybe<ResolversTypes['PresentationInfo']>, ParentType, ContextType, RequireFields<QueryGetPresentationInfoArgs, 'id'>>;
  searchPresentations?: Resolver<Maybe<Array<ResolversTypes['Presentation']>>, ParentType, ContextType, RequireFields<QuerySearchPresentationsArgs, 'name'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
}>;

export type ShapeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Shape'] = ResolversParentTypes['Shape']> = ResolversObject<{
  angle?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  fillColor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  proportional?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  scaleX?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  scaleY?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  slide?: Resolver<ResolversTypes['Slide'], ParentType, ContextType>;
  strokeColor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  strokeWidth?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ShapeType'], ParentType, ContextType>;
  width?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  x?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  y?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SlideResolvers<ContextType = any, ParentType extends ResolversParentTypes['Slide'] = ResolversParentTypes['Slide']> = ResolversObject<{
  bg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  elements?: Resolver<Array<ResolversTypes['Element']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  presentation?: Resolver<ResolversTypes['Presentation'], ParentType, ContextType>;
  thumbnailUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transition?: Resolver<ResolversTypes['Transition'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  presentationListUpdated?: SubscriptionResolver<ResolversTypes['PresentationUpdate'], "presentationListUpdated", ParentType, ContextType>;
}>;

export type TextResolvers<ContextType = any, ParentType extends ResolversParentTypes['Text'] = ResolversParentTypes['Text']> = ResolversObject<{
  alignment?: Resolver<ResolversTypes['Alignment'], ParentType, ContextType>;
  angle?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  bold?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  borderColor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fillColor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fontFamily?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fontSize?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  italic?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lineHeight?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  scaleX?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  scaleY?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  slide?: Resolver<ResolversTypes['Slide'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  textColor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  underlined?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  width?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  x?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  y?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profilePicUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Date?: GraphQLScalarType;
  Element?: ElementResolvers<ContextType>;
  History?: HistoryResolvers<ContextType>;
  HistoryRecord?: HistoryRecordResolvers<ContextType>;
  Image?: ImageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Presentation?: PresentationResolvers<ContextType>;
  PresentationInfo?: PresentationInfoResolvers<ContextType>;
  PresentationUpdate?: PresentationUpdateResolvers<ContextType>;
  PresentationUser?: PresentationUserResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Shape?: ShapeResolvers<ContextType>;
  Slide?: SlideResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Text?: TextResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

