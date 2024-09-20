import "dotenv/config"
import { ApolloServer } from "@apollo/server"
import fastifyApollo, { fastifyApolloDrainPlugin } from "@as-integrations/fastify"
import Fastify from "fastify"
import cors from "@fastify/cors"
import ws from "@fastify/websocket"

import { app } from "./app"
import { type ApolloContext, schema, getContext } from "./graphql"

const host = process.env.HOST ?? "localhost"
const port = process.env.PORT ? Number(process.env.PORT) : 3000
// 8 MiB limit
const FASTIFY_BODY_LIMIT = 1024 * 1024 * 8

;(async function () {
  const fastify = Fastify({
    logger: false,
    bodyLimit: FASTIFY_BODY_LIMIT,
  })

  const apollo = new ApolloServer<ApolloContext>({
    schema,
    // Plugin to shutdown the HTTP / Fastify server
    plugins: [fastifyApolloDrainPlugin(fastify)],
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
