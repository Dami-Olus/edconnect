export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <h2 className="text-lg font-bold mb-4">Teacher Panel</h2>
        <ul className="space-y-2">
          <li><a href="/teacher/dashboard">Dashboard</a></li>
          <li><a href="/teacher/classes">My Classes</a></li>
        </ul>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
