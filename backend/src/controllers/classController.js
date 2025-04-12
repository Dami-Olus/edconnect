const Class = require('../models/Class');

// POST /api/classes
exports.createClass = async (req, res) => {
  try {
    const newClass = await Class.create({
      title: req.body.title,
      description: req.body.description,
      teacher: req.user._id,
    });
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create class', error: err.message });
  }
};

// GET /api/classes
exports.getTeacherClasses = async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.user._id });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch classes' });
  }
};

// PUT /api/classes/:id
exports.updateClass = async (req, res) => {
  try {
    const updated = await Class.findOneAndUpdate(
      { _id: req.params.id, teacher: req.user._id },
      { title: req.body.title, description: req.body.description },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Class not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

// DELETE /api/classes/:id
exports.deleteClass = async (req, res) => {
  try {
    const deleted = await Class.findOneAndDelete({ _id: req.params.id, teacher: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Class not found' });
    res.json({ message: 'Class deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed' });
  }
};

// POST /api/classes/:id/add-student
exports.addStudentToClass = async (req, res) => {
  try {
    const updated = await Class.findOneAndUpdate(
      { _id: req.params.id, teacher: req.user._id },
      { $addToSet: { students: req.body.studentId } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Class not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add student', error: err.message });
  }
};
