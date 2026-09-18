import express from "express"
import env from "./config/env"
import http from 'http'
import cors from "cors"
import cookieParser from "cookie-parser"

import connectToMongoDB from "./config/mongoConnect"

import errorHandler from "./middlewares/errorHandler"
import responseHandler from "./middlewares/responseHandler"
import initializeWebSocket from "./socket"

await connectToMongoDB()

const app = express();
const server = http.createServer(app)

// Socket
initializeWebSocket(server)

app.use(express.json())
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true
}))
app.use(cookieParser())
app.use(responseHandler)


app.get('/api', (req, res) => {
  res.send('Hello World!');
});

app.use(errorHandler)

server.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});

