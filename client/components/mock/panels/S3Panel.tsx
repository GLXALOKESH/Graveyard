"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MockApiService } from '../../../services/mockApi';
import Table from '../Table';
import { useToast } from '../ToastProvider';
import { Icon } from '@iconify/react';
import { handleApiError } from '../../../services/mockApi';

interface S3PanelProps {
    region: string;
}

export default function S3Panel({ region }: S3PanelProps) {
    const { showToast } = useToast();
    const [buckets, setBuckets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [bucketName, setBucketName] = useState(`my-mock-bucket-${Math.floor(Math.random() * 10000)}`);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await MockApiService.getS3(region);
            setBuckets(res.data.data.Buckets || []);
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
            const res = await MockApiService.createS3({
                region,
                bucketName,
            });
            showToast(res.data.message || 'Created S3 bucket', 'success');
            setBucketName(`my-mock-bucket-${Math.floor(Math.random() * 10000)}`);
            fetchData();
        } catch (error) {
            showToast(handleApiError(error), 'error');
        } finally {
            setIsCreating(false);
        }
    };

    const columns = [
        { header: 'Bucket Name', accessor: 'Name' as const },
        {
            header: 'Creation Date',
            accessor: (row: any) => (
                <span className="text-sm text-slate-300">
                    {new Date(row.CreationDate).toLocaleString()}
                </span>
            )
        },
    ];

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Header Summary */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-100">S3 Buckets</h2>
                    <p className="text-sm text-slate-400">Manage object storage in {region}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-xl bg-slate-900 border border-white/5 flex items-center gap-3">
                        <Icon icon="solar:folder-with-files-linear" className="text-slate-500 text-xl" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Buckets</span>
                            <span className="text-slate-200 font-medium leading-none">{buckets.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Form */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5">
                <form onSubmit={handleCreate} className="flex items-end gap-4 flex-wrap">
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                        <label className="text-xs font-medium text-slate-400">Bucket Name (must be unique)</label>
                        <input type="text" value={bucketName} onChange={e => setBucketName(e.target.value)} className="h-9 px-3 rounded-lg bg-slate-800 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50" />
                    </div>

                    <button type="submit" disabled={isCreating} className="h-9 px-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all disabled:opacity-50 flex items-center gap-2">
                        {isCreating ? <Icon icon="solar:refresh-circle-linear" className="animate-spin" /> : <Icon icon="solar:add-circle-linear" />}
                        Create Bucket
                    </button>
                </form>
            </div>

            {/* List Table */}
            <Table data={buckets} columns={columns} isLoading={isLoading} emptyMessage="No S3 buckets found in this region." />
        </div>
    );
}
