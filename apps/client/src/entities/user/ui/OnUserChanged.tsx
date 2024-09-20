import { useAuth } from "@clerk/clerk-react"
import { type ReactNode, useEffect } from "react"

import { setUser } from "~/entities/user"
import { useAppDispatch } from "~/shared/model"

export function OnUserChanged({ children }: { children: ReactNode }) {
  const { getToken, userId, isLoaded } = useAuth()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isLoaded) return
    getToken().then((token) => {
      if (userId && token) {
        dispatch(
          setUser({
            id: userId,
            token: `Bearer ${token}`,
          }),
        )
      }
    })
  }, [userId, isLoaded, dispatch, getToken])

  return children
}
