import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
    const navigate = useNavigate();
 
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="w-full px-8">
          <h1 className="text-6xl font-bold">Welcome To Expense Tracker</h1>
          <p className="py-6 text-3xl">
            The most effective and efficient way of tracking your every day expenses.
          </p>
          <button className="btn btn-primary" onClick={() => navigate("/login")}>Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
