import 'dotenv/config'

import cors from '@fastify/cors'
import fastify from 'fastify'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import { resolve } from 'path'
import routes from './routes'

const app = fastify()

app
  .register(require('@fastify/static'), {
    root: resolve(__dirname, '../uploads'),
    prefix: '/uploads',
  })
  .register(multipart)
  .register(cors, { origin: true })
  .register(jwt, { secret: process.env.JWT_SECRET_KEY ?? '' })
  .register(routes)
  .listen({ port: 3333, host: '0.0.0.0' })
  .then(() => console.log('HTTP server running on http://localhost:3333'))
