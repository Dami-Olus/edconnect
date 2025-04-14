// --- File: app/teacher/class/[classId]/page.tsx ---
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Layout from '@/components/Layout';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Link from 'next/link';

interface Student {
  _id: string;
  name: string;
  email: string;
}

interface ClassType {
  _id: string;
  title: string;
  description: string;
  meetingLink?: string;
  students: Student[];
  materials: string[];
}

export default function TeacherClassDetailPage() {
  const { classId } = useParams();
  const [classInfo, setClassInfo] = useState<ClassType | null>(null);
  const [loading, setLoading] = useState(true);
  const [studentIdOrEmail, setStudentIdOrEmail] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/classes/${classId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClassInfo(res.data);
      } catch (err) {
        console.error('Failed to load class info', err);
      } finally {
        setLoading(false);
      }
    };
    if (classId) fetchClass();
  }, [classId]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      setUploading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/classes/${classId}/upload-material`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setClassInfo((prev) => prev ? { ...prev, materials: res.data.materials } : prev);
      setSelectedFile(null);
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddStudent = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/classes/${classId}/add-student`,
        { studentIdOrEmail },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFeedback('Student added successfully!');
      setStudentIdOrEmail('');
      setClassInfo((prev) => prev ? { ...prev, students: [...prev.students, res.data] } : prev);
    } catch (err: any) {
      setFeedback(err.response?.data?.message || 'Failed to add student.');
    }
  };

  return (
    <Layout>
      {loading ? (
        <p>Loading...</p>
      ) : !classInfo ? (
        <p>Class not found.</p>
      ) : (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">{classInfo.title}</h1>
          <p className="text-gray-700 mb-4">{classInfo.description}</p>

          <Link
            href={`/teacher/class/${classId}/assignments`}
            className="inline-block mb-4 text-blue-600 underline hover:text-blue-800"
          >
            View Assignments
          </Link>

          <div className="my-6 space-y-2">
            <h2 className="text-lg font-semibold">Upload Material</h2>
            <input
              type="file"
              accept="application/pdf,image/*,video/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="border p-2 rounded w-full"
            />
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Material'}
            </Button>
          </div>

          <div className="my-6">
            <h2 className="text-lg font-semibold mb-2">Add Student</h2>
            <Input
              type="text"
              placeholder="Student ID or email"
              value={studentIdOrEmail}
              onChange={(e) => setStudentIdOrEmail(e.target.value)}
            />
            <Button onClick={handleAddStudent}>Add Student</Button>
            {feedback && <p className="text-sm text-gray-700 mt-1">{feedback}</p>}
          </div>

          <h2 className="text-lg font-semibold mt-6 mb-2">Students</h2>
          <ul className="space-y-2">
            {classInfo.students.map((student) => (
              <li key={student._id} className="border p-3 rounded">
                <p className="font-semibold">{student.name}</p>
                <p className="text-sm text-gray-500">{student.email}</p>
              </li>
            ))}
          </ul>

          <h2 className="text-lg font-semibold mt-6 mb-2">Uploaded Materials</h2>
          <ul className="space-y-2">
            {classInfo.materials.map((url, index) => (
              <li key={index} className="flex justify-between items-center border p-3 rounded">
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Preview
                </a>
                <a href={url} download className="text-sm text-gray-600 hover:underline">
                  Download
                </a>
              </li>
            ))}
          </ul>

          <h2 className="text-lg font-semibold mt-6 mb-2">Live Class</h2>
          {classInfo.meetingLink ? (
            <iframe
              src={classInfo.meetingLink}
              allow="camera; microphone; fullscreen; display-capture"
              width="100%"
              height="500"
              className="rounded border"
              title="Live Class"
            />
          ) : (
            <p className="italic text-gray-500">No meeting link available.</p>
          )}
        </div>
      )}
    </Layout>
  );
}
