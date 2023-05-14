const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req,res,next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            //get token from header
            token = req.headers.authorization.split(' ')[1];

            //verify token
            const decoded = jwt.verify(token,"manish");

            //get user from the token
            req.user = await User.findById(decoded.userId).select("-password");
            
            next()
        } catch (error) {
            console.error(error)
            res.status(401).json({ message: 'Authentication failed' });   
        }
    }
    if(!token){
        res.status(401).json({message:'No authorized, no token'})
    }
}


module.exports = auth