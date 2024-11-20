// Middleware for role-based access control
exports.checkRole = (roles) => {
    return (req, res, next) => {
      const { role } = req.user;  // assuming the JWT is decoded and stored in req.user
  
      if (!roles.includes(role)) {
        return res.status(403).json({ message: "Access forbidden: insufficient rights" });
      }
  
      next();
    };
  };