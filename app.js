// server side setup

const express = require('express')
const http = require('http')
const socket = require('socket.io')
const {Chess} = require('chess.js')
const path = require('path')
const { title } = require('process')

const app = express()
const server = http.createServer(app) // here app will handle with backend 
const io = socket(server) // socket requires a http server therefore we pass a http server in socket
    // we use socket for real time operations

// think of it as : express.server <--(connected to each other)--> http.server --(socket handles http server)--> socket

const chess = new Chess()
let player = {}
let currentPlayer = 'w'

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,'public')))

app.get('/', (req, res) => {
    res.render('index', {title:'chess.io'})
})

// io.on('connection', (uniquesocket)=>{ // uniquesocket -> unique info about the client, connection 
// // -> whenever someone connects to our server
//     console.log('connected'); // so like multiple users can connect to the server at the same time (try opening multiple tabs, and u'll get multiple log's)
//     // uniquesocket.on('client_message', () => {
//     //     // console.log('client_message : recieved'); // u see this in server console
//     //     io.emit('server_message') // i.e. this message will be recived by every connected client (new_client + all_previously_connected_users)
//     //     // if new client connect then this message will be recieved by all previosly connected users
//     // })
    // uniquesocket.on('disconnect', () => { // if by any means the connection b/w the client and server break then this will be called
    //     console.log('disconnected');
    // })
// })

// server assigns roles based on connectivity
io.on('connection', (uniquesocket)=> {
    console.log('connected');                   // before anyone connect player = {} 
    if(!player.white) {                         // when 1st player connects then we directly assign it the role of white and mark its id as player.white
        player.white = uniquesocket.id;
        uniquesocket.emit("playerRole", "w");
    }
    else if(!player.black) {                    // when 2nd player connects then, since the field player.white is'nt available then its directly assigned black 
        player.black = uniquesocket.id;
        uniquesocket.emit("playerRole", "b");
    } 
    else {
        uniquesocket.emit("spectatorRole");  // any player after that will only have the role of spectator
    }

    uniquesocket.on('disconnect', () => {
        console.log('disconnected');
        if(uniquesocket.id === player.white) {
            delete player.white
        } else if(uniquesocket.id === player.black) {
            delete player.black
        }
    })

    uniquesocket.on('move', (move)=>{ // 'move' is a event from frontend
        // try-catch to detect correct turn/move or not
        try{
            // if its the turn of white and player who played the move is not white then we return and vice versa
            // if its not white turn and it made a move then the moved peice will return to its source desination
            if(chess.turn() === 'w' && uniquesocket.id !== player.white) return;
            if(chess.turn() === 'b' && uniquesocket.id !== player.black) return;

            const result = chess.move(move)  // when a illegal move is played then .move() function will cause an error that will be taken by result
            // this line will cause error in this callback, crashing the server

            if(result) { // correct move
                currentPlayer = chess.turn()
                io.emit('move', move) // server saying that it was a correct move
                io.emit('boardState', chess.fen()) // this is a FEN notation , which tells us about the current state of the board
            }
            else {
                console.log('Invalid move', move);
                uniquesocket.emit('Invalid move', move) // here u are only telling the client who played the wrong move
            }
        }
        catch(err) {
            console.log(err);
            uniquesocket.emit('Invalid move', move) 
            
        }
    })
})

// socket need to be running on server-side and front-end for socket-to-socket connection

server.listen(3000, ()=>{
    console.log('listning on 3000');
})