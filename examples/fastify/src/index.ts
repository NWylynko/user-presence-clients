import Fastify from 'fastify'
import { client } from "@user-presence/server"

const app = Fastify({ logger: true })
const port = 3002

const presence = client({
  api_key: "123456"
})

app.get('/', async () => {

  const users = await presence.getUsers()

  return users
})

app.listen({ port })