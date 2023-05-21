import { FastifyInstance } from 'fastify'
import { authRoutes } from './auth'
import { memoriesRoutes } from './memories'
import { uploadRoutes } from './upload'

export default async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) =>
    console.log(`[${request.method}] ${request.url}`),
  )

  app.register(authRoutes)
  app.register(memoriesRoutes)
  app.register(uploadRoutes)
}
