import "dotenv/config"
import { createServer, type Server } from "node:http"
import { ApolloServer } from "@apollo/server"
import { useServer } from "graphql-ws/lib/use/ws"
import fastifyApollo, { fastifyApolloDrainPlugin } from "@as-integrations/fastify"
import Fastify from "fastify"
import cors from "@fastify/cors"
import ws from "@fastify/websocket"
import { WebSocketServer } from "ws"

import { app } from "./app"
import { initializePubSub } from "./database"
import { type ApolloContext, schema, getContext } from "./graphql"

initializePubSub()

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

  const serverCleanup = useServer({ schema }, wsServer)

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
