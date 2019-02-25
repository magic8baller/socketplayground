const socket = io('http://localhost:9001')
let nsSocket = ''
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
  joinNamespace('/wiki')
})
