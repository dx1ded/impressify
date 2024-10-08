import type { UserJSON } from "@clerk/backend"
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import { Webhook } from "svix"
import { userRepository } from "../../../../database"
import { User } from "../../../../entities/User"
import { UserWebhookEventTypes } from "../../../../utils"

export default async function (fastify: FastifyInstance) {
  fastify.post(
    "/api/webhooks/clerk",
    { config: { rawBody: true } },
    async function (
      request: FastifyRequest<{
        Headers: {
          "svix-id": string
          "svix-timestamp": string
          "svix-signature": string
        }
      }>,
      reply: FastifyReply,
    ) {
      const { WEBHOOK_SECRET } = process.env
      if (!WEBHOOK_SECRET) {
        throw new Error("You need a WEBHOOK_SECRET in your .env!")
      }

      const { headers } = request
      const payload = request.rawBody

      const svix_id = headers["svix-id"]
      const svix_timestamp = headers["svix-timestamp"]
      const svix_signature = headers["svix-signature"]

      if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error occured -- no svix headers", {
          status: 400,
        })
      }

      const wh = new Webhook(WEBHOOK_SECRET)
      let evt

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

      const { id, first_name, last_name, email_addresses, image_url } = evt.data as UserJSON
      const eventType = evt.type

      if (eventType === UserWebhookEventTypes.USER_CREATED) {
        await userRepository.save(new User(id, first_name, last_name, email_addresses[0].email_address, image_url))
      } else if (eventType === UserWebhookEventTypes.USER_UPDATE) {
        const user = await userRepository.findOneBy({ id })
        user.name = `${first_name} ${last_name}`
        user.profilePicUrl = image_url
        user.email = email_addresses[0].email_address
        await userRepository.save(user)
      } else if (eventType === UserWebhookEventTypes.USER_DELETED) {
        await userRepository.delete({ id })
      } else {
        console.log(`Unknown event type - ${eventType}`)
      }

      return reply.status(200).send({
        success: true,
        message: "Webhook received",
      })
    },
  )
}
