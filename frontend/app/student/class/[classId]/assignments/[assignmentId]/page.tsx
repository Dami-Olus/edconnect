'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Layout from '@/components/Layout';
import Button from '@/components/Button';

interface Assignment {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  file?: string;
}

export default function StudentAssignmentDetailPage() {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
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
        console.error('Failed to fetch assignment', err);
      }
    };

    if (assignmentId) fetchAssignment();
  }, [assignmentId]);

  const handleUpload = async () => {
    if (!selectedFile) return;

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
      alert('Submission uploaded!');
    } catch (err) {
      console.error('Upload failed', err);
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
          <p className="text-gray-700 mb-2">{assignment.description}</p>
          <p className="text-sm text-gray-500 mb-4">
            Due: {new Date(assignment.dueDate).toDateString()}
          </p>

          {assignment.file && (
            <a
              href={assignment.file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline mb-6 inline-block"
            >
              Download Assignment File
            </a>
          )}

          <div className="mt-6">
            <h2 className="font-semibold text-lg mb-2">Submit your work</h2>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="mb-4"
            />
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Submit Assignment'}
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
}