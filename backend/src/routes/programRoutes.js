const express = require('express');
const router = express.Router();
const Program = require('../models/Program');
const { protect, allowRoles } = require('../middlewares/authMiddleware');

// Create Program
router.post('/', protect, allowRoles('teacher'), async (req, res) => {
  try {
    const program = await Program.create({
      title: req.body.title,
      description: req.body.description,
      teacher: req.user._id,
    });
    res.status(201).json(program);
  } catch (err) {
    res.status(500).json({ message: 'Program creation failed', error: err.message });
  }
});

// Get Programs for a Teacher
router.get('/', protect, allowRoles('teacher'), async (req, res) => {
  try {
    const programs = await Program.find({ teacher: req.user._id });
    res.json(programs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch programs', error: err.message });
  }
});

// Enroll Student
router.post('/:id/enroll', protect, allowRoles('teacher'), async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { students: req.body.studentId } },
      { new: true }
    );
    res.json(program);
  } catch (err) {
    res.status(500).json({ message: 'Enrollment failed', error: err.message });
  }
});

module.exports = router;
