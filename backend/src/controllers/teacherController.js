const Class = require('../models/Class');
const Assignment = require('../models/Assignment');
const User = require('../models/User');

exports.getTeacherDashboardStats = async (req, res) => {
  try {
    const teacherId = req.user._id;

    const [classCount, assignmentCount, studentCount] = await Promise.all([
      Class.countDocuments({ teacher: teacherId }),
      Assignment.countDocuments({ createdBy: teacherId }),
      Class.aggregate([
        { $match: { teacher: teacherId } },
        { $unwind: '$students' },
        { $group: { _id: '$students' } },
        { $count: 'total' }
      ]),
    ]);

    res.json({
      classes: classCount,
      assignments: assignmentCount,
      students: studentCount[0]?.total || 0,
      programs: 0, // Placeholder for future implementation
    });
  } catch (err) {
    console.error('Dashboard stats error:', err.message);
    res.status(500).json({ message: 'Failed to load teacher dashboard stats' });
  }
};
