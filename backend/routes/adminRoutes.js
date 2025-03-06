const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/count-users', userController.countUsersWithRoleUser); 
router.get('/get-all-projects', userController.getAllProjects);
router.post('/filter-projects', userController.filterProjects);
router.get('/get-all-organizations', userController.getAllOrganizations);

module.exports = router;
