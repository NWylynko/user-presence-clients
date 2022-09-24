import Fastify from 'fastify'

const app = Fastify({ logger: true })
const port = 3002

app.get('/', async () => {
  return 'Hello World!'
})

app.listen({ port })