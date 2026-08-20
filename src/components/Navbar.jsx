import { useNavigate, Link } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import avatar from "../assets/default-avatar.avif";

const Navbar = () => {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="navbar bg-base-800 shadow-sm w-full">
      <div className="flex-1">
        <Link to={"/dashboard"} className="btn btn-ghost text-xl">ExpenseTracker</Link>
      </div>
      <div className="flex gap-2">
        
        <div>
          <button onClick={() => navigate("/add")} className="bg-green-600 btn btn-md sm:btn-lg md:btn-lg lg:btn-md xl:btn-md">Add Expense</button>
        </div>
        <div>
          <button onClick={() => navigate("/help")} className="bg-white text-black btn btn-md sm:btn-lg md:btn-lg lg:btn-md xl:btn-md">Get Help</button>
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img alt="Profile Image" src={avatar} />
            </div>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-emerald-800 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link className="justify-between" to="/profile">
                Profile
                <span className="badge">New</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link onClick={handleLogout}>Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
