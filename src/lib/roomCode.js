const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

const generateRoomCode = (length = 6) => {
  let code = ''
  for (let i = 0; i < length; i += 1) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  }
  return code
}

export { generateRoomCode }
