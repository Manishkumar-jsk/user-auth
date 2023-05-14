const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware")

//SIGNUP USER

router.post("/register", async (req,res) => {
    try {
        //generate new password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);

        //create new user
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword,
        });

        //save user
        const user = await newUser.save();
        if(user) {
            res.status(201).json({
                _id:user.id,
                name:user.username,
                email:user.email,
                token:generateToken(user._id)
            })
        } else {
            res.status(400).json({message:'Invalid user data'})
        }

    } catch (error) {
        res.status(500).json(error)
    }
})

//LOGIN USER

router.post('/login', async(req,res) => {
    try {
        const {email,password} = req.body;

        //check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        //compare password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create and send JWT token
        const token = generateToken(user._id);
            res.status(200).json({ token });
        } 
    catch (error) {
        console.error(error);
        res.status(500).json({message:'Internal server error'})    
    }
})

router.get("/user",authMiddleware, async (req,res) => {
    try {
        const {userId} = req.body;
        const user = await User.findById(userId).select('-password');
        res.status(200).json(user)
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Internal server error'})
    }
})

const generateToken = (id) => {
    return jwt.sign({ id },"manish", {
      expiresIn: '30d',
    })
  }


module.exports = router