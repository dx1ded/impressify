import { lazy } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache, split } from "@apollo/client"
import { getMainDefinition } from "@apollo/client/utilities"
import { setContext } from "@apollo/client/link/context"
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"
import { ClerkProvider, useUser } from "@clerk/clerk-react"
import { createClient } from "graphql-ws"

import { PrivateRoutes } from "~/app/ui"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL,
})

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: useUser().user?.id,
  },
}))

const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_GRAPHQL_WS_URL,
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

const Main = lazy(() => import("~/pages/main"))
const Home = lazy(() => import("~/pages/home"))
const Presentation = lazy(() => import("~/pages/presentation"))

export function App() {
  const navigate = useNavigate()

  return (
    <ApolloProvider client={client}>
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
    </ApolloProvider>
  )
}
