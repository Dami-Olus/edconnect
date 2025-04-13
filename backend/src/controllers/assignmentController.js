const Assignment = require('../models/Assignment');
const Class = require('../models/Class');

exports.createAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      class: req.body.classId,
      createdBy: req.user._id,
    });

    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create assignment', error: err.message });
  }
};

exports.getAssignmentsForClass = async (req, res) => {
  try {
    const assignments = await Assignment.find({ class: req.params.id });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch assignments', error: err.message });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    assignment.submissions.push({
      student: req.user._id,
      fileUrl: req.body.fileUrl,
      submittedAt: new Date(),
    });

    await assignment.save();
    res.json({ message: 'Submission successful' });
  } catch (err) {
    res.status(500).json({ message: 'Submission failed', error: err.message });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const submission = assignment.submissions.find(
      (sub) => sub.student.toString() === req.params.studentId
    );

    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.grade = req.body.grade;
    submission.feedback = req.body.feedback;

    await assignment.save();
    res.json({ message: 'Graded successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Grading failed', error: err.message });
  }
};

exports.getStudentAssignments = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find classes the student is enrolled in
    const classes = await Class.find({ students: userId }).select('_id');

    const classIds = classes.map((cls) => cls._id);

    // Fetch assignments for those classes
    const assignments = await Assignment.find({ class: { $in: classIds } })
      .sort({ dueDate: 1 })
      .populate('class', 'title');

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch student assignments', error: err.message });
  }
};

