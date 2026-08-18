import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext.jsx";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const { signUp } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signUp(email, password);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-col lg:w-full">
        {error && <Alert variant="danger">{error}</Alert>}
        <h1 className="text-2xl">Register Form</h1>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <fieldset className="fieldset">
              <form onSubmit={handleSubmit}>
                <label className="label">Email</label>
                <input type="email" className="input" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button className="btn btn-neutral mt-4 w-full" type="submit">Register</button>
                <div>
                  Already have an account?
                  <Link to={"/login"} className="text-blue link link-hover">
                    {" "}
                    Login
                  </Link>
                </div>
              </form>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
