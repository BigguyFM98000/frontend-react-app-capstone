import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { logIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await logIn(email, password);
      setSuccess("User logged in successfully");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  const handleReset = () => {};

  return (
    <Fragment>
      <div className="bg-base-200" onClick={() => navigate("/")}>
        <span className="text-xl rounded p-4 bg-amber-50 text-black">
          Back to welcome
        </span>
      </div>

      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-col lg:w-full">
          <h1 className="text-2xl">Login Form</h1>
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <fieldset className="fieldset">
                <form onSubmit={handleSubmit}>
                  <label className="label text-lg">Email</label>
                  <input
                    type="email"
                    className="input w-full"
                    placeholder="Enter your email address"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="mt-2 flex justify-between items-center">
                    <label className="label text-lg">Password</label>
                    <Link to={"/reset"}>Forgot Password?</Link>
                  </div>

                  <input
                    type="password"
                    className="input w-full"
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button className="btn btn-neutral mt-4 w-full" type="submit">
                    Login
                  </button>
                  <hr className="py-4" />
                  <div>
                    <button
                      className="btn btn-outline w-full mt-2 mb-2"
                      onClick={handleGoogleSignIn}
                    >
                      Sign in with Google
                    </button>
                  </div>
                  <div className="mt-4 text-lg">
                    Don't have an account?
                    <Link
                      to={"/register"}
                      className="text-blue link link-hover"
                    >
                      {" "}
                      Register
                    </Link>
                  </div>
                </form>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default LoginPage;
