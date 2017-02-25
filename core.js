const key = createKey(3)
document.getElementById("blockKey").innerText = key 

let theirBlockKey = ''

const chatBox = document.getElementById('chat')
const sendMessage = function(msg) {
  const decrypted = CryptoJS.AES.decrypt(msg, theirBlockKey.replace(/\s/g, ''))

  if (decrypted.toString(CryptoJS.enc.Utf8)) {
    chatBox.innerHTML += `<p class="nopad"><span class="timestamp">[${Date.now()}]:</span> ${decrypted.toString(CryptoJS.enc.Utf8)}</p>`
  } else {
    chatBox.innerHTML += `<p class="nopad"><span class="timestamp">[${Date.now()}]:</span> Failed to decrypt message, need blockkey to decrypted.</p>`
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

// P2P
const peer = new Peer({key: 't6ll478mrrv34n29'})

peer.on('open', (id) => {
  document.getElementById("peerID").innerText = id 
})

peer.on('connection', function (conn) {
  const pid = conn.peer
  chatBox.innerHTML += `<p><span class="timestamp">New connection from peer: ${pid}</p>`
  conn.on('open', function() {
    conn.on('data', function(data) {
      sendMessage(data)
    })
    document.getElementById('send').onclick = function() {
      const val = document.getElementById('message').value
      document.getElementById('message').value = ''
      console.log('encrypting using', key.replace(/\s/g, ''))
      const msg = CryptoJS.AES.encrypt(val, key.replace(/\s/g, ''))
      conn.send(msg.toString())
    }
  })
})


// Chat
document.getElementById('connect').onclick = function() {
  const theirID = document.getElementById('theirPeerID').value
  const theirBlock = document.getElementById('theirBlockKey').value

  theirBlockKey = theirBlock
  console.log('theirblock', theirBlock)
  const client = peer.connect(theirID);

  client.on('open', function() {
    client.send('Hello!')

    client.on('data', function(data) {
      sendMessage(data)
    });
  });
}
