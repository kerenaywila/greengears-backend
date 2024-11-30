const Farmer = require('../models/users');

// Middleware to verify JWT token
const jwt = require('jsonwebtoken');
const Farmer = require('../models/users');
const Admin = require('../models/admin')

exports.verifyToken = async (req, res, next)=>{
    try {
           
        const tk = req.header("Authorization")

        if(!tk){
            return res.status(401).json({message: "Access Denied!"})
        }

        const tkk = tk.split(" ")
    
        const token = tkk[1]
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({message: "Invalid Login details"})
        }

        const user = await Farmer.findOne({email: decoded.user.email})

        if(!user){
            return res.status(404).json({message: "User account not found!"})
        }
    
        req.user = user

        next();
          
        
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
    
};

    // Middleware to check if the user is an Admin
exports.isAdmin = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Access Denied." });
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access Forbidden. Admins only." });
  
    next();
  };