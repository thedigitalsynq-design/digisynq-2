// src/components/ErrorBoundary.jsx
import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[CDC ErrorBoundary caught exception]:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-lg w-full bg-[#0d1424] border border-red-500/40 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white font-mono uppercase">Telemetry Runtime Intercepted</h2>
                <p className="text-xs text-slate-400">An unexpected state occurred in the dashboard view.</p>
              </div>
            </div>

            <div className="bg-black/60 rounded-xl p-3 border border-white/5 font-mono text-xs text-red-300 overflow-x-auto max-h-40">
              {this.state.error?.message || 'Unknown runtime error'}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-950/40"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Dashboard</span>
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-mono font-bold transition-colors"
              >
                Clear Cache & Reset
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
