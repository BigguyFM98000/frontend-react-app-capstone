import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You can log the error to an external service here
    console.error("ErrorBoundary caught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-xl bg-base-100 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-2">Something went wrong.</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-700">{String(this.state.error)}</pre>
            <div className="mt-4">
              <button className="btn btn-primary" onClick={() => window.location.reload()}>
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
