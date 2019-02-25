const express = require('express')
const app = express()
const socketio = require('socket.io')
let namespaces = require('./data/namespaces')
app.use(express.static(__dirname + '/public'))

const expressServer = app.listen(9001)
const io = socketio(expressServer)

//socket = connected client!

io.on('connect', socket => {
  //map array send back img + endpoint for e/ new Promise(function(resolve, reject) {
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
  const thisNs = io.of(ns.endpoint)
  thisNs.on('connect', socket => {
    console.log(`${socket.id} has joined ${ns.endpoint}`)
  })
})
