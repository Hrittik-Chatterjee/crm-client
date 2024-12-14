import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100">
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
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link> All Content</Link>
              <ul className="p-2">
                <li>
                  <Link> Regular Content </Link>
                </li>
                <li>
                  <Link> Special Content</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link> Write Content</Link>
              <ul className="p-2">
                <li>
                  <Link> Regular Content </Link>
                </li>
                <li>
                  <Link> Special Content</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link> Item 1</Link>
            </li>
            <li>
              <Link> Item 3</Link>
            </li>
          </ul>
        </div>
        <Link className="btn btn-ghost text-xl">daisyUI</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <details>
              <summary>All Content</summary>
              <ul className="p-2">
                <li>
                  <Link> Regular Content</Link>
                </li>
                <li>
                  <Link> Special Content</Link>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <details>
              <summary>Write Content</summary>
              <ul className="p-2">
                <li>
                  <Link to="/addregularcontent"> Regular Content </Link>
                </li>
                <li>
                  <Link to="/addspecialcontent"> Special Content</Link>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <Link to="/links">Links</Link>
          </li>
          <li>
            <Link to="/businesses"> Business</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <Link className="btn">Button</Link>
      </div>
    </div>
  );
};

export default Navbar;
