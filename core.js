const key = createKey(3)
document.getElementById("blockKey").innerText = key 

let theirBlockKey = ''

const chatBox = document.getElementById('chat')

// Adds a local message
const addMyMessage = function(msg, sub) {
  if (sub) {
    chatBox.innerHTML += `<p class="nopad" style="color: #95a5a6;">${msg}</p>`
  } else {
    chatBox.innerHTML += `<p class="nopad" style="color: #2ecc71;"><span class="timestamp">[${getTime()}]:</span> ${msg}</p>`
  }
}

// Adds a message to the chatbox
const sendMessage = function(msg) {
  const decrypted = CryptoJS.AES.decrypt(msg, theirBlockKey.replace(/\s/g, ''))

  if (decrypted.toString(CryptoJS.enc.Utf8)) {
    chatBox.innerHTML += `<p class="nopad" style="color: #34495e;"><span class="timestamp">[${getTime()}]:</span> ${decrypted.toString(CryptoJS.enc.Utf8)}</p>`
  } else {
    chatBox.innerHTML += `<p class="nopad" style="color: #34495e;"><span class="timestamp">[${getTime()}]:</span> ${msg}</p>`
  }

  // Automatically scroll to bottom of div
  chatBox.scrollTop = chatBox.scrollHeight;
}

// P2P
const peer = new Peer({key: 't6ll478mrrv34n29'})

// Once we've gotten a peer ID from the broker, let us know what it is so we may share it
peer.on('open', (id) => {
  document.getElementById("peerID").innerText = id 
})

peer.on('connection', function (conn) {
  // ID of peer connection to us
  const pid = conn.peer
  
  conn.on('open', function() {
    // Let us know we've made a connection
    chatBox.innerHTML += `<p>New connection from peer: ${pid}</p>`

    conn.on('data', function(data) {
      sendMessage(data)
    })
    document.getElementById('send').onclick = function() {
      // Get message and clear input
      const val = document.getElementById('message').value
      document.getElementById('message').value = ''

      // Send message to chatbox unencrypted so we remember what we've said
      addMyMessage(val)

      // Encrypt the message
      const msg = CryptoJS.AES.encrypt(val, key.replace(/\s/g, ''))

      // Add the encrypted version just for fun
      addMyMessage(msg.toString(), true)

      // Send the encrypted message to the peer
      conn.send(msg.toString())
    }
  })
})


// Chat
document.getElementById('connect').onclick = function() {
  const theirID = document.getElementById('theirPeerID').value
  const theirBlock = document.getElementById('theirBlockKey').value

  // Update the global block key used to decrypt
  theirBlockKey = theirBlock

  // Connect to a new peer
  const client = peer.connect(theirID);

  // When the connection is open, add any messages to the chatbox
  client.on('open', function() {
    // Let us know we've connected successfuly
    addMyMessage(`Connected to ${theirID}!`)

    client.on('data', function(data) {
      sendMessage(data)
    });
  });
}
