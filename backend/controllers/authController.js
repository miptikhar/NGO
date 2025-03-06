const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    console.log(username, password);

    try {
        const user = await User.findOne({ username }); 
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15d' });
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
  loginUser,
};
