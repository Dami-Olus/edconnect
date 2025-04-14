'use client';

import Layout from '@/components/Layout';

export default function TeacherDashboardPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Welcome to your Dashboard</h1>
        <p className="text-gray-700">
          This is your command center. Manage your classes, students, and materials.
        </p>
      </div>
    </Layout>
  );
}