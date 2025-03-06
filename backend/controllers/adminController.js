// user controller 
const User = require('../models/User'); 
const Project = require('../models/Projects');

// New function to count users with role 'user'
const countUsersWithRoleUser = async (req, res) => {
    try {
        const count = await User.countDocuments({ role: 'user' });
        const humanitarianRecords = await Project.find({ type: 'Humanitarian' });
        const developmentRecords = await Project.find({ type: 'Development' });
        
        const humanitarianCount = humanitarianRecords.length;
        const developmentCount = developmentRecords.length; 
        console.log(humanitarianCount, developmentCount);
        
        res.status(200).json({  count, humanitarianCount, developmentCount });
    } catch (error) {
        res.status(500).json({ message: 'Error counting users', error });
    }
}; 

module.exports = {
    countUsersWithRoleUser,
}; 