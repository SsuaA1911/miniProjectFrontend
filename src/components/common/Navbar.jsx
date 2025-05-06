import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-amber-300 shadow-md px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link
          to={user ? "/dashboard" : "/"}
          className="text-xl font-bold text-blue-600 transition-transform duration-300 hover:scale-110 "
        >
          📒 NotesApp
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <h3>{user.email}</h3>
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-blue-600 transition-transform duration-300 hover:scale-110 hover:font-bold"
            >
              Dashboard
            </Link>
            <Link
              to={user && user._id ? `/profile/${user._id}` : "#"}
              className="text-gray-700 hover:text-blue-600 transition-transform duration-300 hover:scale-110 hover:font-bold"
            >
              Profile
            </Link>
            <button
              onClick={logout} // Call the logout function when clicked
              className="text-red-500 hover:text-red-700 transition-transform duration-300 hover:scale-110 hover:font-bold"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
