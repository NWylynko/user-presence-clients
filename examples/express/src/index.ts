import express from 'express'
import { presence } from "@user-presence/server"

const app = express()
const port = 3001

const userPresence = presence({
  api_key: "678"
})

app.get('/', async (req, res) => {

  const userId = "789" // get this from req / jwt

  const status = await userPresence.getUser(userId)

  res.json(status)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})