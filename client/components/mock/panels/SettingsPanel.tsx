"use client";

import React, { useState } from 'react';
import { MockApiService } from '../../../services/mockApi';
import { useToast } from '../ToastProvider';
import { Icon } from '@iconify/react';
import { handleApiError } from '../../../services/mockApi';

interface SettingsPanelProps {
    region: string;
}

export default function SettingsPanel({ region }: SettingsPanelProps) {
    const { showToast } = useToast();
    const [isResettingRegion, setIsResettingRegion] = useState(false);
    const [isResettingAll, setIsResettingAll] = useState(false);

    const handleResetRegion = async () => {
        if (!confirm(`Are you sure you want to delete ALL mock resources in region: ${region}?`)) return;
        setIsResettingRegion(true);
        try {
            const res = await MockApiService.resetRegion(region);
            showToast(res.data.message || `Region ${region} reset`, 'success');
        } catch (error) {
            showToast(handleApiError(error), 'error');
        } finally {
            setIsResettingRegion(false);
        }
    };

    const handleResetAll = async () => {
        if (!confirm(`WARNING: This will delete ALL mock data across ALL regions and reset to defaults. Proceed?`)) return;
        setIsResettingAll(true);
        try {
            const res = await MockApiService.resetAll();
            showToast(res.data.message || 'All mock data reset', 'success');
        } catch (error) {
            showToast(handleApiError(error), 'error');
        } finally {
            setIsResettingAll(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-100">Reset & Settings</h2>
                    <p className="text-sm text-slate-400">Manage mock environment state</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Reset Region */}
                <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                        <Icon icon="solar:eraser-bold" className="text-2xl" />
                    </div>
                    <div>
                        <h3 className="text-base font-medium text-amber-100">Reset Current Region</h3>
                        <p className="text-sm text-amber-400/70 mt-1">
                            Purge all EC2, Lambda, RDS, S3, and Volumes from <strong>{region}</strong>.
                        </p>
                    </div>
                    <button
                        onClick={handleResetRegion}
                        disabled={isResettingRegion}
                        className="mt-auto h-10 px-5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/20 transition-all flex items-center gap-2 w-full justify-center disabled:opacity-50"
                    >
                        {isResettingRegion ? <Icon icon="solar:refresh-circle-linear" className="animate-spin" /> : <Icon icon="solar:trash-bin-trash-linear" />}
                        Reset Region: {region}
                    </button>
                </div>

                {/* Reset All */}
                <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex flex-col items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                        <Icon icon="solar:danger-triangle-bold" className="text-2xl" />
                    </div>
                    <div>
                        <h3 className="text-base font-medium text-rose-100">Nuke Entire Environment</h3>
                        <p className="text-sm text-rose-400/70 mt-1">
                            Destroy all mock resources globally across every region and restore the default state.
                        </p>
                    </div>
                    <button
                        onClick={handleResetAll}
                        disabled={isResettingAll}
                        className="mt-auto h-10 px-5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-medium hover:bg-rose-500/20 transition-all flex items-center gap-2 w-full justify-center disabled:opacity-50"
                    >
                        {isResettingAll ? <Icon icon="solar:refresh-circle-linear" className="animate-spin" /> : <Icon icon="solar:bomb-emoji-linear" />}
                        Nuke Everything
                    </button>
                </div>

            </div>
        </div>
    );
}
