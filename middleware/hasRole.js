module.exports = function (roles) {
  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      res.status(403).send('Access Denied')
    } else {
      next()
    }
  }
}
