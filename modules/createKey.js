const createKey = function (blocksize) {
	let key = ''
  for (let i = 0; i < blocksize; i++) {
  	for (let i = 0; i < blocksize; i++) {
    	key += `${rnd()}${rnd()}`
    	if (i < blocksize - 1) key += '.'
    }
    key += '\n'
  }
  return key
}
