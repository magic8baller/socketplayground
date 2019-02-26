const express = require('express')
const app = express()
const socketio = require('socket.io')
let namespaces = require('./data/namespaces')
app.use(express.static(__dirname + '/public'))

const expressServer = app.listen(9001)
const io = socketio(expressServer)

//socket = connected client!

io.on('connect', socket => {
  //map array send back img + endpoint for e/ namespace
  let nsData = namespaces.map(ns => {
    return {
      img: ns.img,
      endpoint: ns.endpoint
    }
  })
  // console.log(nsData)
  //send nsData back to client, use socket(NOT IO) bc want only to this client
  socket.emit('nsList', nsData)
})

//listen for conncn in each room:
namespaces.forEach(ns => {
  io.of(ns.endpoint).on('connect', nsSocket => {
    console.log(`${nsSocket.id} has joined ${ns.endpoint}`)
    // a socket connected to a NS
    // send that NS room info back
    nsSocket.emit('nsRoomLoad', namespaces[0].rooms)
    nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback) => {
      //numverofusersCB from usercountspan in #joinRoom - optional 'ack' cb t hat makes call from client to server
      //TODO: deal w/ history when finally get some
      // now - SOCKET BELONGS TO ROOM ARG!
      nsSocket.join(roomToJoin)

      const nsRoom = namespaces[0].rooms.find(room => {
        return room.roomTitle === roomToJoin
      })
      console.log(nsRoom)
      nsSocket.emit('historyCatchUp', nsRoom.history)
      //send back # of users in this room to ALL sockets in this room
      io.of('/wiki')
        .in(roomToJoin)
        .clients((error, clients) => {
          console.log(`There are ${clients.length} clients in this room`)
          io.of('/wiki')
            .in(roomToJoin)
            .emit('updateMembers', clients.length)
        })
    })
    //if browser submits form- calls newMessageToServer, and sends msg to console
    nsSocket.on('newMessageToServer', msg => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: 'elTee',
        avatar: 'https://via.placeholder.com/30'
      }
      console.log(fullMsg)
      //send msg to ALL SOCKETS in current room that THIS 'sender' socket is in
      //find rooms THIS socket's in => {socketId, roomName}
      console.log(nsSocket.rooms)
      //user will be in 2nd room in object list
      //bc socket ALWAYS JOINS ITS OWN ROOM CONNECTION..

      const roomTitle = Object.keys(nsSocket.rooms)[1]
      // need to find Room object for this room
      const nsRoom = namespaces[0].rooms.find(room => {
        return room.roomTitle === roomTitle
      })
      console.log('the room obj we made matches this NS room is...')
      console.log(nsRoom)
      // new message comes in, push to history
      nsRoom.addMessage(fullMsg)
      io.of('/wiki')
        .to(roomTitle)
        .emit('messageToClients', fullMsg)
    })
  })
})
