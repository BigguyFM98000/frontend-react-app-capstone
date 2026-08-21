import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Fragment, useEffect } from "react";
import defaultAvatar from "../assets/default-avatar.avif";
import { auth } from "../firebase";
import { useUserAuth } from "../context/UserAuthContext";
import { useForm } from "react-hook-form";
import { updateProfile } from "firebase/auth";

const ProfilePage = () => {
  const { user } = useUserAuth();
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: "",
      surname: "",
      email: "",
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.uid) return;

    const displayName = user.displayName || "";

    // Split displayName into name and surname
    const nameParts = displayName.split(" ");

    const name = nameParts[0] || "";
    const surname = nameParts.slice(1).join(" ") || "";

    // Display existing Firebase data in the form
    setValue("name", name);
    setValue("surname", surname);
    setValue("email", user.email || "");
  }, [setValue, user]);

  const onSubmit = async (data) => {
    const user = auth.currentUser;

    if (!user) {
      console.log("No user is logged in");
      return;
    }

    try {
      const displayName = `${data.name} ${data.surname}`.trim();

      await updateProfile(user, {
        displayName,
      });
      console.log("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  return (
    <Fragment>
      <Navbar />

      <div className="card w-full h-auto flex flex-col justify-center items-center bg-base-100 shadow-sm mt-16">
        <figure>
          <div className="avatar">
            <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring-2 ring-offset-2">
              <img alt="Tailwind-CSS-Avatar-component" src={defaultAvatar} />
            </div>
          </div>
        </figure>
        <div className="card-body">
          <h2 className="card-title text-center text-lg">
            Profile Information
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="fieldset">
              <label className="label" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="input"
                placeholder="Enter your name"
                {...register("name")}
              />
            </fieldset>
            <fieldset className="fieldset">
              <label className="label" htmlFor="surname">
                Surname
              </label>
              <input
                type="text"
                id="surname"
                className="input"
                placeholder="Enter your surname"
                {...register("surname")}
              />
            </fieldset>
            <fieldset className="fieldset">
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                type="text"
                id="email"
                className="input"
                placeholder="Enter your email"
                {...register("email")}
                readOnly
                disabled
              />
            </fieldset>

            <div className="card-actions justify-end">
              <button
                onClick={() => navigate("/dashboard")}
                className="btn bg-white text-black"
              >
                Cancel
              </button>
              <button className="btn btn-primary">Update Profile</button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default ProfilePage;
