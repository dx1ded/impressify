import "dotenv/config"
import { createServer, type Server } from "node:http"
import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app"
import { getStorage } from "firebase-admin/storage"
import Fastify from "fastify"
import { WebSocketServer } from "ws"
import { useServer } from "graphql-ws/lib/use/ws"
import cors from "@fastify/cors"
import { ApolloServer } from "@apollo/server"
import { createClerkClient } from "@clerk/backend"
import fastifyApollo, { fastifyApolloDrainPlugin } from "@as-integrations/fastify"

import { app } from "./app"
import { schema, type ApolloContext } from "./graphql"
import pubsub from "./pubsub"
import firebaseCredentials from "./impressify-26983-firebase-adminsdk-26c7d-c529d5e383"

const host = process.env.HOST ?? "localhost"
const port = process.env.PORT ? Number(process.env.PORT) : 3000
// 8 MiB limit
const FASTIFY_BODY_LIMIT = 1024 * 1024 * 8

;(async function () {
  let httpServer: Server
  const fastify = Fastify({
    logger: false,
    bodyLimit: FASTIFY_BODY_LIMIT,
    serverFactory: (handler) => {
      httpServer = createServer((req, res) => {
        handler(req, res)
      })

      return httpServer
    },
  })

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  })

  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET })
  const firebase = initializeApp({ credential: cert(firebaseCredentials as ServiceAccount) })

  const getContext = async (authorization?: string) => ({
    clerk,
    storage: getStorage(firebase),
    user: authorization ? await clerk.users.getUser(authorization) : undefined,
    pubsub,
  })

  const serverCleanup = useServer(
    { schema, context: async (ctx) => getContext(ctx.connectionParams?.authorization as string | undefined) },
    wsServer,
  )

  const apollo = new ApolloServer<ApolloContext>({
    schema,
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
  fastify.register(fastifyApollo(apollo), { context: (request) => getContext(request.headers.authorization) })
  fastify.register(app)
  fastify.listen({ port, host }, (err) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    } else {
      console.log(`Server ready at http://${host}:${port}`)
    }
  })
})()
