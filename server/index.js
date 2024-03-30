const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const Redis = require("ioredis");
require("dotenv").config();
const cluster = require("node:cluster");
const os = require("os");
const app = express();
const { handleMessage } = require("./controller/messageController");
const { handleJoinRoom, handleLeaveRoom } = require("./controller/roomController");




//Creating pub/sub and server
const pub = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    connectTimeout: 10000


});

const sub = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    connectTimeout: 10000

});

const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        methods: ["GET", "POST"],
        origin: "*"
    },
});

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

//Websocket connection handlers
io.on("connection", (socket) => {
    console.log(`new socket connected : ${socket.id}`);
    handleMessage(socket, pub, io);
    handleJoinRoom(socket, sub);
    handleLeaveRoom(socket);
});

sub.on('message', (channel, message) => {
    console.log(`Received message on channel ${channel}: ${message}`);
});

const port = process.env.PORT;


const totalCPU = os.cpus().length;
if (cluster.isPrimary) {
    for (let i = 0; i < totalCPU; i++) {
        cluster.fork();
    }
} else {
    server.listen(port, () => {
        console.log(`server running at http://localhost:${port}`);
    });
}




