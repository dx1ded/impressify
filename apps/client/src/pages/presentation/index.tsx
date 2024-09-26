import { useMutation } from "@apollo/client"
import { useUser } from "@clerk/clerk-react"
import type { HocuspocusProvider } from "@hocuspocus/provider"
import type { YPresentation, UserAwareness } from "@server/hocuspocus/types"
import { normalizePresentation } from "@server/hocuspocus/transform"
import { toast } from "sonner"
import type * as Y from "yjs"
import { useCallback } from "react"
import { useParams } from "react-router-dom"
import { shallowEqual } from "react-redux"

import { type AddHistoryRecordMutation, type AddHistoryRecordMutationVariables, Role } from "~/__generated__/graphql"
import { ADD_HISTORY_RECORD } from "~/entities/history-record"
import {
  setIsLoading,
  setIsSaving,
  setCurrentSlide,
  updatePresentation,
  setPresentation,
} from "~/entities/presentation"
import { getInitialAwareness, setConnectedUsers, setIsCreator, setIsEditor } from "~/entities/user"
import { Slide } from "~/pages/presentation/ui/Slide"
import { SlideList } from "~/pages/presentation/ui/SlideList"
import { Header } from "~/pages/presentation/ui/Header"
import { Toaster } from "~/shared/ui-kit/sonner"
import { Toolbar } from "~/widgets/toolbar"
import {
  DebouncedProvider,
  YjsProvider,
  AWARENESS_VALUE_FIELD,
  useAppSelector,
  useAppDispatch,
  switchCurrentSlide,
} from "~/shared/model"
import { TooltipProvider } from "~/shared/ui-kit/tooltip"

export default function PresentationPage() {
  return (
    <DebouncedProvider>
      <Presentation />
    </DebouncedProvider>
  )
}

function Presentation() {
  const { id } = useParams<{ id: string }>()
  const { user } = useUser()
  const slides = useAppSelector((state) => state.presentation.presentation.slides)
  const { currentSlide, userToken, isEditor } = useAppSelector(
    (state) => ({
      currentSlide: state.presentation.currentSlide,
      userToken: state.user.token,
      isEditor: state.user.isEditor,
    }),
    shallowEqual,
  )
  const dispatch = useAppDispatch()

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
      // Setting `currentSlide` and updating awareness
      const localState = provider.awareness?.getLocalState()
      if (localState && Object.keys(localState).length) {
        let newIndex = -1
        const connectedUser = localState[AWARENESS_VALUE_FIELD] as UserAwareness
        const savedCurrentSlideIndex = normalizedPresentation.slides.findIndex(
          (_slide) => _slide.id === connectedUser.currentSlideId,
        )
        // When slide got deleted
        if (!normalizedPresentation.slides.some((_slide) => _slide.id === connectedUser.currentSlideId)) {
          // We assume `deletedSlideIndex` is never `-1`
          const deletedSlideIndex = slides.findIndex((_slide) => _slide.id === connectedUser.currentSlideId)
          // We set the new `currentSlide` as previous one
          newIndex = deletedSlideIndex - 1
          // Using `switchCurrentSlide` so props (isCreating / selectedId, ...) reset
          dispatch(switchCurrentSlide(newIndex))
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
    [dispatch, slides, user?.id, currentSlide, isEditor],
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
      onAwarenessChange={awarenessChangeHandler}
      onAuthenticated={addHistoryRecord}
      setInitialAwareness={setInitialAwareness}>
      <TooltipProvider>
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
        <Toaster />
      </TooltipProvider>
    </YjsProvider>
  )
}
