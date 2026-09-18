import { Server } from "socket.io";
import http from 'http'
import env from "@/config/env";

type PlayerData = {
    position: { x: number, y: number, z: number }
}

type ClientToServerEvents = {
    'player:input': (playerData: PlayerData) => void,
    'player:join': (playerData: PlayerData) => void
}

type ServerToClientEvents = {
    'player:state': (socketId: string, playerData: PlayerData) => void,
    'player:joined': (socketId: string, playerData: PlayerData) => void,
    'player:left': (socketId: string) => void
}


const initializeWebSocket = (server: http.Server) => {
    const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
        cors: {
            origin: env.CLIENT_URL,
            credentials: true
        }
    })


    io.on('connection', (socket) => {
        console.log(`New joining, total clients = ${io.engine.clientsCount}`)

        socket.on('player:join', (data) => {
            // Broadcast newly joined playerData to others
            socket.broadcast.emit('player:joined', socket.id, data)
        })

        socket.on('player:input', (data) => {
            // Broadcast latest playerData to other players
            socket.broadcast.emit('player:state', socket.id, data)
        })


        socket.on('disconnect', () => {
            console.log(`Disconnected socket with socketId: ${socket.id}`)
            console.log(`Total remaining connections = ${io.engine.clientsCount}`)

            socket.broadcast.emit('player:left', socket.id)
        })
    })
}

export default initializeWebSocket