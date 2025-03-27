module.exports = function (user) {
  return {
    id: user.id,
    email: user.email,
    roleId: user.role
  }
}
