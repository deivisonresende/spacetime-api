import { FastifyInstance } from 'fastify'
import axios from 'axios'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function authRoutes(app: FastifyInstance) {
  app.post('/register/gh', async (request) => {
    const bodySchema = z.object({
      code: z.string(),
    })

    const { code } = bodySchema.parse(request.body)

    const { data } = await axios.post(
      'https://github.com/login/oauth/access_token',
      null,
      {
        params: {
          code,
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
        },
        headers: {
          Accept: 'application/json',
        },
      },
    )

    const accessToken = data.access_token

    const { data: ghUserData } = await axios.get(
      'https://api.github.com/user',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    const userSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url(),
    })

    const ghUser = userSchema.parse(ghUserData)

    let user = await prisma.user.findUnique({
      where: {
        gitHubId: ghUser.id,
      },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          gitHubId: ghUser.id,
          login: ghUser.login,
          name: ghUser.name,
          avatarUrl: ghUser.avatar_url,
        },
      })
    }

    const token = app.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      {
        sub: user.id,
        expiresIn: '30 days',
      },
    )

    return { token }
  })
}
