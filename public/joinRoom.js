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
    console.log(history)
  })
}
