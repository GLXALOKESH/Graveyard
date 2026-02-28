"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MockApiService, CreateLambdaParams } from '../../../services/mockApi';
import Table from '../Table';
import { useToast } from '../ToastProvider';
import { Icon } from '@iconify/react';
import { handleApiError } from '../../../services/mockApi';

interface LambdaPanelProps {
    region: string;
}

export default function LambdaPanel({ region }: LambdaPanelProps) {
    const { showToast } = useToast();
    const [functions, setFunctions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [functionName, setFunctionName] = useState('process-data');
    const [runtime, setRuntime] = useState<CreateLambdaParams['runtime']>('nodejs18.x');
    const [memorySize, setMemorySize] = useState(128);
    const [isZombie, setIsZombie] = useState(false);
    const [count, setCount] = useState(1);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await MockApiService.getLambda(region);
            setFunctions(res.data.data.Functions || []);
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
            const res = await MockApiService.createLambda({
                region,
                functionName,
                runtime,
                memorySize,
                isZombie,
                count,
            });
            showToast(res.data.message || `Created ${count} Lambda function(s)`, 'success');
            fetchData();
        } catch (error) {
            showToast(handleApiError(error), 'error');
        } finally {
            setIsCreating(false);
        }
    };

    const columns = [
        { header: 'Function Name', accessor: 'FunctionName' as const },
        {
            header: 'Runtime',
            accessor: (row: any) => (
                <span className="px-2 py-0.5 rounded-full text-xs border bg-slate-800/50 border-white/10 text-slate-300">
                    {row.Runtime}
                </span>
            )
        },
        { header: 'Memory (MB)', accessor: 'MemorySize' as const },
        {
            header: 'Invocations (24h)',
            accessor: (row: any) => (
                <div className="flex items-center gap-2">
                    <span className={row.Invocations < 10 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {row.Invocations?.toLocaleString() || 0}
                    </span>
                    {row.Invocations < 10 && (
                        <span title="Zombie Function: Minimal invocations">
                            <Icon icon="solar:danger-triangle-bold" className="text-amber-500" />
                        </span>
                    )}
                </div>
            )
        },
        {
            header: 'Last Modified',
            accessor: (row: any) => (
                <span className="text-xs text-slate-400">
                    {new Date(row.LastModified).toLocaleDateString()}
                </span>
            )
        },
    ];

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Header Summary */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-100">Lambda Functions</h2>
                    <p className="text-sm text-slate-400">Manage serverless functions in {region}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-xl bg-slate-900 border border-white/5 flex items-center gap-3">
                        <Icon icon="solar:bolt-linear" className="text-slate-500 text-xl" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Functions</span>
                            <span className="text-slate-200 font-medium leading-none">{functions.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Form */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5">
                <form onSubmit={handleCreate} className="flex items-end gap-4 flex-wrap">
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
                        <label className="text-xs font-medium text-slate-400">Function Name</label>
                        <input type="text" value={functionName} onChange={e => setFunctionName(e.target.value)} className="h-9 px-3 rounded-lg bg-slate-800 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50" />
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1 min-w-[130px]">
                        <label className="text-xs font-medium text-slate-400">Runtime</label>
                        <select value={runtime} onChange={e => setRuntime(e.target.value as any)} className="h-9 px-3 rounded-lg bg-slate-800 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50 appearance-none">
                            <option value="nodejs18.x">nodejs18.x</option>
                            <option value="nodejs16.x">nodejs16.x</option>
                            <option value="python3.11">python3.11</option>
                            <option value="python3.10">python3.10</option>
                            <option value="java17">java17</option>
                            <option value="dotnet6">dotnet6</option>
                            <option value="go1.x">go1.x</option>
                            <option value="ruby3.2">ruby3.2</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5 w-24">
                        <label className="text-xs font-medium text-slate-400">Memory</label>
                        <input type="number" min="128" step="128" max="10240" value={memorySize} onChange={e => setMemorySize(parseInt(e.target.value) || 128)} className="h-9 px-3 rounded-lg bg-slate-800 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50" />
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
            <Table data={functions} columns={columns} isLoading={isLoading} emptyMessage="No Lambda functions found in this region." />
        </div>
    );
}
