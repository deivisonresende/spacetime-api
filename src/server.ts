import cors from '@fastify/cors'
import fastify from 'fastify'
import { memoriesRoutes } from './routes/memories'
const app = fastify()

app
  .register(cors, { origin: true })
  .register(memoriesRoutes)
  .listen({ port: 3333 })
  .then(() => console.log('HTTP server running on http://localhost:3333'))
