import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <main className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card w-full max-w-xl bg-base-100 shadow-xl border border-base-300">
        <div className="card-body items-center text-center p-10">
          <div className="badge badge-error badge-outline px-4 py-3 text-lg font-bold tracking-widest">
            404
          </div>

          <h1 className="mt-6 text-5xl font-black tracking-tight text-base-content sm:text-6xl">
            Page not found
          </h1>

          <p className="mt-4 text-lg text-base-content/70">
            The page you’re looking for doesn’t exist or may have been moved.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/login" className="btn btn-outline">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
