import React from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import 'katex/dist/katex.min.css';
import './index.css';

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    registerSW({
      immediate: true,
      onRegisterError() {
        // Non-blocking fallback when embedded in restricted iframe contexts
      },
    });
  } catch {
    // Ignore SW registration error in sandboxed frames
  }
}

class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; errorMessage: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error?.message || 'Bilinmeyen çalışma zamanı hatası' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FBF9F5] text-stone-900 flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white border border-stone-300 p-6 space-y-4">
            <h1 className="text-xl font-bold text-[#1E3A8A]">
              Emre Pelit — Sci-Phil Ana Hub &amp; 301 Akademik Ağı
            </h1>
            <p className="text-xs text-stone-700">
              Sayfa yüklenirken geçici bir durum oluştu: {this.state.errorMessage}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] rounded-xs cursor-pointer"
            >
              Sayfayı Yenile
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  );
}

