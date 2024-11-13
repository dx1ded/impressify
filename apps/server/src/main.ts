import "dotenv/config"
import { ApolloServer } from "@apollo/server"
import { cert, initializeApp, type ServiceAccount } from "firebase-admin/app"
import { useServer } from "graphql-ws/lib/use/ws"
import fastifyApollo, { fastifyApolloDrainPlugin } from "@as-integrations/fastify"
import Fastify from "fastify"
import cors from "@fastify/cors"
import ws from "@fastify/websocket"
import { WebSocketServer } from "ws"

import { app } from "./app"
import { type ApolloContext, schema, getContext } from "./graphql"
import firebaseCredentials from "./impressify-26983-firebase-adminsdk-26c7d-c529d5e383"

const host = process.env.HOST ?? "localhost"
const port = process.env.PORT ? Number(process.env.PORT) : 3000
const wssPort = process.env.WSS_PORT ? Number(process.env.WSS_PORT) : 3001
// 8 MiB limit
const FASTIFY_BODY_LIMIT = 1024 * 1024 * 8

;(async function () {
  const fastify = Fastify({
    logger: false,
    bodyLimit: FASTIFY_BODY_LIMIT,
  })

  // Initializing firebase app
  initializeApp({ credential: cert(firebaseCredentials as ServiceAccount) })

  const wsServer = new WebSocketServer({
    port: wssPort,
    path: "/api/graphql/subscriptions",
  })

  const serverCleanup = useServer(
    { schema, context: (ctx) => getContext(ctx.connectionParams?.authorization as string | undefined) },
    wsServer,
  )

  const apollo = new ApolloServer<ApolloContext>({
    schema,
    // Plugin to shutdown the HTTP / Fastify server
    plugins: [
      // Plugin to shutdown the HTTP / Fastify server
      fastifyApolloDrainPlugin(fastify),
      // Plugin to shutdown the WebSocket server
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await apollo.start()

  fastify.register(cors)
  fastify.register(ws)
  fastify.register(fastifyApollo(apollo), {
    path: "/api/graphql",
    context: (request) => getContext(request.headers.authorization),
  })
  fastify.register(app)

  fastify.listen({ port, host }, (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    } else {
      console.log(`Server ready at http://${host}:${port}`)
    }
  })
})()
