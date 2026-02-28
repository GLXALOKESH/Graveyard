"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Icon } from '@iconify/react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-start gap-3 w-[min(350px,calc(100vw-2rem))] p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all animate-in slide-in-from-right-8 fade-in duration-300 ${toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300' :
                                toast.type === 'error' ? 'bg-rose-950/90 border-rose-500/30 text-rose-300' :
                                    'bg-slate-900/90 border-white/10 text-slate-300'
                            }`}
                    >
                        <div className="shrink-0 mt-0.5">
                            {toast.type === 'success' && <Icon icon="solar:check-circle-bold" className="text-xl" />}
                            {toast.type === 'error' && <Icon icon="solar:danger-triangle-bold" className="text-xl" />}
                            {toast.type === 'info' && <Icon icon="solar:info-circle-bold" className="text-xl" />}
                        </div>
                        <div className="flex-1 text-sm leading-tight break-words">
                            {toast.message}
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="shrink-0 text-white/40 hover:text-white/80 transition-colors"
                        >
                            <Icon icon="solar:close-circle-linear" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
