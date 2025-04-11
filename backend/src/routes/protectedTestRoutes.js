const express = require('express');
const router = express.Router();
const { protect, allowRoles } = require('../middlewares/authMiddleware');

// Test route accessible to all authenticated users
router.get('/me', protect, (req, res) => {
  res.json(req.user);
});

// Route only for teachers
router.get('/teacher-only', protect, allowRoles('teacher'), (req, res) => {
  res.json({ message: 'Welcome, teacher!' });
});

module.exports = router;
