import { Link, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-200">
        <div className="p-4 text-lg font-semibold">Admin Dashboard</div>
        <nav className="mt-4 bg-gray-800 text-white p-4 rounded-lg shadow-md">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="block px-4 py-2 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-purple-500"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="createuser"
                className="block px-4 py-2 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-purple-500"
              >
                Create User
              </Link>
            </li>
            <li>
              <Link
                to="addbusiness"
                className="block px-4 py-2 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-purple-500"
              >
                Add Business
              </Link>
            </li>
            <li>
              <Link
                to="editbusiness"
                className="block px-4 py-2 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-purple-500"
              >
                View Business
              </Link>
            </li>
            <li>
              <Link
                to="users"
                className="block px-4 py-2 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-purple-500"
              >
                View Users
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="block px-4 py-2 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-purple-500"
              >
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
