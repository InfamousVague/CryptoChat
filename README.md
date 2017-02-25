# CryptoChat
CryptoChat uses [PeerJS](http://peerjs.com) to establish a peer 2 peer connection over Web RTC, messages are encrypted before being sent over the p2p network using [CryptoJS](https://www.npmjs.com/package/crypto-js). Messages are decrpyted on the client machine as well using a "block key" which is basically just a secret key. 

Demo here: http://rawgit.com/wski/CryptoChat/master/index.html
