import Fastify from 'fastify'

const app = Fastify({ logger: true })
const port = 3000

app.get('/', async () => {
  return 'Hello World!'
})

app.listen({ port })