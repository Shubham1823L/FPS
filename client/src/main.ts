import { io, Socket } from "socket.io-client";
import { api } from "./api/axios";
import { Game } from "./game";
import * as THREE from 'three'
import { RemotePlayer } from "./RemotePlayer";


// Client
const game = new Game()
const { player, scene } = await game.initialize()

// Server Connection
const helloWorld = await api.get('/')
console.log(helloWorld)


// Web Socket Setup
type PlayerData = {
    position: THREE.Vector3
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

const TPS = 20 // Ticks per second
const remotePlayers = new Map<string, RemotePlayer>()

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(import.meta.env.VITE_API_BASE_URL)

socket.on('connect', () => {
    console.log(`Connected to Web Socket with socketId: ${socket.id}`)
})

socket.emit('player:join', { position: player.position })

// Server ticks loop
setInterval(() => {
    socket.emit('player:input', { position: player.position })
}, (1 / TPS) * 1000);

socket.on('player:state', (socketId, data) => {
    let remotePlayer = remotePlayers.get(socketId)
    if (!remotePlayer) remotePlayer = initalizeRemotePlayer(socketId, data)

    remotePlayer.update(new THREE.Vector3().copy(data.position))
})

socket.on('player:joined', (socketId, data) => {
    // Other player joined, so we add them to remotePlayers Map
    initalizeRemotePlayer(socketId, data)

    // Deal with room joining related problems later
})

socket.on('player:left', (socketId) => {
    const remotePlayer = remotePlayers.get(socketId)
    if (!remotePlayer) return
    remotePlayer.helper.removeFromParent()
    remotePlayers.delete(socketId)
    console.info(`Player: ${socketId} has left the game`)
})

const initalizeRemotePlayer = (socketId: string, data: PlayerData) => {
    const remotePlayer = new RemotePlayer(scene, new THREE.Vector3().copy(data.position))
    remotePlayers.set(socketId, remotePlayer)

    console.log(`Player: ${socketId} has joined the game`)

    return remotePlayer
}