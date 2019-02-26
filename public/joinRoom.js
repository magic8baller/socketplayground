function joinRoom(roomName) {
  //join room here: send roomname to server
  //.emit(event, (args, ack))
  //ack cb() = can use like custom ajax cb/promise
  //have accessto newNumberOfMembers via 'numberOfUsers' callback!
  nsSocket.emit('joinRoom', roomName, newNumberOfMembers => {
    //want to update room member  total now that joined
    document.querySelector(
      '.curr-room-num-users'
    ).innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span
    >`
  })
  nsSocket.on('historyCatchUp', history => {
    const messagesUl = document.querySelector('#messages')
    messagesUl.innerHTML = ''
    history.forEach(msg => {
      const newMsg = buildHTML(msg)
      const currentMessages = messagesUl.innerHTML
      messagesUl.innerHTML = currentMessages + newMsg
    })
    //bring new user to most recent message on page
    messagesUl.scrollTo(0, messagesUl.scrollHeight)
  })
  nsSocket.on('updateMembers', numMembers => {
    document.querySelector(
      '.curr-room-num-users'
    ).innerHTML = `${numMembers} <span class="glyphicon glyphicon-user"></span
    >`
    document.querySelector('.curr-room-text').textContent = `${roomName}`
  })
}
