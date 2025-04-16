const fs = require('fs');
const { Upload } = require('@aws-sdk/lib-storage');
const s3Client = require('../config/s3Client');
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

    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const fileStream = fs.createReadStream(file.path);
    const fileKey = `submissions/${Date.now()}-${file.originalname}`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET,
      Key: fileKey,
      Body: fileStream,
      ContentType: file.mimetype,
    };

    const parallelUpload = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    const result = await parallelUpload.done();
    fs.unlinkSync(file.path); // cleanup temp

    assignment.submissions.push({
      student: req.user._id,
      fileUrl: result.Location,
      submittedAt: new Date(),
    });

    await assignment.save();

    res.status(201).json({ message: 'Submission successful', fileUrl: result.Location });
  } catch (err) {
    console.error('Submit assignment error:', err.message);
    res.status(500).json({ message: 'Submission failed', error: err.message });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    console.log('Grade route hit');
    console.log('Params:', req.params);
    console.log('Body:', req.body);
    
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

    // Fetch assignments and filter student's own submission
    const assignments = await Assignment.find({ class: { $in: classIds } })
      .sort({ dueDate: 1 })
      .populate('class', 'title')
      .lean(); // lean to manipulate objects easily

    // Map through each assignment and attach the student's own submission
    const assignmentsWithStudentSubmission = assignments.map((assignment) => {
      const studentSubmission = assignment.submissions?.find(
        (sub) => sub.student?.toString() === userId.toString()
      );

      return {
        ...assignment,
        mySubmission: studentSubmission || null,
      };
    });

    res.json(assignmentsWithStudentSubmission);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch student assignments', error: err.message });
  }
};


exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('submissions.student', 'name email'); ;
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching assignment', error: err.message });
  }
};

exports.getAssignmentWithSubmissions = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId)
  .populate('submissions.student', 'name email'); 

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch assignment', error: err.message });
  }
};