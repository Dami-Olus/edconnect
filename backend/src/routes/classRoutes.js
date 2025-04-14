const express = require('express');
const router = express.Router();
const {
  createClass,
  getTeacherClasses,
  updateClass,
  deleteClass,
  addStudentToClass,
  getStudentClasses
} = require('../controllers/classController');
const { protect, allowRoles } = require('../middlewares/authMiddleware');
const Class = require('../models/Class');
const { Upload } = require('@aws-sdk/lib-storage');
const s3Client = require('../config/s3Client');
const multer = require('multer');
const upload = multer({ dest: 'temp/' }); // basic local temp storage
const fs = require('fs');
const path = require('path');

// All routes are protected and only accessible by teachers

router.post('/', protect, allowRoles('teacher'), createClass);
router.get('/', protect, allowRoles('teacher'), getTeacherClasses);


// Student: get all classes they're enrolled in
router.get('/student', protect, allowRoles('student'), getStudentClasses);

router.put('/:id', protect, allowRoles('teacher'), updateClass);
router.delete('/:id', protect, allowRoles('teacher'), deleteClass);
router.post('/:id/add-student', protect, allowRoles('teacher'), addStudentToClass);


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



router.post('/:id/upload-material', protect, allowRoles('teacher'), upload.single('file'), async (req, res) => {
  try {
    const fileStream = fs.createReadStream(req.file.path);
    const fileKey = `materials/${Date.now()}-${req.file.originalname}`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET,
      Key: fileKey,
      Body: fileStream,
      ContentType: req.file.mimetype,
      
    };

    const parallelUpload = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    const result = await parallelUpload.done();

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    // Save the uploaded file URL to the class
    const updated = await Class.findOneAndUpdate(
      { _id: req.params.id, teacher: req.user._id },
      { $push: { materials: result.Location } },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});


module.exports = router;
