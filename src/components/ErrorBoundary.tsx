
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
          <h2 className="text-lg font-bold mb-2">משהו השתבש</h2>
          <p className="mb-2">אירעה שגיאה בטעינת היישום.</p>
          <details className="text-sm">
            <summary className="cursor-pointer">פרטי השגיאה</summary>
            <pre className="mt-2 p-2 bg-red-100 rounded overflow-x-auto">
              {this.state.error?.toString()}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            רענן דף
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
