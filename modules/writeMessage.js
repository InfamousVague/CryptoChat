const chatBox = document.getElementById('chat')

// Adds a message to the chatbox
const writeMessage = function(msg, sim) {
  const decrypted = CryptoJS.AES.decrypt(msg, theirBlockKey.replace(/\s/g, ''))

  if (decrypted.toString(CryptoJS.enc.Utf8)) {
    sim.addMessage(`${pid}: ${decrypted.toString(CryptoJS.enc.Utf8)}`)
  } else {
    sim.addMessage(`${pid}: ${msg}`)
  }

  // Automatically scroll to bottom of div
  chatBox.scrollTop = chatBox.scrollHeight;
}