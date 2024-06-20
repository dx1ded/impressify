import { FastifyInstance } from "fastify"
import fp from "fastify-plugin"
import rawBody from "fastify-raw-body"

export default fp(async function (fastify: FastifyInstance) {
  fastify.register(rawBody, {
    global: false,
  })
})
