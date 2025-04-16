const express = require('express');
const router = express.Router();
const { protect, allowRoles } = require('../middlewares/authMiddleware');
const { getTeacherDashboardStats } = require('../controllers/teacherController');

router.get('/dashboard', protect, allowRoles('teacher'), getTeacherDashboardStats);

module.exports = router;
