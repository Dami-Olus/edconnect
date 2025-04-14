const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getAssignmentsForClass,
  submitAssignment,
  gradeSubmission,
  getStudentAssignments,
  getAssignmentById,
} = require('../controllers/assignmentController');
const { protect, allowRoles } = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'temp/' });

// Teacher creates assignment
router.post('/', protect, allowRoles('teacher'), createAssignment);

// Student: get their own assignments
router.get('/student', protect, allowRoles('student'), getStudentAssignments);

// Get assignments for a class
router.get('/class/:id', protect, getAssignmentsForClass);

// ✅ Student submits assignment (file upload)
router.post('/:id/submit', protect, allowRoles('student'), upload.single('file'), submitAssignment);

// Teacher grades a student
router.put('/:assignmentId/grade/:studentId', protect, allowRoles('teacher'), gradeSubmission);

// Get individual assignment by ID
router.get('/:id', protect, getAssignmentById);


module.exports = router;
