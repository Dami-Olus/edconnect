const Class = require("../models/Class");
const User = require("../models/User");
const mongoose = require("mongoose");

// POST /api/classes
exports.createClass = async (req, res) => {
  try {
    const newClass = await Class.create({
      title: req.body.title,
      description: req.body.description,
      teacher: req.user._id,
      meetingLink: `https://meet.jit.si/gec-class-${Date.now()}`,
    });
    res.status(201).json(newClass);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create class", error: err.message });
  }
};

// GET /api/classes
exports.getTeacherClasses = async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.user._id });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch classes" });
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
    if (!updated) return res.status(404).json({ message: "Class not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// DELETE /api/classes/:id
exports.deleteClass = async (req, res) => {
  try {
    const deleted = await Class.findOneAndDelete({
      _id: req.params.id,
      teacher: req.user._id,
    });
    if (!deleted) return res.status(404).json({ message: "Class not found" });
    res.json({ message: "Class deleted" });
  } catch (err) {
    res.status(500).json({ message: "Deletion failed" });
  }
};

// POST /api/classes/:id/add-student
exports.addStudentToClass = async (req, res) => {
  const { studentIdOrEmail } = req.body;
  console.log("Received:", studentIdOrEmail);

  try {
    let student;

    if (mongoose.Types.ObjectId.isValid(studentIdOrEmail)) {
      student = await User.findOne({
        _id: studentIdOrEmail,
        role: "student",
      });
    }

    // If no student found by _id, or input is not ObjectId, try email
    if (!student) {
      student = await User.findOne({
        email: studentIdOrEmail,
        role: "student",
      });
    }

    if (!student) {
      console.log("Student not found");
      return res.status(404).json({ message: "Student not found" });
    }

    const updated = await Class.findOneAndUpdate(
      { _id: req.params.id, teacher: req.user._id },
      { $addToSet: { students: student._id } },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Class not found or unauthorized" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Add student error:", err.message);
    res.status(500).json({ message: "Failed to add student" });
  }
};

exports.getStudentClasses = async (req, res) => {
  try {
    const classes = await Class.find({ students: req.user._id }).populate(
      "teacher",
      "name email"
    );
    res.json(classes);
    console.log(classes);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch student classes", error: err.message });
  }
};
