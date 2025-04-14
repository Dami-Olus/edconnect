export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">EdConnect</h1>
        <button
          className="text-sm text-red-600 hover:underline"
          onClick={() => {
            localStorage.removeItem("token");
            location.href = "/login";
          }}
        >
          Logout
        </button>
      </header>
      <main className="p-6 max-w-6xl mx-auto">{children}</main>
    </div>
  );
}