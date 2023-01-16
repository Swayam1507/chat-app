const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server,{
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
  },
});
const connect= require('./connectToDB')
const cors = require('cors');


connect()

app.use(express.json())
app.use(cors())

// Use routes from the routes folder
// app.use('/', require('./routes/index'));
app.use('/users', require('./routes/user'));
app.use('/conversation', require('./routes/conversation'));
app.use('/message', require('./routes/message'));

// Socket.io connection
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('join room',(userId)=>{
    socket.join(userId)
    // console.log(userId)
  })
  socket.on('send msg',(obj)=>{
    // console.log('send msg triggered at backend',obj)
    // console.log(obj.msg,obj.currentConversation,obj.userId)
    // console.log(currentConversation)
    obj.currentConversation.users.map((user)=>{
      if(user._id !==obj.userId){
        // console.log('user._id',user._id)
        io.to(user._id).emit('receive msg',{message:obj.msg,currentConversation:obj.currentConversation})
      }
    })
  })

  socket.on('read message',(obj)=>{
    // console.log(`${obj.userId} have seen ${obj.val}`)
    console.log('read msg called')
    console.log(`${obj.userName} have seen ${obj.msgArr} of ${obj.sender}} `)
    io.to(obj.sender).emit('ack read message',{msgArr:obj.msgArr,userName:obj.userName})
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});


// Listen for incoming requests on port 3000
server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
