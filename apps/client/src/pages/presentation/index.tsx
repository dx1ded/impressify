import { useMutation, useSubscription } from "@apollo/client"
import { useUser } from "@clerk/clerk-react"
import type { HocuspocusProvider } from "@hocuspocus/provider"
import { normalizePresentation } from "@server/hocuspocus/transform"
import type { UserAwareness, YPresentation } from "@server/hocuspocus/types"
import { useCallback, useEffect } from "react"
import { shallowEqual } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import type * as Y from "yjs"

import {
  type AddHistoryRecordMutation,
  type AddHistoryRecordMutationVariables,
  type PresentationListUpdatedSubscription,
  type PresentationListUpdatedSubscriptionVariables,
  PresentationUpdateType,
  Role,
} from "~/__generated__/graphql"
import { ADD_HISTORY_RECORD } from "~/entities/history-record"
import {
  PRESENTATION_LIST_UPDATED,
  setCurrentSlide,
  setIsLoading,
  setIsSaving,
  setName,
  setPresentation,
  updatePresentation,
} from "~/entities/presentation"
import { setConnectedUsers, setIsCreator, setIsEditor } from "~/entities/presentation-user"
import { getInitialAwareness } from "~/entities/user"
import { HotkeysProvider } from "~/pages/presentation/model"
import { Header } from "~/pages/presentation/ui/Header"
import { Slide } from "~/pages/presentation/ui/Slide"
import { SlideList } from "~/pages/presentation/ui/SlideList"
import {
  AWARENESS_VALUE_FIELD,
  clear,
  DebouncedProvider,
  switchCurrentSlide,
  useAppDispatch,
  useAppSelector,
  withTransition,
  YjsProvider,
} from "~/shared/model"
import { Toaster } from "~/shared/ui-kit/sonner"
import { TooltipProvider } from "~/shared/ui-kit/tooltip"
import { Toolbar } from "~/widgets/toolbar"

export default withTransition(function PresentationPage() {
  return (
    <DebouncedProvider>
      <Presentation />
    </DebouncedProvider>
  )
})

function Presentation() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const { user } = useUser()
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const { currentSlide, presentationName, userToken, isEditor } = useAppSelector(
    (state) => ({
      currentSlide: state.presentation.currentSlide,
      presentationName: state.presentation.presentation.name,
      userToken: state.user.token,
      isEditor: state.presentationUser.isEditor,
    }),
    shallowEqual,
  )
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // Clearing store when leaving the page
  useEffect(
    () => () => {
      dispatch(clear())
    },
    [dispatch, location.pathname],
  )

  // Using presentation subscription for changes that are done outside the yjs document (for example creator deleted presentation in /home page)
  useSubscription<PresentationListUpdatedSubscription, PresentationListUpdatedSubscriptionVariables>(
    PRESENTATION_LIST_UPDATED,
    {
      onData(options) {
        const operation = options.data.data?.presentationListUpdated
        if (!operation || operation.presentation.id !== id) return
        if (operation.type === PresentationUpdateType.Changed && presentationName !== operation.presentation.name) {
          dispatch(setName(operation.presentation.name))
        } else if (operation.type === PresentationUpdateType.Deleted) {
          navigate("/home")
        }
      },
    },
  )

  // Add new history record (or modify it if present)
  const [addHistoryRecord] = useMutation<AddHistoryRecordMutation, AddHistoryRecordMutationVariables>(
    ADD_HISTORY_RECORD,
    {
      variables: { presentationId: id! },
    },
  )

  const updateHandler = useCallback(
    (provider: HocuspocusProvider) => {
      const yPresentation = provider.document.getMap() as YPresentation
      if (!yPresentation) return
      const id = yPresentation.get("id")
      // Checking only for `id` because if this one doesn't exist then the other props neither do
      if (!id) return
      const normalizedPresentation = normalizePresentation(yPresentation)
      // If user is not in the `users` array (either presentation got deleted or they got kicked) they get navigated to home page
      if (!normalizedPresentation.users.some((_user) => _user.id === user?.id)) return navigate("/home")
      // Setting `currentSlide` and updating awareness
      const localState = provider.awareness?.getLocalState()
      if (localState && Object.keys(localState).length) {
        let newIndex = -1
        const connectedUser = localState[AWARENESS_VALUE_FIELD] as UserAwareness
        const savedCurrentSlideIndex = normalizedPresentation.slides.findIndex(
          (_slide) => _slide.id === connectedUser.currentSlideId,
        )
        // When slide got deleted
        if (savedCurrentSlideIndex === -1) {
          const deletedSlideIndex = slides.findIndex((_slide) => _slide.id === connectedUser.currentSlideId)
          // If `deletedSlideIndex` was `0` or `-1` (in case user deleted a bunch of slides really fast and debounced function didn't get it) we don't do anything
          if (deletedSlideIndex > 0) {
            // We set the new `currentSlide` as previous one
            newIndex = deletedSlideIndex - 1
            // Using `switchCurrentSlide` so props (isCreating / selectedId, ...) reset
            dispatch(switchCurrentSlide(newIndex))
          } else {
            // If slide got deleted AND `deletedSlideIndex` is `0` we only set `newIndex` so awareness gets updated (no need to switch local slide because it's already in `0`)
            newIndex = 0
          }
        }
        // When slide got moved
        else if (savedCurrentSlideIndex !== currentSlide) {
          // A new index of the current slide
          newIndex = savedCurrentSlideIndex
          // Using `setCurrentSlide` so no props (isCreating / selectedId, ...) change
          dispatch(setCurrentSlide(newIndex))
        }

        if (newIndex !== -1) {
          provider.awareness?.setLocalStateField(AWARENESS_VALUE_FIELD, {
            ...connectedUser,
            currentSlideId: normalizedPresentation.slides[newIndex].id,
          })
        }
      }
      // Updating store
      const isInitialLoad = !slides.length
      // If it's an initial load we use `setPresentation` otherwise if it's an update we use `updatePresentation` which runs deep comparison
      const presentationAction = isInitialLoad ? setPresentation : updatePresentation

      dispatch(presentationAction(normalizedPresentation))
      dispatch(setIsLoading(false))
      dispatch(setIsSaving(yPresentation.get("isSaving") || false))

      // Updating user permission (isCreator / isEditor)
      if (normalizedPresentation.users.find((_user) => _user.role === Role.Creator)?.id === user?.id) {
        dispatch(setIsCreator(true))
      }
      const updatedIsEditor = normalizedPresentation.users.some(
        (_user) => _user.id === user?.id && (_user.role === Role.Editor || _user.role === Role.Creator),
      )
      if (updatedIsEditor !== isEditor) {
        dispatch(setIsEditor(updatedIsEditor))
        // Creating an alert that tells user they have a new role (if so)
        if (!isInitialLoad) toast(`You're now ${updatedIsEditor ? "an editor" : "a reader"}`)
      }
    },
    [dispatch, navigate, slides, user?.id, currentSlide, isEditor],
  )

  const awarenessChangeHandler = useCallback(
    (users: UserAwareness[]) => {
      dispatch(setConnectedUsers(users))
    },
    [dispatch],
  )

  const setInitialAwareness = useCallback(
    (document: Y.Doc) => {
      const yPresentation = document.getMap() as YPresentation
      if (!user) throw new Error("User is not initialized to set initial awareness")
      return getInitialAwareness({
        id: user.id,
        name: user.fullName,
        profilePicUrl: user.imageUrl,
        currentSlideId: yPresentation.get("slides")?.get(0).get("id")!,
      })
    },
    [user],
  )

  if (!id || !userToken || !user?.id) return

  return (
    <YjsProvider
      url={import.meta.env.VITE_HOCUSPOCUS_URL}
      name={`presentation/${id}`}
      token={userToken}
      onUpdate={updateHandler}
      onClose={() => navigate("/not-found")}
      onAwarenessChange={awarenessChangeHandler}
      onAuthenticated={addHistoryRecord}
      setInitialAwareness={setInitialAwareness}>
      <TooltipProvider>
        <HotkeysProvider>
          <div className="flex h-screen flex-col bg-[#f8fafd] px-4">
            <div>
              <Header />
              <Toolbar />
            </div>
            <div className="flex min-h-[56rem] flex-1 gap-4">
              <SlideList />
              <Slide />
            </div>
          </div>
        </HotkeysProvider>
        <Toaster />
      </TooltipProvider>
    </YjsProvider>
  )
}
