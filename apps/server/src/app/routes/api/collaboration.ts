import type { FastifyInstance, FastifyRequest } from "fastify"
import hocusPocusServer from "../../../hocuspocus"

export default async function (fastify: FastifyInstance) {
  fastify.get("/api/collaboration", { websocket: true }, async function (socket, request: FastifyRequest) {
    hocusPocusServer.handleConnection(socket, request.raw)
  })
}
