import express from "express";
import dotenv  from "dotenv"
import { Socket } from "socket.io";
dotenv.config()
import LoginRouter from "./routes/LoginRoute";
import http from "http"
import { Server } from "socket.io";

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
import cloudinary from 'cloudinary'

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})
/*
To integrate Socket.IO with Express, you need access to the underlying http server.
By explicitly creating the http server using http.createServer(app), you can pass this server instance to Socket.IO.
This allows Socket.IO to work alongside Express, handling WebSocket connections.
*/
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
     origin: "http://localhost:3000"
    }});





const port = process.env.PORT ||3000;


app.get('/', (req, res)=>{
    res.send('Hi')
})

// socket here means a connection
io.on('connection', (socket)=>{
   console.log(socket.id)    
})

app.use('/api/v1',LoginRouter)
app.listen(port,()=>{
    console.log('listening on', port)
})
