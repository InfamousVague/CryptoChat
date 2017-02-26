const key = createKey(3)

let theirBlockKey
let rcon
let pid

const chatBox = document.getElementById('chat')

// Adds a message to the chatbox
const writeMessage = function(msg, app) {
  const decrypted = CryptoJS.AES.decrypt(msg, theirBlockKey.replace(/\s/g, ''))

  if (decrypted.toString(CryptoJS.enc.Utf8)) {
    app.content += `\n${pid}: ${decrypted.toString(CryptoJS.enc.Utf8)}`
  } else {
    app.content += `\n${pid}: ${msg}`
  }

  // Automatically scroll to bottom of div
  chatBox.scrollTop = chatBox.scrollHeight;
}

// P2P
const peer = new Peer({key: 't6ll478mrrv34n29'})

// Once we've gotten a peer ID from the broker, let us know what it is so we may share it
peer.on('open', (peerID) => {
  const app = new Vue({
    el: '#app',
    data: {
      peerID,
      key,
      content: 'To begin, you\'ll need a peer id and block key...'
    },
    methods: {
      connect: function () {
        const theirID = document.getElementById('theirPeerID').value
        const theirBlock = document.getElementById('theirBlockKey').value

        // Update the global block key used to decrypt
        theirBlockKey = theirBlock

        // Connect to a new peer
        const client = peer.connect(theirID);

        // When the connection is open, add any messages to the chatbox
        client.on('open', function() {
          // Let us know we've connected successfuly
          app.content += `\nConnected to ${theirID}!`

          client.on('data', function(data) {
            writeMessage(data, app)
          })
        })
      }, 
      send: function () {
        // Get message and clear input
        const val = document.getElementById('message').value
        document.getElementById('message').value = ''

        // Send message to chatbox unencrypted so we remember what we've said
        app.content += `\nMe: ${val}`

        // Encrypt the message
        const msg = CryptoJS.AES.encrypt(val, key.replace(/\s/g, ''))

        // Send the encrypted message to the peer
        if (rcon) {
          rcon.send(msg.toString())
        } else {
          app.content += `\nOops... You're trying to send a message before connecting to a peer.`
        }
      }
    }
  })
  
  peer.on('connection', function (conn) {
    // ID of peer connection to us
    pid = conn.peer
    
    conn.on('open', function() {
      rcon = conn
      // Let us know we've made a connection
      app.content += `\nNew connection from peer: ${pid}`

      conn.on('data', function(data) {
        writeMessage(data, app)
      })
    })
  })
})