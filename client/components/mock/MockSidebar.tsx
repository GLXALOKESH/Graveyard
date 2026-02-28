import React from 'react';
import { Icon } from '@iconify/react';

interface MockSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const navItems = [
    { id: 'ec2', label: 'EC2 Instances', icon: 'solar:server-square-linear' },
    { id: 'ecs', label: 'ECS Clusters', icon: 'solar:box-minimalistic-linear' },
    { id: 'lambda', label: 'Lambda Functions', icon: 'solar:bolt-linear' },
    { id: 'rds', label: 'RDS Databases', icon: 'solar:database-linear' },
    { id: 's3', label: 'S3 Buckets', icon: 'solar:folder-with-files-linear' },
    { id: 'volume', label: 'EBS Volumes', icon: 'solar:hard-drive-linear' },
    { id: 'divider1', divider: true },
    { id: 'bulk', label: 'Bulk Operations', icon: 'solar:layers-linear' },
    { id: 'divider2', divider: true },
    { id: 'settings', label: 'Reset & Settings', icon: 'solar:settings-linear' },
];

export default function MockSidebar({ activeTab, setActiveTab }: MockSidebarProps) {
    return (
        <aside className="w-64 bg-[#0B0F19] border-r border-white/5 h-screen flex flex-col shrink-0">
            <div className="p-6 flex items-center gap-3 border-b border-white/5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Icon icon="solar:ghost-smile-bold" className="text-emerald-400 text-xl" />
                </div>
                <div>
                    <h2 className="text-slate-200 font-bold tracking-tight text-sm">Graveyard Mock</h2>
                    <p className="text-xs text-slate-500">AWS Environment</p>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1 custom-scrollbar">
                {navItems.map((item, index) => {
                    if (item.divider) {
                        return <div key={`divider-${index}`} className="my-2 border-t border-white/5" />;
                    }

                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id!)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${isActive
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.05)]'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            <Icon icon={item.icon!} className={`text-lg ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <a href="/" className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                    <Icon icon="solar:arrow-left-linear" />
                    Back to Main App
                </a>
            </div>
        </aside>
    );
}
