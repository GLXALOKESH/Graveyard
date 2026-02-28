"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MockApiService } from '../../../services/mockApi';
import Table from '../Table';
import { useToast } from '../ToastProvider';
import { Icon } from '@iconify/react';
import { handleApiError } from '../../../services/mockApi';

interface Ec2PanelProps {
    region: string;
}

export default function Ec2Panel({ region }: Ec2PanelProps) {
    const { showToast } = useToast();
    const [instances, setInstances] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [instanceType, setInstanceType] = useState('t3.micro');
    const [state, setState] = useState<'running' | 'stopped'>('running');
    const [isZombie, setIsZombie] = useState(false);
    const [count, setCount] = useState(1);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await MockApiService.getEc2(region);
            const data = res.data.data;
            // Flatten reservations
            const flatInstances = data.Reservations?.flatMap((r: any) => r.Instances) || [];
            setInstances(flatInstances);
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
            const res = await MockApiService.createEc2({
                region,
                instanceType,
                state,
                isZombie,
                count,
            });
            showToast(res.data.message || `Created ${count} EC2 instance(s)`, 'success');
            fetchData();
        } catch (error) {
            showToast(handleApiError(error), 'error');
        } finally {
            setIsCreating(false);
        }
    };

    const columns = [
        { header: 'Instance ID', accessor: 'InstanceId' as const },
        { header: 'Type', accessor: 'InstanceType' as const },
        {
            header: 'State',
            accessor: (row: any) => (
                <span className={`px-2 py-0.5 rounded-full text-[10px] border ${row.State?.Name === 'running'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                    {row.State?.Name}
                </span>
            )
        },
        {
            header: 'CPU (%)',
            accessor: (row: any) => (
                <span className={row.CpuUtilization < 5 ? 'text-rose-400 font-bold' : ''}>
                    {row.CpuUtilization?.toFixed(2) ?? '0.00'}%
                </span>
            )
        },
        {
            header: 'Network (In/Out)',
            accessor: (row: any) => (
                <span className="text-slate-400 text-xs">
                    {(row.NetworkIn / 1024).toFixed(1)} KB / {(row.NetworkOut / 1024).toFixed(1)} KB
                </span>
            )
        },
        {
            header: 'Tags',
            accessor: (row: any) => row.Tags?.length
                ? <span className="text-xs">{row.Tags.length} tags</span>
                : <span className="text-xs text-rose-400/70 border border-rose-500/20 bg-rose-500/10 px-1.5 py-0.5 rounded">Untagged</span>
        },
    ];

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Header Summary */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-100">EC2 Instances</h2>
                    <p className="text-sm text-slate-400">Manage compute resources in {region}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-xl bg-slate-900 border border-white/5 flex items-center gap-3">
                        <Icon icon="solar:server-square-linear" className="text-slate-500 text-xl" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Instances</span>
                            <span className="text-slate-200 font-medium leading-none">{instances.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Form */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5">
                <form onSubmit={handleCreate} className="flex items-end gap-4 flex-wrap">
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
                        <label className="text-xs font-medium text-slate-400">Instance Type</label>
                        <select value={instanceType} onChange={e => setInstanceType(e.target.value)} className="h-9 px-3 rounded-lg bg-slate-800 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50 appearance-none">
                            <option value="t3.micro">t3.micro</option>
                            <option value="t3.large">t3.large</option>
                            <option value="m5.large">m5.large</option>
                            <option value="c5.xlarge">c5.xlarge</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
                        <label className="text-xs font-medium text-slate-400">State</label>
                        <select value={state} onChange={e => setState(e.target.value as any)} className="h-9 px-3 rounded-lg bg-slate-800 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50 appearance-none">
                            <option value="running">Running</option>
                            <option value="stopped">Stopped</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5 w-24">
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
            <Table data={instances} columns={columns} isLoading={isLoading} emptyMessage="No EC2 instances found in this region." />
        </div>
    );
}
