import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Icon } from '@iconify/react';
import { getStatusFromConfidence } from '../../../app/dashboard/layoutUtils';

export const CloudNode = memo(({ data }: any) => {
    return (
        <div className="px-6 py-4 rounded-2xl bg-slate-900 border border-white/20 shadow-2xl flex items-center gap-4 min-w-[250px]">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <Icon icon="solar:cloud-bold" className="text-3xl text-indigo-400" />
            </div>
            <div>
                <div className="text-sm font-bold text-slate-100">{data.label}</div>
                <div className="text-xs text-slate-400">{data.isMock ? 'Mock Environment' : 'Production'}</div>
            </div>
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-indigo-500 border-2 border-slate-900" />
        </div>
    );
});

export const RegionNode = memo(({ data }: any) => {
    return (
        <div className="px-5 py-3 rounded-xl bg-slate-800 border border-white/10 shadow-lg flex items-center gap-3 min-w-[200px]">
            <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 bg-slate-500 border-2 border-slate-800" />
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
                <Icon icon="solar:global-linear" className="text-xl text-sky-400" />
            </div>
            <div>
                <div className="text-sm font-medium text-slate-200">{data.label}</div>
            </div>
            <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 bg-sky-500 border-2 border-slate-800" />
        </div>
    );
});

export const ServiceNode = memo(({ data }: any) => {
    return (
        <div className="px-4 py-2.5 rounded-lg bg-slate-800/80 border border-white/5 shadow-md flex items-center gap-2 min-w-[160px]">
            <Handle type="target" position={Position.Left} className="w-2 h-2 bg-slate-600 border border-slate-800" />
            <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Icon icon="solar:widget-3-linear" className="text-sm text-emerald-400" />
            </div>
            <div className="text-xs font-semibold text-slate-300">{data.label}</div>
            <Handle type="source" position={Position.Right} className="w-2 h-2 bg-emerald-500 border border-slate-800" />
        </div>
    );
});

export const ResourceNode = memo(({ data }: any) => {
    // Styling logic based on status
    const itemConf = data.confidence || 0;
    const { label: statusLabel, color: badgeColorBg, key } = getStatusFromConfidence(itemConf);

    let bgClass = "bg-[#0B0F19]";
    let iconClass = "text-emerald-400 bg-emerald-500/10";
    let textClass = "text-slate-300";
    let pulseClass = "";
    let borderClass = "border-white/5";

    if (key === 'zombie') {
        bgClass = "bg-red-950/20";
        borderClass = "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]";
        iconClass = "text-red-400 bg-red-500/20";
        textClass = "text-red-100 font-bold";
        pulseClass = "animate-pulse";
    } else if (key === 'likely_zombie') {
        bgClass = "bg-orange-950/20";
        borderClass = "border-orange-500/50";
        iconClass = "text-orange-400 bg-orange-500/20";
        textClass = "text-orange-200 font-bold";
    } else if (key === 'suspect') {
        bgClass = "bg-yellow-950/20";
        borderClass = "border-yellow-500/30";
        iconClass = "text-yellow-400 bg-yellow-500/10";
        textClass = "text-yellow-200";
    } else if (key === 'warning') {
        bgClass = "bg-blue-950/20";
        borderClass = "border-blue-500/30";
        iconClass = "text-blue-400 bg-blue-500/10";
        textClass = "text-blue-200";
    } else {
        borderClass = "border-emerald-500/30 border-l-2";
    }

    const MapIcon = () => {
        if (key === 'zombie' || key === 'likely_zombie') return <Icon icon="solar:danger-triangle-bold" className="text-sm" />;
        if (key === 'suspect' || key === 'warning') return <Icon icon="solar:info-circle-bold" className="text-sm" />;
        return <Icon icon="solar:check-circle-bold" className="text-sm" />;
    };

    return (
        <div className={`px-4 py-3 rounded-xl border flex flex-col gap-2 min-w-[260px] transition-all duration-300 ${bgClass} ${borderClass} ${pulseClass} group relative`}>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-slate-900 border border-white/10 p-3 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity">
                <div className="text-xs font-bold mb-1 text-slate-200">{data.id}</div>
                <div className="flex justify-between gap-4 mt-2">
                    <div className="text-[10px] text-slate-400">Confidence:</div>
                    <div className={`text-[10px] font-bold ${badgeColorBg.replace('bg-', 'text-')}`}>{itemConf}%</div>
                </div>
                <div className="flex justify-between gap-4 mt-1">
                    <div className="text-[10px] text-slate-400">Status:</div>
                    <div className="text-[10px] text-slate-200">{statusLabel}</div>
                </div>
                {data.monthlyCost > 0 && (
                    <div className="flex justify-between gap-4 mt-1 border-t border-white/10 pt-1">
                        <div className="text-[10px] text-slate-400">Monthly Cost:</div>
                        <div className="text-[10px] text-red-400 font-bold">${data.monthlyCost}/mo</div>
                    </div>
                )}
            </div>

            <Handle type="target" position={Position.Left} className="w-2 h-2 bg-slate-600 border-none" />

            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${iconClass}`}>
                        <MapIcon />
                    </div>
                    <div className={`text-xs font-mono truncate max-w-[100px] ${textClass}`} title={data.id}>
                        {data.id}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded text-white ${badgeColorBg}`}>
                        {statusLabel}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{itemConf}%</span>
                </div>
            </div>

            {data.monthlyCost > 0 && (
                <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wide">Waste/mo</span>
                    <span className="text-xs font-bold text-red-500">${data.monthlyCost}</span>
                </div>
            )}
        </div>
    );
});
