import { api } from "./api/axios";
import { Game } from "./game";


// Client
const game = new Game()
game.initialize()


// Server Connection
const a = await api.get('/')
console.log(a)