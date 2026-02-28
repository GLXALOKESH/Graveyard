import React from 'react';
import { Icon } from '@iconify/react';

interface MockHeaderProps {
    region: string;
    setRegion: (region: string) => void;
}

const AVAILABLE_REGIONS = [
    'us-east-1',
    'us-east-2',
    'us-west-1',
    'us-west-2',
    'eu-west-1',
    'eu-west-2',
    'eu-central-1',
    'ap-southeast-1'
];

export default function MockHeader({ region, setRegion }: MockHeaderProps) {
    return (
        <header className="h-16 px-6 bg-[#0B0F19]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold text-slate-200">Mock Dashboard</h1>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono">
                    /api/v1/mock
                </span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Icon icon="solar:global-linear" className="text-slate-500" />
                    <label className="text-xs font-medium text-slate-400 hidden sm:block">Region:</label>
                    <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="h-8 pl-3 pr-8 rounded-lg bg-slate-900 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"
                    >
                        {AVAILABLE_REGIONS.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>
            </div>
        </header>
    );
}
