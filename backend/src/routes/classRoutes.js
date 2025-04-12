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
const Class = require('../models/Class');


// All routes are protected and only accessible by teachers
router.use(protect, allowRoles('teacher'));

router.post('/', createClass);                  // POST: Create a new class
router.get('/', getTeacherClasses);             // GET: Fetch teacher's classes
router.put('/:id', updateClass);                // PUT: Update class details
router.delete('/:id', deleteClass);             // DELETE: Remove class
router.post('/:id/add-student', addStudentToClass); // POST: Add a student

router.get('/:id', async (req, res) => {
  try {
    const singleClass = await Class.findOne({
      _id: req.params.id,
      teacher: req.user._id,
    });
    if (!singleClass) return res.status(404).json({ message: 'Class not found' });
    res.json(singleClass);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching class', error: err.message });
  }
});

// router.get('/:id', protect, allowRoles('teacher'), async (req, res) => {
//   try {
//     const classItem = await Class.findById(req.params.id);
//     if (!classItem) return res.status(404).json({ message: 'Class not found' });

//     res.json(classItem);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching class', error: err.message });
//   }
// });



module.exports = router;
