function joinNamespace(endpoint) {
  nsSocket = io(`http://localhost:9001${endpoint}`)

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
        joinRoom(e.target.innerText)
      })
    })

    //auto-enter room, first time
    const topRoom = document.querySelector('.room')
    const roomTitle = topRoom.innerText
    joinRoom(roomTitle)
  })

  nsSocket.on('messageToClients', msg => {
    console.log(msg)
    document.querySelector('#messages').innerHTML += `<li>${msg.text}</li>`
  })

  document.querySelector('.message-form').addEventListener('submit', e => {
    e.preventDefault()
    const newMessage = document.querySelector('#user-message').value
    //send onSubmit - socket === THIS client instance
    nsSocket.emit('newMessageToServer', { text: newMessage })
  })
}
