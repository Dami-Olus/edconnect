const express = require('express');
const router = express.Router();
const {
  createClass,
  getTeacherClasses,
  updateClass,
  deleteClass,
  addStudentToClass
} = require('../controllers/classController');
const { protect, allowRoles } = require('../middlewares/authMiddleware');

// All routes are protected and only accessible by teachers
router.use(protect, allowRoles('teacher'));

router.post('/', createClass);                  // POST: Create a new class
router.get('/', getTeacherClasses);             // GET: Fetch teacher's classes
router.put('/:id', updateClass);                // PUT: Update class details
router.delete('/:id', deleteClass);             // DELETE: Remove class
router.post('/:id/add-student', addStudentToClass); // POST: Add a student

module.exports = router;
