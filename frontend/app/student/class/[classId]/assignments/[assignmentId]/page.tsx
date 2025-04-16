'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Layout from '@/components/Layout';
import Button from '@/components/Button';

interface Submission {
  fileUrl: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
}

interface Assignment {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  file?: string;
  mySubmission?: Submission;
}

export default function StudentAssignmentDetailPage() {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Fetch assignment details (with student submission)
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
        console.error('Failed to fetch assignment', err);
      }
    };

    if (assignmentId) fetchAssignment();
  }, [assignmentId]);

  const handleUpload = async () => {
    if (!selectedFile) return alert('Please select a file');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assignments/${assignmentId}/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('Submission uploaded successfully!');
      setSelectedFile(null);
      window.location.reload(); // Refresh to refetch and show submission status
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      {!assignment ? (
        <p>Loading assignment...</p>
      ) : (
        <div className="max-w-3xl mx-auto py-8">
          <h1 className="text-2xl font-bold mb-2">{assignment.title}</h1>
          {assignment.description && (
            <p className="text-gray-700 mb-2">{assignment.description}</p>
          )}
          <p className="text-sm text-gray-500 mb-4">
            Due: {new Date(assignment.dueDate).toLocaleDateString()}
          </p>

          {assignment.file && (
            <a
              href={assignment.file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline mb-6 inline-block"
            >
              📄 Download Assignment File
            </a>
          )}

          <div className="mt-6 space-y-4">
            <h2 className="font-semibold text-lg">Submit your work</h2>

            {assignment.mySubmission ? (
              <div className="border p-4 rounded bg-green-50">
                <p className="text-green-700 font-semibold mb-2">✅ Submission received</p>
                <p className="text-sm">Submitted at: {new Date(assignment.mySubmission.submittedAt).toLocaleString()}</p>
                <p className="text-sm">
                  File: <a href={assignment.mySubmission.fileUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">View</a>
                </p>
                {assignment.mySubmission.grade !== undefined ? (
                  <p className="text-sm mt-2 text-blue-700">Grade: {assignment.mySubmission.grade} / Feedback: {assignment.mySubmission.feedback}</p>
                ) : (
                  <p className="text-sm text-yellow-600 mt-2">Awaiting grading</p>
                )}
              </div>
            ) : (
              <>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="mb-2"
                />
                <Button onClick={handleUpload} disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Submit Assignment'}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
