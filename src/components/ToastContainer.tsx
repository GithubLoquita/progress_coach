/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, CheckCircle, Info, AlertTriangle, AlertOctagon } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => {
        let bgClass = 'bg-slate-900 text-white';
        let Icon = Info;
        
        if (toast.type === 'success') {
          bgClass = 'bg-emerald-900 border-2 border-emerald-500 text-white shadow-emerald-500/10';
          Icon = CheckCircle;
        } else if (toast.type === 'warning') {
          bgClass = 'bg-amber-950 border-2 border-amber-500 text-white shadow-amber-500/10';
          Icon = AlertTriangle;
        } else if (toast.type === 'error') {
          bgClass = 'bg-rose-950 border-2 border-rose-500 text-white shadow-rose-500/10';
          Icon = AlertOctagon;
        }

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 rounded-2xl p-4 shadow-xl border border-white/5 backdrop-blur-md transition-all duration-300 animate-slide-in ${bgClass}`}
          >
            <Icon className="h-5 w-5 shrink-0 text-white mt-0.5" />
            
            <div className="flex-1 text-xs font-semibold leading-normal">
              {toast.message}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-white/60 hover:text-white transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  );
}
