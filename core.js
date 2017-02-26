let theirBlockKey
let rcon
let pid

// P2P
const peer = new Peer({key: 't6ll478mrrv34n29'})

// Once we've gotten a peer ID from the broker, let us know what it is so we may share it
peer.on('open', (peerID) => {
  const app = new Vue({
    el: '#app',
    data: {
      peerID,
      key,
      simple
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
          simple.addMessage(`Connected to ${theirID}!`)

          client.on('data', function(data) {
            writeMessage(data, simple)
          })
        })
      }, 
      send: function () {
        // Get message and clear input
        const val = document.getElementById('message').value
        document.getElementById('message').value = ''

        // Send message to chatbox unencrypted so we remember what we've said
        simple.addMessage(`Me: ${val}`)

        // Encrypt the message
        const msg = CryptoJS.AES.encrypt(val, key.replace(/\s/g, ''))

        // Send the encrypted message to the peer
        if (rcon) {
          rcon.send(msg.toString())
        } else {
          simple.addMessage(`Oops... You're trying to send a message before connecting to a peer.`)
        }
      }
    }
  })
  
  simple.connect(function(s) { app.simple = s })

  // Connect  
  peer.on('connection', function (conn) {
    // ID of peer connection to us
    pid = conn.peer
    
    conn.on('open', function() {
      rcon = conn
      // Let us know we've made a connection
      simple.addMessage(`New connection from peer: ${pid}`)

      conn.on('data', function(data) {
        writeMessage(data, simple)
      })
    })
  })
  // End Connect
})