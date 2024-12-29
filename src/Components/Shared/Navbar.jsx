import { Link } from "react-router-dom";
import UserProfile from "../../Pages/UserProfile";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <div className="navbar bg-base-10 font-title shadow-lg  mb-2">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          {user && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow font-semibold"
            >
              <li>
                <Link to="/">All Content</Link>
              </li>
              <li>
                <Link to="/addregularcontent">Write Content</Link>
              </li>
              <li>
                <Link to="/links">Links</Link>
              </li>
              <li>
                <Link to="/businesses">Business</Link>
              </li>
              <li>
                <Link to="/tasks">Tasks</Link>
              </li>
            </ul>
          )}
        </div>
        <Link className="btn btn-ghost text-xl">Logo</Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        {user && (
          <ul className="menu menu-horizontal px-1 font-semibold">
            <li>
              <Link to="/">All Content</Link>
            </li>
            <li>
              <Link to="/addregularcontent">Write Content</Link>
            </li>
            <li>
              <Link to="/links">Links</Link>
            </li>
            <li>
              <Link to="/businesses">Business</Link>
            </li>
            <li>
              <Link to="/tasks">Tasks</Link>
            </li>
          </ul>
        )}
      </div>

      <div className="navbar-end">{user && <UserProfile />}</div>
    </div>
  );
};

export default Navbar;
