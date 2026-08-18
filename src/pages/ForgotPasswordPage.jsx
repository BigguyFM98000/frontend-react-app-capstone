import { sendPasswordResetEmail } from "firebase/auth";
import { useState, Fragment } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
 
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Check your email for reset link");
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Fragment>
      <div className="bg-base-200" onClick={() => navigate("/login")}>
        <span className="text-xl rounded p-4 bg-amber-50 text-black">
          Back to Login
        </span>
      </div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-col lg:w-full">
          {error && <div className="alert alert-error">{error}</div>}
          <h1 className="text-2xl">Reset Password Form</h1>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <fieldset className="fieldset">
                <form onSubmit={(e) => handleSubmit(e)}>
                  <label className="label text-lg">Email</label>
                  <input
                    type="email"
                    className="input w-full"
                    placeholder="Enter your email address"
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <button className="btn btn-neutral mt-4 w-full" type="submit">
                    Send Email Reset Link
                  </button>
                </form>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ForgotPasswordPage;
