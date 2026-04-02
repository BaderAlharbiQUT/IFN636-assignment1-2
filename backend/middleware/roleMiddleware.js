const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorised for this action' });
    }
    next();
  };
};

module.exports = authorizeRoles;
