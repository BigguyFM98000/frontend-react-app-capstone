import { Fragment, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import emailjs from "@emailjs/browser";

const HelpPage = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        form.current,
        {
          publicKey: import.meta.env.VITE_PUBLIC_KEY,
        },
      )
      .then(
        () => {
          setSuccess("Email Sent Successfully!");
          console.log("SUCCESS!");
        },
        (error) => {
          setError(error.text);
          console.log("FAILED...", error.text);
        },
      )

      setTimeout(() => {
        setError("");
        setSuccess("");
        form.current.reset();
      }, 5000);
  };

  return (
    <Fragment>
      <Navbar />

      <div className="hero bg-base-200 min-h-screen w-full">
        <div className="hero-content flex-col lg:flex-col lg:w-full">
          
          <h1 className="text-2xl">Help Contact Form</h1>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <fieldset className="fieldset">
                <form ref={form} onSubmit={sendEmail}>
                  <label className="label">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="input"
                    placeholder="Enter your name"
                  />
                  <label className="label">Email</label>
                  <input
                    type="text"
                    name="email"
                    className="input"
                    placeholder="Enter your email address"
                  />
                  <label className="label">Message</label>
                  <textarea
                    name="message"
                    className="textarea"
                    placeholder="Enter your message"
                  ></textarea>

                  <button className="btn btn-neutral mt-4 w-full" type="submit">
                    Send Email
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

export default HelpPage;
