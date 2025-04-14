'use client';

import Layout from '@/components/Layout';
import { useState } from 'react';
import StudentAssignments from '@/components/StudentAssignments';
import StudentClasses from '@/components/StudentClasses';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('assignments');

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
        <div className="flex gap-6 border-b mb-4">
          {['classes', 'assignments', 'live', 'grades'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 border-b-2 capitalize text-sm font-medium transition-colors duration-200 ${
                activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div>
        {activeTab === 'assignments' && <StudentAssignments />}
        {activeTab === 'classes' && <StudentClasses />}
        {activeTab === 'live' && <p className="text-gray-600">🎥 Live class links will go here</p>}
        {activeTab === 'grades' && <p className="text-gray-600">📊 Gradebook and feedback here</p>}
      </div>
    </Layout>
  );
}
