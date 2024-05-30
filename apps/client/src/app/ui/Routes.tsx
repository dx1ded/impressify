import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react"
import { Outlet, Navigate } from "react-router-dom"

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

export function PublicRoutes() {
  return (
    <>
      <SignedOut>
        <Outlet />
      </SignedOut>
      <SignedIn>
        <Navigate to="/" />
      </SignedIn>
    </>
  )
}
