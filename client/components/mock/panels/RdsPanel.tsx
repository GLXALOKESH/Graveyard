"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MockApiService, CreateRdsParams } from '../../../services/mockApi';
import Table from '../Table';
import { useToast } from '../ToastProvider';
import { Icon } from '@iconify/react';
import { handleApiError } from '../../../services/mockApi';

interface RdsPanelProps {
    region: string;
}

export default function RdsPanel({ region }: RdsPanelProps) {
    const { showToast } = useToast();
    const [instances, setInstances] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [dbInstanceIdentifier, setDbInstanceIdentifier] = useState('main-db');
    const [engine, setEngine] = useState<CreateRdsParams['engine']>('postgres');
    const [status, setStatus] = useState('available');
    const [isZombie, setIsZombie] = useState(false);
    const [count, setCount] = useState(1);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await MockApiService.getRds(region);
            setInstances(res.data.data.DBInstances || []);
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
            const res = await MockApiService.createRds({
                region,
                dbInstanceIdentifier,
                engine,
                status,
                isZombie,
                count,
            });
            showToast(res.data.message || `Created ${count} RDS instance(s)`, 'success');
            fetchData();
        } catch (error) {
            showToast(handleApiError(error), 'error');
        } finally {
            setIsCreating(false);
        }
    };

    const columns = [
        { header: 'Identifier', accessor: 'DBInstanceIdentifier' as const },
        {
            header: 'Engine',
            accessor: (row: any) => (
                <span className="px-2 py-0.5 rounded-full text-xs border bg-slate-800/50 border-white/10 text-slate-300">
                    {row.Engine}
                </span>
            )
        },
        {
            header: 'Status',
            accessor: (row: any) => (
                <span className={`px-2 py-0.5 rounded-full text-[10px] border ${row.DBInstanceStatus === 'available'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                    {row.DBInstanceStatus}
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
            header: 'Connections',
            accessor: (row: any) => (
                <div className="flex items-center gap-2">
                    <span className={row.Connections < 2 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {row.Connections || 0}
                    </span>
                    {row.Connections < 2 && (
                        <span title="Zombie DB: Almost no connections">
                            <Icon icon="solar:danger-triangle-bold" className="text-amber-500" />
                        </span>
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
                    <h2 className="text-xl font-semibold text-slate-100">RDS Databases</h2>
                    <p className="text-sm text-slate-400">Manage relational databases in {region}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-xl bg-slate-900 border border-white/5 flex items-center gap-3">
                        <Icon icon="solar:database-linear" className="text-slate-500 text-xl" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Databases</span>
                            <span className="text-slate-200 font-medium leading-none">{instances.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Form */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5">
                <form onSubmit={handleCreate} className="flex items-end gap-4 flex-wrap">
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
                        <label className="text-xs font-medium text-slate-400">DB Identifier</label>
                        <input type="text" value={dbInstanceIdentifier} onChange={e => setDbInstanceIdentifier(e.target.value)} className="h-9 px-3 rounded-lg bg-slate-800 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50" />
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1 min-w-[130px]">
                        <label className="text-xs font-medium text-slate-400">Engine</label>
                        <select value={engine} onChange={e => setEngine(e.target.value as any)} className="h-9 px-3 rounded-lg bg-slate-800 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50 appearance-none">
                            <option value="postgres">PostgreSQL</option>
                            <option value="mysql">MySQL</option>
                            <option value="mariadb">MariaDB</option>
                            <option value="sqlserver-ex">SQL Server Express</option>
                            <option value="oracle-se2">Oracle SE2</option>
                        </select>
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
            <Table data={instances} columns={columns} isLoading={isLoading} emptyMessage="No RDS instances found in this region." />
        </div>
    );
}
