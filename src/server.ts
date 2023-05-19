import 'dotenv/config'

import { authRoutes } from './routes/auth'
import cors from '@fastify/cors'
import fastify from 'fastify'
import jwt from '@fastify/jwt'
import { memoriesRoutes } from './routes/memories'

const app = fastify()

app
  .register(cors, { origin: true })
  .register(jwt, { secret: process.env.JWT_SECRET_KEY ?? '' })
  .register(authRoutes)
  .register(memoriesRoutes)
  .listen({ port: 3333 })
  .then(() => console.log('HTTP server running on http://localhost:3333'))
