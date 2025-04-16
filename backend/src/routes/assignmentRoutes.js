const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getAssignmentsForClass,
  submitAssignment,
  gradeSubmission,
  getStudentAssignments,
  getAssignmentById,
  getAssignmentWithSubmissions,
} = require('../controllers/assignmentController');
const { protect, allowRoles } = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'temp/' });
const generatePresignedUrl = require('../utils/generatePresignedUrl');

// Teacher creates assignment
router.post('/', protect, allowRoles('teacher'), createAssignment);

// Student: get their own assignments
router.get('/student', protect, allowRoles('student'), getStudentAssignments);

router.get('/:assignmentId/submissions', protect, allowRoles('teacher'), getAssignmentWithSubmissions);


// Get assignments for a class
router.get('/class/:id', protect, getAssignmentsForClass);

// ✅ Student submits assignment (file upload)
router.post('/:id/submit', protect, allowRoles('student'), upload.single('file'), submitAssignment);

// Teacher grades a student
router.put('/:assignmentId/grade/:studentId', protect, allowRoles('teacher'), gradeSubmission);

// Get individual assignment by ID
router.get('/:id', protect, getAssignmentById);

// Teacher views assignment with submissions
router.get('/:assignmentId', protect, allowRoles('teacher'), getAssignmentWithSubmissions);


router.get('/:assignmentId/presigned-url/:key', protect, async (req, res) => {
  try {
    const key = decodeURIComponent(req.params.key);
    const url = await generatePresignedUrl(key);
    res.json({ url });
  } catch (err) {
    console.error('Presigned URL error:', err);
    res.status(500).json({ message: 'Failed to generate pre-signed URL' });
  }
});


module.exports = router;
