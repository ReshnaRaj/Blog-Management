import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/slice/authSlice";
import { useState, useRef, useEffect } from "react";

const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-white/80 backdrop-blur-md shadow-sm w-full">
      <Link to="/">
        <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
          InkSpire
        </h1>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-2 sm:gap-4">
        {user ? (
          <>
            <button
              className="px-2 sm:px-3 py-1 rounded bg-blue-100 text-blue-700 text-sm sm:text-base font-medium hover:bg-blue-200 transition"
              onClick={() => navigate("/my-blogs")}
            >
              My Blogs
            </button>
            <div className="relative" ref={dropdownRef}>
              <button
                className="font-medium text-gray-700 px-2 sm:px-3 py-1 rounded hover:bg-gray-100 transition text-sm sm:text-base"
                onClick={() => setDropdownOpen((open) => !open)}
              >
                Hello, {user.name}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-28 sm:w-32 bg-white border rounded shadow-lg z-50">
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm sm:text-base"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="font-medium hover:underline text-sm sm:text-base"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="font-medium hover:underline text-sm sm:text-base"
            >
              Signup
            </Link>
          </>
        )}
      </div>
      {/* Hamburger for mobile/tablet */}
      <div className="md:hidden flex items-center">
        <button
          className="p-2 rounded hover:bg-gray-200 transition"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="absolute top-16 right-3 w-44 bg-white border rounded shadow-lg z-50 flex flex-col py-2 animate-fade-in"
          >
            {user ? (
              <>
                <button
                  className="px-4 py-2 text-left text-blue-700 font-medium hover:bg-blue-50"
                  onClick={() => {
                    navigate("/myblogs");
                    setMobileMenuOpen(false);
                  }}
                >
                  My Blogs
                </button>
                <button
                  className="px-4 py-2 text-left text-gray-700 font-medium hover:bg-gray-100"
                  onClick={() => setDropdownOpen((open) => !open)}
                >
                  Hello, {user.name}
                </button>
                <button
                  className="px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-left font-medium hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-left font-medium hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
