import "dotenv/config"
import { createServer, type Server } from "node:http"
import Fastify from "fastify"
import { WebSocketServer } from "ws"
import { useServer } from "graphql-ws/lib/use/ws"
import { PubSub } from "graphql-subscriptions"
import { ApolloServer } from "@apollo/server"
import { createClerkClient } from "@clerk/backend"
import fastifyApollo, { type ApolloFastifyContextFunction, fastifyApolloDrainPlugin } from "@as-integrations/fastify"
import { app } from "./app"
import { schema, type ApolloContext } from "./graphql"

const host = process.env.HOST ?? "localhost"
const port = process.env.PORT ? Number(process.env.PORT) : 3000

;(async function () {
  let httpServer: Server
  const fastify = Fastify({
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
              await useServer({ schema }, wsServer).dispose()
            },
          }
        },
      },
    ],
  })

  const contextFn: ApolloFastifyContextFunction<ApolloContext> = async (request) => ({
    clerk,
    user: request.headers.authorization ? await clerk.users.getUser(request.headers.authorization) : undefined,
    pubsub: new PubSub(),
  })

  await apollo.start()

  fastify.register(fastifyApollo(apollo), { context: contextFn })
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
