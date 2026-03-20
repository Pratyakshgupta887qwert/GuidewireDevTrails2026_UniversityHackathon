import React from 'react';

const styles = {
  success: 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/40 dark:text-green-100',
  warning: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/40 dark:text-amber-100',
  danger: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/40 dark:text-red-100',
  info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-100',
};

const ToastStack = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed right-4 top-20 z-[70] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`w-[300px] rounded-xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-md animate-pulse ${styles[toast.type] || styles.info}`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center justify-between gap-3">
            <p>{toast.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="rounded p-1 text-xs hover:bg-black/10"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastStack;
