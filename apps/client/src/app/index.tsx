import { ClerkProvider } from "@clerk/clerk-react"
import { lazy } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"

import { PrivateRoutes } from "~/app/ui"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const Main = lazy(() => import("~/pages/main"))
const Home = lazy(() => import("~/pages/home"))
const Presentation = lazy(() => import("~/pages/presentation"))

export function App() {
  const navigate = useNavigate()

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      signInForceRedirectUrl="/home"
      signUpForceRedirectUrl="/home"
      afterSignOutUrl="/">
      <Routes>
        <Route index element={<Main />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/home" element={<Home />} />
          <Route path="/presentation/:id" element={<Presentation />} />
        </Route>
      </Routes>
    </ClerkProvider>
  )
}
