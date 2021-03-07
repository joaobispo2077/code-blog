module.exports = (roles) => (req, res, next) => {
  req.user.role = "subscriber";
  if (!(roles.includes(req.user.role))) console.log('Blocked');

  next();
}