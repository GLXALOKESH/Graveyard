"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MockApiService, CreateEcsParams } from '../../../services/mockApi';
import Table from '../Table';
import { useToast } from '../ToastProvider';
import { Icon } from '@iconify/react';
import { handleApiError } from '../../../services/mockApi';

interface EcsPanelProps {
    region: string;
}

export default function EcsPanel({ region }: EcsPanelProps) {
    const { showToast } = useToast();
    const [clusters, setClusters] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [clusterName, setClusterName] = useState('demo-cluster');
    const [serviceName, setServiceName] = useState('api-service');
    const [desiredCount, setDesiredCount] = useState(3);
    const [runningCount, setRunningCount] = useState(3);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await MockApiService.getEcs(region);
            setClusters(res.data.data.clusters || []);
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
            const data: CreateEcsParams = {
                region,
                clusterName,
                services: [
                    {
                        serviceName,
                        desiredCount,
                        runningCount,
                        status: 'ACTIVE'
                    }
                ]
            };
            const res = await MockApiService.createEcs(data);
            showToast(res.data.message || 'Created ECS Cluster', 'success');
            fetchData();
        } catch (error) {
            showToast(handleApiError(error), 'error');
        } finally {
            setIsCreating(false);
        }
    };

    // Flatten services for table view
    const flatServices = clusters.flatMap(c =>
        c.services?.map((s: any) => ({ ...s, clusterName: c.clusterName })) || []
    );

    const columns = [
        { header: 'Cluster Name', accessor: 'clusterName' as const },
        { header: 'Service Name', accessor: 'serviceName' as const },
        {
            header: 'Status',
            accessor: (row: any) => (
                <span className={`px-2 py-0.5 rounded-full text-[10px] border ${row.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-slate-500/10 border-slate-500/20 text-slate-400'
                    }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Tasks (Running/Desired)',
            accessor: (row: any) => (
                <div className="flex items-center gap-2">
                    <span className={row.runningCount === 0 && row.desiredCount > 0 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {row.runningCount} / {row.desiredCount}
                    </span>
                    {row.runningCount === 0 && row.desiredCount > 0 && (
                        <Icon icon="solar:danger-triangle-bold" className="text-amber-500" title="Zombie Service: 0 running tasks" />
                    )}
                </div>
            )
        },
    ];

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Header Summary */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-100">ECS Clusters & Services</h2>
                    <p className="text-sm text-slate-400">Manage container workloads in {region}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-xl bg-slate-900 border border-white/5 flex items-center gap-3">
                        <Icon icon="solar:box-minimalistic-linear" className="text-slate-500 text-xl" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Clusters</span>
                            <span className="text-slate-200 font-medium leading-none">{clusters.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Form */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5">
                <form onSubmit={handleCreate} className="flex items-end gap-4 flex-wrap">
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
                        <label className="text-xs font-medium text-slate-400">Cluster Name</label>
                        <input type="text" value={clusterName} onChange={e => setClusterName(e.target.value)} className="h-9 px-3 rounded-lg bg-slate-800 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50" />
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
                        <label className="text-xs font-medium text-slate-400">Service Name</label>
                        <input type="text" value={serviceName} onChange={e => setServiceName(e.target.value)} className="h-9 px-3 rounded-lg bg-slate-800 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50" />
                    </div>

                    <div className="flex flex-col gap-1.5 w-24">
                        <label className="text-xs font-medium text-slate-400">Desired Tasks</label>
                        <input type="number" min="0" value={desiredCount} onChange={e => setDesiredCount(parseInt(e.target.value) || 0)} className="h-9 px-3 rounded-lg bg-slate-800 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50" />
                    </div>

                    <div className="flex flex-col gap-1.5 w-24">
                        <label className="text-xs font-medium text-slate-400">Running</label>
                        <input type="number" min="0" value={runningCount} onChange={e => setRunningCount(parseInt(e.target.value) || 0)} className="h-9 px-3 rounded-lg bg-slate-800 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50" />
                    </div>

                    <div className="flex flex-col gap-1.5 pt-6">
                        <button type="submit" disabled={isCreating} className="h-9 px-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all disabled:opacity-50 flex items-center gap-2">
                            {isCreating ? <Icon icon="solar:refresh-circle-linear" className="animate-spin" /> : <Icon icon="solar:add-circle-linear" />}
                            Create Cluster & Service
                        </button>
                    </div>
                </form>
            </div>

            {/* List Table */}
            <Table data={flatServices} columns={columns} isLoading={isLoading} emptyMessage="No ECS services found in this region." />
        </div>
    );
}
