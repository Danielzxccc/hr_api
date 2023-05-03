function generatePassword() {
  const length = 8
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let password = ''
  for (let char of charset) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
    if (password.length === length) break
  }
  return password
}

module.exports = generatePassword
