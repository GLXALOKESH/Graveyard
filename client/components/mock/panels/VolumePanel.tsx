"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MockApiService, CreateVolumeParams } from '../../../services/mockApi';
import Table from '../Table';
import { useToast } from '../ToastProvider';
import { Icon } from '@iconify/react';
import { handleApiError } from '../../../services/mockApi';

interface VolumePanelProps {
    region: string;
}

export default function VolumePanel({ region }: VolumePanelProps) {
    const { showToast } = useToast();
    const [volumes, setVolumes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [status, setStatus] = useState<CreateVolumeParams['status']>('available');
    const [size, setSize] = useState(50);
    const [isZombie, setIsZombie] = useState(false);
    const [count, setCount] = useState(1);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await MockApiService.getVolume(region);
            setVolumes(res.data.data.Volumes || []);
        } catch (error) {
            showToast(handleApiError(error), 'error');
        } finally {
            setIsLoading(false);
        }
    }, [region, showToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const res = await MockApiService.createVolume({
                region,
                status,
                size,
                isZombie,
                count,
            });
            showToast(res.data.message || `Created ${count} EBS volume(s)`, 'success');
            fetchData();
        } catch (error) {
            showToast(handleApiError(error), 'error');
        } finally {
            setIsCreating(false);
        }
    };

    const columns = [
        { header: 'Volume ID', accessor: 'VolumeId' as const },
        {
            header: 'Status',
            accessor: (row: any) => (
                <span className={`px-2 py-0.5 rounded-full text-[10px] border ${row.Status === 'in-use'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : row.Status === 'available'
                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                    {row.Status}
                </span>
            )
        },
        {
            header: 'Size (GB)',
            accessor: (row: any) => (
                <span className="text-slate-300 font-medium">
                    {row.Size} GB
                </span>
            )
        },
        {
            header: 'Zombie Indicator',
            accessor: (row: any) => (
                row.Status === 'available' ? (
                    <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
                        <Icon icon="solar:danger-triangle-bold" /> Unattached Volume
                    </div>
                ) : (
                    <span className="text-xs text-slate-500">Healthy</span>
                )
            )
        },
    ];

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Header Summary */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-100">EBS Volumes</h2>
                    <p className="text-sm text-slate-400">Manage block storage in {region}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-xl bg-slate-900 border border-white/5 flex items-center gap-3">
                        <Icon icon="solar:hard-drive-linear" className="text-slate-500 text-xl" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Volumes</span>
                            <span className="text-slate-200 font-medium leading-none">{volumes.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Form */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5">
                <form onSubmit={handleCreate} className="flex items-end gap-4 flex-wrap">

                    <div className="flex flex-col gap-1.5 flex-1 min-w-[130px]">
                        <label className="text-xs font-medium text-slate-400">Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value as any)} className="h-9 px-3 rounded-lg bg-slate-800 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50 appearance-none">
                            <option value="available">Available (Unattached)</option>
                            <option value="in-use">In Use</option>
                            <option value="creating">Creating</option>
                            <option value="deleting">Deleting</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5 w-24">
                        <label className="text-xs font-medium text-slate-400">Size (GB)</label>
                        <input type="number" min="1" max="16000" value={size} onChange={e => setSize(parseInt(e.target.value) || 50)} className="h-9 px-3 rounded-lg bg-slate-800 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50" />
                    </div>

                    <div className="flex flex-col gap-1.5 w-20">
                        <label className="text-xs font-medium text-slate-400">Count</label>
                        <input type="number" min="1" max="100" value={count} onChange={e => setCount(parseInt(e.target.value) || 1)} className="h-9 px-3 rounded-lg bg-slate-800 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-400">Options</label>
                        <button type="button" onClick={() => setIsZombie(!isZombie)} className={`h-9 px-4 rounded-lg border text-sm flex items-center gap-2 transition-colors ${isZombie ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-slate-800 border-white/10 text-slate-400'}`}>
                            <Icon icon="solar:ghost-smile-linear" />
                            Force Zombie
                        </button>
                    </div>

                    <button type="submit" disabled={isCreating} className="h-9 px-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all disabled:opacity-50 flex items-center gap-2">
                        {isCreating ? <Icon icon="solar:refresh-circle-linear" className="animate-spin" /> : <Icon icon="solar:add-circle-linear" />}
                        Generate
                    </button>
                </form>
            </div>

            {/* List Table */}
            <Table data={volumes} columns={columns} isLoading={isLoading} emptyMessage="No EBS volumes found in this region." />
        </div>
    );
}
