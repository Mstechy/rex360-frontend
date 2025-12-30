import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    console.error('ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-2xl bg-white border rounded-2xl p-8 shadow">
            <h2 className="text-xl font-bold text-red-600 mb-2">Application Error</h2>
            <p className="text-sm text-gray-700 mb-4">An unexpected error occurred while rendering the page.</p>
            <details className="text-xs text-gray-500 whitespace-pre-wrap">
              {String(this.state.error)}
              {this.state.info?.componentStack && '\n\n' + this.state.info.componentStack}
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
