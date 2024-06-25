import { useUser } from "@clerk/clerk-react"
import { type ReactNode, useEffect } from "react"

import { setUserId } from "~/entities/user"
import { useAppDispatch } from "~/shared/model"

export function OnUserChanged({ children }: { children: ReactNode }) {
  const { user } = useUser()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (user) {
      dispatch(setUserId(user.id))
    }
  }, [user, dispatch])

  return children
}
