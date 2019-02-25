const socket = io('http://localhost:9001')

//listen for nslist
socket.on('nsList', nsData => {
  console.log('list of namespaces arrved')
  console.log(nsData)
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
