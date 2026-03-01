"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import LightRays from '../../components/LightRays';

interface ZombieResource {
    id: string;
    type: string;
    region: string;
    confidence: number;
    monthlyCost: number;
    risk: 'Low' | 'Medium' | 'High';
    action: string;
    reason: string;
    cliCommand: string | null;
    isGenerating?: boolean;
}

export default function CleanupRecommendationPage() {
    const [zombies, setZombies] = useState<ZombieResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = () => {
            const savedData = localStorage.getItem('aws_dashboard_data');
            if (savedData) {
                try {
                    const apiData = JSON.parse(savedData);
                    let detectedZombies: ZombieResource[] = [];

                    if (apiData.regions && Array.isArray(apiData.regions)) {
                        apiData.regions.forEach((r: any) => {
                            const region = r.region || 'unknown-region';

                            // EC2
                            if (r.ec2?.instances) {
                                r.ec2.instances.forEach((i: any) => {
                                    const conf = i.intelligence?.confidence || 0;
                                    if (conf >= 60) {
                                        detectedZombies.push({
                                            id: i.instanceId,
                                            type: 'EC2 Instance',
                                            region,
                                            confidence: conf,
                                            monthlyCost: i.intelligence?.monthlyCost || 0,
                                            risk: conf >= 90 ? 'Low' : conf >= 75 ? 'Medium' : 'High',
                                            action: 'Stop or terminate idle instance',
                                            reason: 'This instance has exhibited zero CPU utilization and no network traffic for an extended period.',
                                            cliCommand: null
                                        });
                                    }
                                });
                            }

                            // RDS
                            if (r.rds?.instances) {
                                r.rds.instances.forEach((i: any) => {
                                    const conf = i.intelligence?.confidence || 0;
                                    if (conf >= 60) {
                                        detectedZombies.push({
                                            id: i.dbInstanceIdentifier,
                                            type: 'RDS Database',
                                            region,
                                            confidence: conf,
                                            monthlyCost: i.intelligence?.monthlyCost || 0,
                                            risk: conf >= 90 ? 'Low' : conf >= 75 ? 'Medium' : 'High',
                                            action: 'Take snapshot and delete DB instance',
                                            reason: 'This database has zero connections and no query activity for 14+ days.',
                                            cliCommand: null
                                        });
                                    }
                                });
                            }

                            // ECS
                            if (r.ecs?.servicesList) {
                                r.ecs.servicesList.forEach((i: any) => {
                                    const conf = i.intelligence?.confidence || 0;
                                    if (conf >= 60) {
                                        detectedZombies.push({
                                            id: i.serviceName,
                                            type: 'ECS Service',
                                            region,
                                            confidence: conf,
                                            monthlyCost: i.intelligence?.monthlyCost || 0,
                                            risk: conf >= 90 ? 'Low' : conf >= 75 ? 'Medium' : 'High',
                                            action: 'Scale desired count to zero',
                                            reason: 'Running tasks but receiving no traffic from load balancers or internal services.',
                                            cliCommand: null
                                        });
                                    }
                                });
                            }

                            // Lambda
                            if (r.lambda?.functionsList) {
                                r.lambda.functionsList.forEach((i: any) => {
                                    const conf = i.intelligence?.confidence || 0;
                                    if (conf >= 60) {
                                        detectedZombies.push({
                                            id: i.functionName,
                                            type: 'Lambda Function',
                                            region,
                                            confidence: conf,
                                            monthlyCost: i.intelligence?.monthlyCost || 0,
                                            risk: conf >= 90 ? 'Low' : conf >= 75 ? 'Medium' : 'High',
                                            action: 'Archive and delete function',
                                            reason: 'Function has not been invoked in over 90 days.',
                                            cliCommand: null
                                        });
                                    }
                                });
                            }
                        });
                    }

                    detectedZombies.sort((a, b) => b.confidence - a.confidence);
                    setZombies(detectedZombies);

                } catch (e) {
                    console.error("Failed to parse cached data", e);
                }
            }
            setIsLoading(false);
        };

        loadData();
    }, []);

    const { totalSavings, totalAnnual } = useMemo(() => {
        const sum = zombies.reduce((acc, curr) => acc + curr.monthlyCost, 0);
        return {
            totalSavings: sum,
            totalAnnual: sum * 12
        };
    }, [zombies]);

    const handleGenerateScript = async (zombieId: string) => {
        setZombies(prev => prev.map(z => z.id === zombieId ? { ...z, isGenerating: true } : z));
        try {
            const tempZombie = zombies.find(z => z.id === zombieId);
            if (!tempZombie) return;

            const res = await fetch('/api/generate-cli', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: tempZombie.type,
                    id: tempZombie.id,
                    region: tempZombie.region,
                    action: tempZombie.action,
                    reason: tempZombie.reason
                })
            });
            const data = await res.json();
            setZombies(prev => prev.map(z => z.id === zombieId ? { ...z, cliCommand: data.command || '# Failed to decode', isGenerating: false } : z));
        } catch (e) {
            setZombies(prev => prev.map(z => z.id === zombieId ? { ...z, cliCommand: '# Error connecting to AI', isGenerating: false } : z));
        }
    };

    const handleDownloadPlan = () => {
        let content = `#!/bin/bash\n# Graveyard Cleanup Script\n# Generated on: ${new Date().toISOString()}\n\n`;
        content += `# WARNING: All cleanup actions are recommendations only. Review before execution.\n\n`;

        zombies.forEach(z => {
            content += `# ---------------------------------------------------------\n`;
            content += `# Type: ${z.type} | Region: ${z.region} | ID: ${z.id}\n`;
            content += `# Reason: ${z.reason}\n`;
            content += `# Estimated Monthly Savings: $${z.monthlyCost.toFixed(2)}\n`;
            content += `# ---------------------------------------------------------\n`;
            content += `${z.cliCommand || '# Command not generated yet. Please click "Generate AWS CLI Script (AI)" in UI.'}\n\n`;
        });

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `graveyard-cleanup-plan.sh`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const getRiskStyles = (risk: string) => {
        switch (risk) {
            case 'Low': return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
            case 'Medium': return 'border-amber-500/30 bg-amber-500/10 text-amber-400';
            case 'High': return 'border-rose-500/30 bg-rose-500/10 text-rose-400';
            default: return 'border-slate-500/30 bg-slate-500/10 text-slate-400';
        }
    };

    const getRiskIcon = (risk: string) => {
        switch (risk) {
            case 'Low': return 'solar:check-circle-bold';
            case 'Medium': return 'solar:danger-circle-bold';
            case 'High': return 'solar:bomb-bold';
            default: return 'solar:info-circle-bold';
        }
    };

    const getRiskLabel = (risk: string) => {
        switch (risk) {
            case 'Low': return 'Low risk (no dependencies)';
            case 'Medium': return 'Medium risk (needs review)';
            case 'High': return 'High risk (dependencies exist)';
            default: return risk;
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#020618] text-slate-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 relative pb-20">
            {/* Background effects */}
            <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none z-0 overflow-hidden">
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#5fe2ad"
                    raysSpeed={0.5}
                    lightSpread={1}
                    rayLength={1.5}
                    pulsating={false}
                    followMouse={false}
                    distortion={0.1}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-12 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <Link href="/dashboard" className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors w-fit mb-4">
                            <Icon icon="solar:arrow-left-linear" /> Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-bold text-slate-50 tracking-tight flex items-center gap-3">
                            <Icon icon="solar:magic-stick-3-bold" className="text-emerald-400" />
                            Cleanup Recommendations
                        </h1>
                        <p className="text-slate-400 mt-2 font-light text-lg max-w-2xl">
                            We don't just detect problems — we help you fix them safely. Review the identified zombie resources and generate safe, non-destructive remediation plans using AI.
                        </p>
                    </div>

                    {/* Aggregate Impact Summary */}
                    <div className="flex items-center gap-6 p-6 rounded-3xl bg-[#0B0F19]/80 backdrop-blur-xl border border-white/10 shadow-2xl shrink-0 h-full">
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Selected Zombies</span>
                            <span className="text-3xl font-bold text-slate-200">{zombies.length}</span>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-emerald-500/80 uppercase tracking-widest mb-1">Est. Monthly Savings</span>
                            <span className="text-3xl font-black text-emerald-400 tracking-tighter">${totalSavings.toFixed(2)}</span>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden sm:block" />
                        <div className="hidden sm:flex flex-col">
                            <span className="text-xs font-semibold text-emerald-500/80 uppercase tracking-widest mb-1">Est. Annual Savings</span>
                            <span className="text-3xl font-black text-emerald-400 tracking-tighter">${totalAnnual.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Main Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-[#0B0F19]/50 backdrop-blur-md p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                        <Icon icon="solar:shield-warning-bold" className="text-amber-500 text-xl" />
                        <span className="text-sm font-medium text-slate-300">
                            All cleanup actions are recommendations only. No resources are modified by this system.
                        </span>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">

                        <button
                            onClick={handleDownloadPlan}
                            disabled={zombies.length === 0}
                            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-400 text-slate-950 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:scale-[1.02] transition-all text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Icon icon="solar:download-minimalistic-bold" />
                            Download Cleanup Plan
                        </button>
                    </div>
                </div>

                {/* Zombies List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                    </div>
                ) : zombies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center rounded-3xl bg-[#0B0F19]/40 border border-white/5">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                            <Icon icon="solar:shield-check-bold" className="text-5xl text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-200 mb-2">Your Environment is Clean!</h3>
                        <p className="text-slate-400">No high-confidence zombie resources detected in your scope.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {zombies.map((zombie, idx) => (
                            <div key={`${zombie.id}-${idx}`} className="group bg-[#0B0F19]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-colors shadow-lg">

                                {/* Top Row: Resource Details */}
                                <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                    <div className="col-span-1 md:col-span-4 flex flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{zombie.type}</span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                            <span className="text-xs text-slate-400">{zombie.region}</span>
                                        </div>
                                        <span className="font-mono text-sm text-slate-200 truncate pr-4">{zombie.id}</span>
                                    </div>

                                    <div className="col-span-1 md:col-span-2 flex flex-col">
                                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Confidence</span>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${zombie.confidence >= 90 ? 'bg-emerald-500' : zombie.confidence >= 75 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                    style={{ width: `${zombie.confidence}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-slate-300">{zombie.confidence}%</span>
                                        </div>
                                    </div>

                                    <div className="col-span-1 md:col-span-2 flex flex-col">
                                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Est. Cost</span>
                                        <span className="text-lg font-bold text-emerald-400">${zombie.monthlyCost.toFixed(2)}</span>
                                    </div>

                                    <div className="col-span-1 md:col-span-4 flex justify-end">
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getRiskStyles(zombie.risk)}`}>
                                            <Icon icon={getRiskIcon(zombie.risk)} className="text-sm" />
                                            <span className="text-xs font-bold">{getRiskLabel(zombie.risk)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Intermediate Row: Action & Reason */}
                                <div className="px-6 py-4 bg-slate-900/50 border-t border-white/5 flex flex-col md:flex-row md:items-center gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Icon icon="solar:lightbulb-bold" className="text-sky-400" />
                                            <span className="text-sm font-semibold text-slate-200">{zombie.action}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 font-light pl-6">{zombie.reason}</p>
                                    </div>
                                </div>

                                {/* Bottom Row: CLI Script */}
                                <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between min-h-[72px]">
                                    {!zombie.cliCommand ? (
                                        <button
                                            onClick={() => handleGenerateScript(zombie.id)}
                                            disabled={zombie.isGenerating}
                                            className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-xs font-semibold flex items-center gap-2"
                                        >
                                            {zombie.isGenerating ? (
                                                <><Icon icon="solar:spinner-linear" className="animate-spin" /> Generating AI Script...</>
                                            ) : (
                                                <><Icon icon="solar:magic-stick-3-bold" /> Generate AWS CLI Script (AI)</>
                                            )}
                                        </button>
                                    ) : (
                                        <>
                                            <div className="flex-1 overflow-x-auto custom-scrollbar w-full">
                                                <code className="text-xs text-emerald-300/80 whitespace-nowrap font-mono block py-1">
                                                    {zombie.cliCommand}
                                                </code>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (zombie.cliCommand) copyToClipboard(zombie.cliCommand);
                                                }}
                                                className="shrink-0 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors text-xs font-medium flex items-center gap-2"
                                            >
                                                <Icon icon="solar:copy-linear" />
                                                Copy Command
                                            </button>
                                        </>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
