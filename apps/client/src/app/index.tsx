import { lazy } from "react"
import { Provider } from "react-redux"
import { Route, Routes, useNavigate } from "react-router-dom"
import { initializeApp } from "firebase/app"
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { ClerkProvider } from "@clerk/clerk-react"
import { Clerk } from "@clerk/clerk-js/headless"

import { store } from "~/app/model"
import { PrivateRoutes } from "~/app/ui"
import { OnUserChanged } from "~/entities/user"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const clerkInstance = new Clerk(PUBLISHABLE_KEY)
clerkInstance.load()

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL,
})

const authLink = setContext(async (_, { headers }) => {
  const clerkToken = await clerkInstance?.session?.getToken()

  return {
    headers: {
      ...headers,
      authorization: clerkToken ? `Bearer ${clerkToken}` : "UNAUTHORIZED",
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

initializeApp({
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
  measurementId: import.meta.env.VITE_FB_MEASUREMENT_ID,
})

const Main = lazy(() => import("~/pages/main"))
const Home = lazy(() => import("~/pages/home"))
const Presentation = lazy(() => import("~/pages/presentation"))

export function App() {
  const navigate = useNavigate()

  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <ClerkProvider
          publishableKey={PUBLISHABLE_KEY}
          routerPush={(to) => navigate(to)}
          routerReplace={(to) => navigate(to, { replace: true })}
          signInForceRedirectUrl="/home"
          signUpForceRedirectUrl="/home"
          afterSignOutUrl="/">
          <OnUserChanged>
            <Routes>
              <Route index element={<Main />} />
              <Route element={<PrivateRoutes />}>
                <Route path="/home" element={<Home />} />
                <Route path="/presentation/:id" element={<Presentation />} />
              </Route>
            </Routes>
          </OnUserChanged>
        </ClerkProvider>
      </Provider>
    </ApolloProvider>
  )
}
