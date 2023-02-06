function requireSession(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized: No session found' })
  }
  next()
}
module.exports = { requireSession }
