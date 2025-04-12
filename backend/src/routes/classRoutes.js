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
const upload = require('../middlewares/uploadMiddleware');

// All routes are protected and only accessible by teachers
router.use(protect, allowRoles('teacher'));

router.post('/', createClass);                  // POST: Create a new class
router.get('/', getTeacherClasses);             // GET: Fetch teacher's classes
router.put('/:id', updateClass);                // PUT: Update class details
router.delete('/:id', deleteClass);             // DELETE: Remove class
router.post('/:id/add-student', addStudentToClass); // POST: Add a student

router.get('/:id', async (req, res) => {

  try {
    const singleClass = await Class.findById(req.params.id)
    .populate('students', 'name email');
    if (!singleClass) return res.status(404).json({ message: 'Class not found' });
    res.json(singleClass);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching class', error: err.message });
  }
});

router.post('/:id/remove-student', async (req, res) => {
  const { studentId } = req.body;

  try {
    const updated = await Class.findOneAndUpdate(
      { _id: req.params.id, teacher: req.user._id },
      { $pull: { students: studentId } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Class not found or unauthorized' });

    res.json(updated);
  } catch (err) {
    console.error('Remove student error:', err.message);
    res.status(500).json({ message: 'Failed to remove student' });
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



router.post(
  '/:id/upload-material',
  protect,
  allowRoles('teacher'),
  upload.single('file'),
  async (req, res) => {
    try {
      const updated = await Class.findOneAndUpdate(
        { _id: req.params.id, teacher: req.user._id },
        { $push: { materials: req.file.location } },
        { new: true }
      );
      res.json(updated);
    } catch (err) {
      console.error('Upload error:', err.message);
      res.status(500).json({ message: 'Upload failed' });
    }
  }
);


module.exports = router;
