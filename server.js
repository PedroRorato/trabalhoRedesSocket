const express = require('express');
//Inicia o App
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

//Libera a importação do CSS
app.use(express.static(__dirname + '/public'));

server.listen(port, () => {
    console.log('Server Running...')
});

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/:room', (req,res) => {
    

    res.sendFile(__dirname + '/public/room.html');
    
});

io.on('connection', (socket) => {
    
    socket.on('join', (data) => {
        socket.join(data.room);
        io.in(data.room).emit('message', {msg: `New user joined ${data.room} room!`,  name: 'server'});
    })

    socket.on('message', (data) =>{
        console.log(`message: ${data.msg}`);
        io.in(data.room).emit('message', data);
    });  

    socket.on('disconnect', (data) => {
        console.log('user disconnected', data);
        io.emit('message', {msg: 'user disconnected', name: 'server'});
    });
});