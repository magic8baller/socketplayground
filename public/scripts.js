const socket = io('http://localhost:9001')

//listen for nslist
socket.on('nsList', nsData => {
  console.log('list of namespaces arrved')
  let namespaceDiv = document.querySelector('.namespaces')
  namespaceDiv.innerHTML = ''
  nsData.forEach(ns => {
    namespaceDiv.innerHTML += `<div class='namespace' ns=${
      ns.endpoint
    }><img src=${ns.img} alt=${ns.endpoint}></div>`
  })

  //add clickevent for e/ NS
  const namespaceDivs = Array.from(document.querySelectorAll('.namespace'))
  namespaceDivs.forEach(el => {
    el.addEventListener('click', e => {
      const nsEndpoint = el.getAttribute('ns')
      console.log(`${nsEndpoint} i should joinnnn`)
    })
  })
})

const nsSocket = io('http://localhost:9001/wiki')
nsSocket.on('nsRoomLoad', nsRooms => {
  let roomList = document.querySelector('.room-list')
  roomList.innerHTML = ''
  nsRooms.forEach(room => {
    let glyph = room.privateRoom ? 'lock' : 'globe'
    roomList.innerHTML += `<li class='room'><span class="glyphicon glyphicon-${glyph}"></span>${
      room.roomTitle
    }</li>`
  })
  let roomLinks = Array.from(document.querySelectorAll('room'))
  roomLinks.forEach(el => {
    el.addEventListener('click', e => {
      //
    })
  })
})

socket.on('messageFromServer', dataFromServer => {
  console.log(dataFromServer)
  socket.emit('dataToServer', { data: 'data from client' })
})

document.querySelector('.message-form').addEventListener('submit', e => {
  e.preventDefault()
  const newMessage = document.querySelector('#user-message').value

  socket.emit('messageToServer', { text: newMessage })
})

// document.querySelector('#message-form').addEventListener('submit', e => {
//   e.preventDefault()
//   const newMessage = document.querySelector('#user-message').value
//   console.log(newMessage)
//   //send to server on submit via this event:
//   //socket === THIS socket
//   socket.emit('newMessageToServer', { text: newMessage })
// })

// socket.on('messageToClients', msg => {
//   console.log(msg)
//   document.querySelector('#messages').innerHTML += `<li>${msg.text}</li>`
// })
