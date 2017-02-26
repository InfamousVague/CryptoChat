# CryptoChat
CryptoChat uses [PeerJS](http://peerjs.com) to establish a peer 2 peer connection over Web RTC, messages are encrypted before being sent over the p2p network using [CryptoJS](https://www.npmjs.com/package/crypto-js). Messages are decrpyted on the client machine as well using a "block key" which is basically just a secret key. 

To start you'll need someone to talk to, and you'll both need to share your peer ids (something like `8y7jsqn09eoy9zfr`) and your block keys, which look like...

```
eee70241.50a25495.3c816a60
f99d7e04.bac79b64.654f7e40
99234091.9f2bbc61.2f730f73
```

Once you're both ready to start chatting simply hit connect and you're off to the races!

Your messges never hit a server they are being trasmitted from one computer to another via Web RTC; and your messages are encrypted so even if somebody finds a way to intercept the traffic, chances are you're safe!


Demo here: http://rawgit.com/wski/CryptoChat/master/index.html


![http://i.imgur.com/acnGfA6.png](http://rawgit.com/wski/CryptoChat/master/index.html)
