const express = require('express');
const router = express.Router();
const User = require('../modules/user');
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv');
const generateToken = require('../middleware/generateToken')
dotenv.config();
const passport = require('passport');




router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existUser = await User.findOne({ email });

        if (existUser) {
            return res.status(400).json({ message: 'User already exists' });
        }


        const newSalt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(password, newSalt)


        const newUser = new User({ name, email, password: hashPassword });
        await newUser.save();

        const {auth_token} = await generateToken(newUser)        

        res.status(201).json({ message: 'User registered successfully',  auth_token});
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
})








router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existUser = await User.findOne({ email });

        if (!existUser) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, existUser.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid' });
        }

        const {auth_token} = await generateToken(existUser)        

        res.status(200).json({ message: 'Login successful', auth_token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
})





router.get('/profile', passport.authenticate('jwt', {session:false}), async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existUser = await User.findOne({ email });

        if (!existUser) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        res.status(200).json({
            name: existUser.name,
            email: existUser.email
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
})



















module.exports = router;
