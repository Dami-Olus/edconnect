const express = require('express');
const router = express.Router();
const { protect, allowRoles } = require('../middlewares/authMiddleware');

router.get('/all-users', protect, (req, res) => {
  res.json({ message: `Welcome ${req.user.role}` });
});

router.get('/teacher-dashboard', protect, allowRoles('teacher'), (req, res) => {
  res.json({ message: 'Welcome, Teacher! Your dashboard is ready.' });
});

router.get('/student-dashboard', protect, allowRoles('student'), (req, res) => {
  res.json({ message: 'Welcome, Student! Let’s start learning.' });
});

module.exports = router;
