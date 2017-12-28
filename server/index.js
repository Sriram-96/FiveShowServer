let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

var users = [];
var userCount = {};
io.on('connection', (socket) => {
    console.log('Soceket connected !');
  
  socket.on('disconnect', function(){
    console.log('Socket disconencted !');
  });

  socket.on('leave-room', (userData) => {
    var i;
    for(i=0; i<users.length; i++)
      if(users[i].id == userData.id)
        users.splice(i,1);
      socket.leave(userData.roomCode);
  });

  socket.on('next-turn', (data) => {
    io.sockets.in(data.roomCode).emit('next-turn', data);
  });

  socket.on('show', (data) => {
    console.log('Show ',data.roomCode);
    io.sockets.in(data.roomCode).emit('show', data);
  });

  socket.on('start-game', (userData) => {
    var i;
      var thisRoomUsers = [];
      for(i=0; i<users.length; i++)
        if(users[i].roomCode == userData.roomCode)
          thisRoomUsers.push(users[i]);
      console.log('Start Game',thisRoomUsers.length);
      socket.broadcast.to(userData.roomCode).emit('start-game', thisRoomUsers);
      io.sockets.in(userData.roomCode).emit('canDisconnect', thisRoomUsers);
  });

  socket.on('send-cards', (cardsData) => {
    console.log('send cards',cardsData.roomCode);
    socket.broadcast.to(cardsData.roomCode).emit('refresh-cards', cardsData);
  });

  socket.on('ready', (userData) => {
    var i;
    for(i=0; i<users.length; i++)
      if(users[i].id == userData.id)
        users[i].color = userData.color;
    var thisRoomUsers = [];
    for(i=0; i<users.length; i++)
      if(users[i].roomCode == userData.roomCode)
        thisRoomUsers.push(users[i]);
    io.sockets.in(userData.roomCode).emit('joined', thisRoomUsers);
  });

  socket.on('join-room-2', (data) => {
    console.log('Joined Room 2 ',data.roomCode);
    socket.join(data.roomCode);
    users.push(data);
    var thisRoomUsers = [],i;
    for(i=0; i<users.length; i++)
      if(users[i].roomCode == data.roomCode)
        thisRoomUsers.push(users[i]);
    if(userCount[data.roomCode] == undefined)
      userCount[data.roomCode] = 1;
    else
      userCount[data.roomCode]++;
    if(data.members.length == userCount[data.roomCode])
    {
      console.log('All Users Joined !');
      delete userCount[data.roomCode];
      io.sockets.in(data.roomCode).emit('allUsersJoined', data);
    }
  });
 
  socket.on('join-room', (userData) => {
    console.log('Joined Room ',userData.roomCode);
    socket.join(userData.roomCode);
    users.push(userData);
    var thisRoomUsers = [],i;
    for(i=0; i<users.length; i++)
      if(users[i].roomCode == userData.roomCode)
        thisRoomUsers.push(users[i]);
    io.sockets.in(userData.roomCode).emit('joined', thisRoomUsers);
  });
});
 
var port = process.env.PORT || 3001;
 
http.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});