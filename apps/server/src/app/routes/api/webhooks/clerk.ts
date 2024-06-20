import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import { Webhook } from "svix"

export default async function (fastify: FastifyInstance) {
  fastify.post(
    "/api/webhooks/clerk",
    { config: { rawBody: true } },
    async function (
      request: FastifyRequest<{
        Body: string | Buffer
        Headers: {
          "svix-id": string
          "svix-timestamp": string
          "svix-signature": string
        }
      }>,
      reply: FastifyReply,
    ) {
      // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
      const { WEBHOOK_SECRET } = process.env
      if (!WEBHOOK_SECRET) {
        throw new Error("You need a WEBHOOK_SECRET in your .env")
      }

      // Get the headers and body
      const { headers } = request
      const payload = request.rawBody

      // Get the Svix headers for verification
      const svix_id = headers["svix-id"]
      const svix_timestamp = headers["svix-timestamp"]
      const svix_signature = headers["svix-signature"]

      // If there are no Svix headers, error out
      if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error occured -- no svix headers", {
          status: 400,
        })
      }

      // Create a new Svix instance with your secret.
      const wh = new Webhook(WEBHOOK_SECRET)

      let evt

      // Attempt to verify the incoming webhook
      // If successful, the payload will be available from 'evt'
      // If the verification fails, error out and  return error code
      try {
        evt = wh.verify(payload, {
          "svix-id": svix_id,
          "svix-timestamp": svix_timestamp,
          "svix-signature": svix_signature,
        })
      } catch (err) {
        console.log("Error verifying webhook:", err.message)
        return reply.status(400).send({
          success: false,
          message: err.message,
        })
      }

      // Do something with the payload
      // For this guide, you simply log the payload to the console
      const { id } = evt.data
      const eventType = evt.type
      console.log(`Webhook with an ID of ${id} and type of ${eventType}`)
      console.log("Webhook body:", evt.data)

      return reply.status(200).send({
        success: true,
        message: "Webhook received",
      })
    },
  )
}
