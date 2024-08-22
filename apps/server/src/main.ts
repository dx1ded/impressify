import "dotenv/config"
import { createServer, type Server } from "node:http"
import { ApolloServer } from "@apollo/server"
import fastifyApollo, { fastifyApolloDrainPlugin } from "@as-integrations/fastify"
import { createClerkClient, type User } from "@clerk/backend"
import cors from "@fastify/cors"
import Fastify from "fastify"
import { cert, initializeApp, type ServiceAccount } from "firebase-admin/app"
import { getStorage } from "firebase-admin/storage"
import { useServer } from "graphql-ws/lib/use/ws"
import { WebSocketServer } from "ws"

import { app } from "./app"
import { slideRepository, userRepository } from "./database"
import { type ApolloContext, schema } from "./graphql"
import { PresentationOperation, type PresentationState } from "./graphql/__generated__"
import { useConnections } from "./helpers"
import firebaseCredentials from "./impressify-26983-firebase-adminsdk-26c7d-c529d5e383"
import pubsub, { EVENT } from "./pubsub"

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

  const connections = useConnections()

  const getContext = async (authorization?: string): Promise<ApolloContext> => ({
    clerk,
    storage: getStorage(firebase),
    user: authorization ? await clerk.users.getUser(authorization) : undefined,
    pubsub,
    connections,
  })

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx, _, args) => {
        const context = await getContext(ctx.connectionParams?.authorization as string | undefined)
        const presentationId = args.variableValues?.presentationId as string | undefined
        if (context.user && presentationId) {
          try {
            const state = connections.getSynchronizedState(presentationId)
            connections.addUser(presentationId, {
              ...(await userRepository.findOne({
                select: ["id", "name", "profilePicUrl"],
                where: { id: context.user.id },
              })),
              // If `synchronizedSlides` exist we get the first slide id from there (because it's safer than guessing from slideRepository)
              currentSlideId: (state.slides?.length
                ? state.slides[0]
                : await slideRepository.findOne({
                    select: ["id"],
                    where: { presentation: { id: presentationId }, position: 0 },
                  })
              ).id,
            })
            // Delaying it so context gets first and then `pubsub.publish` gets called
            setTimeout(
              () =>
                pubsub.publish(EVENT.PRESENTATION_UPDATED, {
                  presentationUpdated: {
                    operation: PresentationOperation.Update,
                    connectedUsers: connections.getUsers(presentationId),
                    ...(state.name ? { name: state.name } : {}),
                    ...(state.slides ? state.slides : {}),
                    isSaving: state.isSaving,
                    _presentationId: presentationId,
                  } as PresentationState,
                }),
              0,
            )
            // Setting `ctx.extra` for `onDisconnect`. Also, making it as `never` because ctx.extra fields should all be `never`
            ctx.extra.presentationId = presentationId as never
            ctx.extra.user = context.user as never
          } catch (e) {
            console.log(e)
          }
        }
        return context
      },
      onDisconnect: (ctx) => {
        const user = ctx.extra?.user as User | undefined
        const presentationId = ctx.extra?.presentationId as string | undefined
        if (user && presentationId) {
          connections.removeUser(presentationId, user.id)
          if (!connections.getUsers(presentationId).length) return connections.removeConnection(presentationId)
          pubsub.publish(EVENT.PRESENTATION_UPDATED, {
            presentationUpdated: {
              operation: PresentationOperation.Update,
              connectedUsers: connections.getUsers(presentationId),
              _presentationId: presentationId,
            } as PresentationState,
          })
        }
      },
    },
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
