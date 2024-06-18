import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react"
import { Outlet } from "react-router-dom"

export function PrivateRoutes() {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <Outlet />
      </SignedIn>
    </>
  )
}
