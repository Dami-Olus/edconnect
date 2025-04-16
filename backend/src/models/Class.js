const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  materials: [String],
  meetingLink: {
    type: String,
    default: ''
  },
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
