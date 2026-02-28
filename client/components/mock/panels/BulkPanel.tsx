"use client";

import React, { useState } from 'react';
import { MockApiService, BulkCreateParams } from '../../../services/mockApi';
import { useToast } from '../ToastProvider';
import { Icon } from '@iconify/react';
import { handleApiError } from '../../../services/mockApi';

interface BulkPanelProps {
    region: string;
}

export default function BulkPanel({ region }: BulkPanelProps) {
    const { showToast } = useToast();
    const [isCreating, setIsCreating] = useState(false);
    const [result, setResult] = useState<any>(null);

    // Form State
    const [ec2Count, setEc2Count] = useState(0);
    const [lambdaCount, setLambdaCount] = useState(0);
    const [rdsCount, setRdsCount] = useState(0);
    const [s3Count, setS3Count] = useState(0);
    const [volumeCount, setVolumeCount] = useState(0);
    const [zombieRatio, setZombieRatio] = useState(0.3);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        setResult(null);

        const params: BulkCreateParams = {
            ec2Count,
            lambdaCount,
            rdsCount,
            s3Count,
            volumeCount,
            zombieRatio,
            // For simplicity in this demo, we auto-gen an ECS cluster if requested via bulk?
            // The API doc says we need `ecsClusters: array`. We can leave it out for this simple bulk form.
        };

        try {
            const res = await MockApiService.createBulk(region, params);
            showToast(res.data.message || 'Bulk resources created successfully', 'success');
            setResult(res.data.data.created);
        } catch (error) {
            showToast(handleApiError(error), 'error');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-100">Bulk Operations</h2>
                    <p className="text-sm text-slate-400">Rapidly provision multiple resources in {region}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 space-y-6">
                    <form onSubmit={handleCreate} className="flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-slate-400 flex items-center gap-2">
                                    <Icon icon="solar:server-square-linear" /> EC2 Instances
                                </label>
                                <input type="number" min="0" value={ec2Count} onChange={e => setEc2Count(parseInt(e.target.value) || 0)} className="h-9 px-3 rounded-lg bg-slate-800 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-slate-400 flex items-center gap-2">
                                    <Icon icon="solar:bolt-linear" /> Lambda Functions
                                </label>
                                <input type="number" min="0" value={lambdaCount} onChange={e => setLambdaCount(parseInt(e.target.value) || 0)} className="h-9 px-3 rounded-lg bg-slate-800 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-slate-400 flex items-center gap-2">
                                    <Icon icon="solar:database-linear" /> RDS Databases
                                </label>
                                <input type="number" min="0" value={rdsCount} onChange={e => setRdsCount(parseInt(e.target.value) || 0)} className="h-9 px-3 rounded-lg bg-slate-800 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-slate-400 flex items-center gap-2">
                                    <Icon icon="solar:folder-with-files-linear" /> S3 Buckets
                                </label>
                                <input type="number" min="0" value={s3Count} onChange={e => setS3Count(parseInt(e.target.value) || 0)} className="h-9 px-3 rounded-lg bg-slate-800 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-slate-400 flex items-center gap-2">
                                    <Icon icon="solar:hard-drive-linear" /> EBS Volumes
                                </label>
                                <input type="number" min="0" value={volumeCount} onChange={e => setVolumeCount(parseInt(e.target.value) || 0)} className="h-9 px-3 rounded-lg bg-slate-800 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50" />
                            </div>
                            <div className="flex flex-col gap-1.5 relative">
                                <label className="text-xs font-medium text-amber-400 flex items-center gap-2">
                                    <Icon icon="solar:danger-triangle-linear" /> Zombie Ratio ({Math.round(zombieRatio * 100)}%)
                                </label>
                                <input type="range" min="0" max="1" step="0.1" value={zombieRatio} onChange={e => setZombieRatio(parseFloat(e.target.value))} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-800 accent-amber-500 mt-2" />
                            </div>
                        </div>

                        <button type="submit" disabled={isCreating} className="w-full h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
                            {isCreating ? <Icon icon="solar:refresh-circle-linear" className="animate-spin" /> : <Icon icon="solar:playback-speed-linear" />}
                            Execute Bulk Creation
                        </button>
                    </form>
                </div>

                {/* Result Section */}
                <div className="p-6 rounded-2xl bg-[#060810]/50 border border-white/5 flex flex-col items-center justify-center min-h-[300px]">
                    {result ? (
                        <div className="w-full flex justify-center text-center flex-col animate-in fade-in zoom-in-95 duration-500">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                                <Icon icon="solar:check-circle-bold" className="text-3xl" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-200 mb-6">Provisioning Complete</h3>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full text-left">
                                {Object.entries(result).map(([key, val]) => (
                                    <div key={key} className="p-3 rounded-lg bg-slate-900 border border-white/5">
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">{key}</div>
                                        <div className="text-xl text-slate-200 font-medium">{String(val)} created</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-slate-500 flex flex-col items-center gap-3">
                            <Icon icon="solar:magic-stick-3-linear" className="text-4xl opacity-50" />
                            <p className="text-sm">Configure quantities and execute to bulk provision resources.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
