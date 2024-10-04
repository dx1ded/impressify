import { lazy } from "react"
import { Provider } from "react-redux"
import { Route, Routes, useNavigate } from "react-router-dom"
import { initializeApp } from "firebase/app"
import { AnimatePresence } from "framer-motion"
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache, split } from "@apollo/client"
import { getMainDefinition } from "@apollo/client/utilities"
import { setContext } from "@apollo/client/link/context"
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"
import { ClerkProvider } from "@clerk/clerk-react"
import { Clerk } from "@clerk/clerk-js/headless"
import { createClient } from "graphql-ws"

import { store } from "~/app/model"
import { PrivateRoutes } from "~/app/ui"
import { OnUserChanged } from "~/entities/user"
import { Toaster } from "~/shared/ui-kit/sonner"

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

const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_GRAPHQL_WS_URL,
    connectionParams: async () => {
      const clerkToken = await clerkInstance?.session?.getToken()
      return {
        authorization: clerkToken ? `Bearer ${clerkToken}` : "UNAUTHORIZED",
      }
    },
  }),
)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === "OperationDefinition" && definition.operation === "subscription"
  },
  wsLink,
  authLink.concat(httpLink),
)

const client = new ApolloClient({
  link: splitLink,
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
const NotFound = lazy(() => import("~/pages/not-found"))

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
            <Toaster />
            <AnimatePresence mode="wait">
              <Routes>
                <Route index element={<Main />} />
                <Route path="*" element={<NotFound />} />
                <Route element={<PrivateRoutes />}>
                  <Route path="/home" element={<Home />} />
                  <Route path="/presentation/:id" element={<Presentation />} />
                </Route>
              </Routes>
            </AnimatePresence>
          </OnUserChanged>
        </ClerkProvider>
      </Provider>
    </ApolloProvider>
  )
}
