import Fastify from 'fastify'
import { initPresence } from "@user-presence/server"

const app = Fastify({ logger: true })
const port = 3002

const presence = initPresence({
  api_key: "123456"
})

app.get('/', async () => {

  const users = await presence.getUsers() // gets you a list of all your users status's

  return users
})

app.listen({ port })