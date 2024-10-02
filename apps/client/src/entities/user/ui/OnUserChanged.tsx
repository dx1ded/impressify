import { useClerk } from "@clerk/clerk-react"
import { type ReactNode, useEffect } from "react"

import { setUser } from "~/entities/user"
import { useAppDispatch } from "~/shared/model"

export function OnUserChanged({ children }: { children: ReactNode }) {
  const clerk = useClerk()
  const dispatch = useAppDispatch()

  useEffect(() => {
    clerk.addListener(async ({ user, session }) => {
      if (user && session) {
        const token = await session.getToken()

        dispatch(
          setUser({
            id: user.id,
            token: token ? `Bearer ${token}` : null,
          }),
        )
      }
    })
  }, [dispatch, clerk])

  return children
}
