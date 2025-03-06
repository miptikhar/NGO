const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth_middleware');

router.get('/count-users', authMiddleware, userController.countUsersWithRoleUser);
router.post('/add-member-info', authMiddleware, userController.addMemberInfo);
router.get('/get-member-info', authMiddleware, userController.getMemberInfo);
router.post('/create-project', authMiddleware, userController.createProject);
router.get('/get-projects', authMiddleware, userController.getProjects);
router.get('/get-project-by-id/:id', authMiddleware, userController.getProjectById);
router.post('/user-filter-projects', authMiddleware, userController.userFilterProjects);
router.delete('/:id', authMiddleware, userController.deleteProject);

module.exports = router;
