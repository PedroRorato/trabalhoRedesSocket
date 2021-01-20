const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

server.listen(port, () => {
    console.log('Server Running...')
});

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/:room', (req,res) => {
    io.on('connection', (socket) => {
    
        socket.on('join', (data) => {
            socket.join(data.room);
            io.in(data.room).emit('message', `New user joined ${data.room} room!`);
        })
    
        socket.on('message', (data) =>{
            console.log(`message: ${data.msg}`);
            io.in(data.room).emit('message', data);
        });  
    
        socket.on('disconnect', () => {
            console.log('user disconnected');
            io.emit('message', 'user disconnected');
        });
    });

    res.sendFile(__dirname + '/public/room.html');
    

});




