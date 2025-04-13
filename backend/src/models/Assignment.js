const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Teacher
  submissions: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      fileUrl: String,
      grade: Number,
      feedback: String,
      submittedAt: Date,
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Assignment', assignmentSchema);