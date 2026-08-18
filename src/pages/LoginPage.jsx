import {Fragment} from "react";
import { Link, useNavigate } from "react-router"

const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <Fragment>
            <div className="bg-base-200" onClick={() => navigate("/")}>
               <span className="text-xl rounded p-4 bg-amber-50 text-black">Back to welcome</span>
            </div>
            
            <div className="hero bg-base-200 min-h-screen">
          <div className="hero-content flex-col lg:flex-col lg:w-full">
            <h1 className="text-2xl">Login Form</h1>
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
              <div className="card-body">
                <fieldset className="fieldset">
                  <label className="label">Email</label>
                  <input type="email" className="input" placeholder="Email" />
                  <label className="label">Password</label>
                  <input type="password" className="input" placeholder="Password" />
                  
                  <button className="btn btn-neutral mt-4">Login</button>
                  <div>Don't have an account?<Link to={"/register"} className="text-blue link link-hover"> Register</Link></div>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
        </Fragment>
    )
}

export default LoginPage;