import { ClerkProvider } from "@clerk/clerk-react"
import { Route, Routes, useNavigate } from "react-router-dom"

import { PrivateRoutes } from "~/app/ui"
import { Home } from "~/pages/home"
import { Main } from "~/pages/main"
import { Presentation } from "~/pages/presentation"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

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
