import { CiUser } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const UserProfile = () => {
  const { logout } = useAuth();

  const handleLogOut = () => {
    logout();
  };
  return (
    <div className="flex">
      <h1 className="mr-4">Team Platinam</h1>

      <div className="dropdown dropdown-bottom dropdown-end">
        <div tabIndex={0} role="button">
          <CiUser className="font-bold text-xl" />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          <li>
            <Link to="/settings">Settings</Link>
          </li>
          <li>
            <Link to="admin">Admin Dashboard</Link>
          </li>
          <li>
            <Link onClick={handleLogOut} to="/logout">
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserProfile;
