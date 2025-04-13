const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getAssignmentsForClass,
  submitAssignment,
  gradeSubmission,
} = require('../controllers/assignmentController');
const { protect, allowRoles } = require('../middlewares/authMiddleware');

// Teacher creates assignment
router.post('/', protect, allowRoles('teacher'), createAssignment);

const { getStudentAssignments } = require('../controllers/assignmentController');

// Student: get their own assignments
router.get('/student', protect, allowRoles('student'), getStudentAssignments);


// Get assignments for a class
router.get('/class/:id', protect, getAssignmentsForClass);

// Student submits assignment
router.post('/:id/submit', protect, allowRoles('student'), submitAssignment);

// Teacher grades a student
router.put('/:assignmentId/grade/:studentId', protect, allowRoles('teacher'), gradeSubmission);

module.exports = router;
