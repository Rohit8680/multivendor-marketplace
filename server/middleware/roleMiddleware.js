const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${req.user ? req.user.role : 'Guest'}' is not authorized to access this route`
      });
    }
    next();
  };
};

const authorizeApprovedSeller = (req, res, next) => {
  if (req.user.role !== 'SELLER') {
    return res.status(403).json({ message: 'Only sellers can access this route' });
  }

  if (req.user.sellerStatus !== 'APPROVED') {
    return res.status(403).json({
      message: `Your seller account status is '${req.user.sellerStatus}'. You must be APPROVED by Admin to perform this action.`
    });
  }

  next();
};

module.exports = { authorize, authorizeApprovedSeller };
