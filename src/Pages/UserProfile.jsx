import { CiUser } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const UserProfile = () => {
  const { logout, user } = useAuth();
  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleLogOut = () => {
    logout();
  };
  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <div tabIndex={0} role="button" className="flex">
        <h1 className="mr-4 font-semibold font-title">
          {user?.username ? capitalizeWords(user.username) : ""}
        </h1>

        <div>
          <div>
            <CiUser className="font-bolder text-2xl font-title" />
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
    </div>
  );
};

export default UserProfile;
