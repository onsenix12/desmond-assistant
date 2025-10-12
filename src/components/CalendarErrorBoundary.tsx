import React from 'react';
import { Calendar, RefreshCw } from 'lucide-react';

interface CalendarErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface CalendarErrorBoundaryProps {
  children: React.ReactNode;
}

class CalendarErrorBoundary extends React.Component<CalendarErrorBoundaryProps, CalendarErrorBoundaryState> {
  constructor(props: CalendarErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<CalendarErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Calendar Error:', error, errorInfo);
    this.setState({ error });
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-4">
            <div className="inline-block p-3 bg-red-100 rounded-full">
              <Calendar size={32} className="text-red-600" />
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Calendar Error
          </h3>
          
          <p className="text-gray-600 mb-4">
            There was a problem loading the calendar. This might be due to invalid data or a network issue.
          </p>
          
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <RefreshCw size={16} />
            Retry
          </button>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm font-semibold text-gray-700">
                Error Details
              </summary>
              <pre className="text-xs text-gray-600 mt-2 p-2 bg-gray-100 rounded overflow-auto">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default CalendarErrorBoundary;
