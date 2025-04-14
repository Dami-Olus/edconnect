'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Layout from '@/components/Layout';

interface Assignment {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  submissions?: any[];
}

export default function TeacherAssignmentDetailPage() {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assignments/${assignmentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAssignment(res.data);
      } catch (err) {
        console.error('Failed to load assignment', err);
      }
    };

    if (assignmentId) fetchAssignment();
  }, [assignmentId]);

  return (
    <Layout>
      {!assignment ? (
        <p>Loading assignment...</p>
      ) : (
        <div className="max-w-3xl mx-auto py-10">
          <h1 className="text-2xl font-bold mb-2">{assignment.title}</h1>
          <p className="text-gray-700 mb-2">{assignment.description}</p>
          <p className="text-sm text-gray-500">
            Due: {new Date(assignment.dueDate).toLocaleDateString()}
          </p>

          {/* Future: List of student submissions here */}
        </div>
      )}
    </Layout>
  );
}
