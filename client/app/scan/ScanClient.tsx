"use client";

import React, { useState, useEffect, useRef } from 'react';
import LightRays from '../../components/LightRays';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- Utilities ---
const generateLogTimestamp = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
};

// Fake logs grouped by phase to simulate a realistic scan
const scanPhases = [
    {
        id: 'auth',
        title: 'Authenticating',
        duration: 1500,
        logs: [
            { type: 'info', msg: 'Assuming IAM Role...' },
            { type: 'success', msg: 'Authenticated successfully via cross-account role.' }
        ]
    },
    {
        id: 'regions',
        title: 'Discovering Regions',
        duration: 2500,
        logs: [
            { type: 'info', msg: 'Querying enabled AWS regions...' },
            { type: 'info', msg: 'Found 4 active regions: us-east-1, us-west-2, eu-central-1, ap-south-1.' },
            { type: 'success', msg: 'Region discovery complete.' }
        ]
    },
    {
        id: 'compute',
        title: 'Scanning Compute & DBs',
        duration: 4000,
        logs: [
            { type: 'info', msg: '[us-east-1] Scanning EC2 instances...' },
            { type: 'warning', msg: '[us-east-1] Found 3 stopped instances older than 90 days.' },
            { type: 'info', msg: '[us-west-2] Scanning RDS instances...' },
            { type: 'warning', msg: '[us-west-2] Found 1 RDS instance with 0 connections in 14 days.' },
            { type: 'info', msg: '[eu-central-1] Scanning EC2 instances...' },
            { type: 'success', msg: 'Compute scan finished. 14 potential zombies identified.' }
        ]
    },
    {
        id: 'storage',
        title: 'Checking Storage & Networking',
        duration: 3500,
        logs: [
            { type: 'info', msg: 'Scanning for unattached EBS volumes...' },
            { type: 'warning', msg: 'Found 12 unattached EBS volumes (850 GB total).' },
            { type: 'info', msg: 'Scanning for unassociated Elastic IPs...' },
            { type: 'warning', msg: 'Found 4 orphaned EIPs.' },
            { type: 'info', msg: 'Analyzing EBS Snapshots...' },
            { type: 'success', msg: 'Storage & Network scan complete.' }
        ]
    },
    {
        id: 'analysis',
        title: 'Analyzing Waste Patterns',
        duration: 2500,
        logs: [
            { type: 'info', msg: 'Correlating CloudWatch metrics with found resources...' },
            { type: 'info', msg: 'Calculating Confidence Scores...' },
            { type: 'info', msg: 'Generating cost waste estimates...' },
            { type: 'success', msg: 'Analysis complete. Waste Map is ready.' }
        ]
    }
];

export default function ScanClient() {
    const router = useRouter();
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [logs, setLogs] = useState<{ time: string, type: string, msg: string }[]>([]);
    const [scanComplete, setScanComplete] = useState(false);
    const logsEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logs
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    // Orchestrate the scan phases and logs
    useEffect(() => {
        if (scanComplete) return;

        let isMounted = true;

        const runScan = async () => {
            for (let i = 0; i < scanPhases.length; i++) {
                if (!isMounted) return;

                setCurrentPhaseIndex(i);
                const phase = scanPhases[i];

                // Distribute logs evenly across the phase duration
                const logInterval = phase.duration / (phase.logs.length + 1);

                for (let j = 0; j < phase.logs.length; j++) {
                    await new Promise(resolve => setTimeout(resolve, logInterval));
                    if (!isMounted) return;

                    setLogs(prev => [...prev, {
                        time: generateLogTimestamp(),
                        type: phase.logs[j].type,
                        msg: phase.logs[j].msg
                    }]);
                }

                // Wait for the rest of the phase duration
                await new Promise(resolve => setTimeout(resolve, logInterval));
            }

            if (isMounted) {
                setScanComplete(true);
                // After completion, wait a second then automatically forward to dashboard (simulated)
                setTimeout(() => {
                    // For now, redirect to a "dashboard" placeholder or alert
                    // alert("Scan Complete. Redirecting to Waste Map...");
                    // router.push("/dashboard"); 
                }, 2000);
            }
        };

        runScan();

        return () => {
            isMounted = false;
        };
    }, [scanComplete, router]);

    return (
        <div className='min-h-screen w-full bg-[#020618] text-slate-300 font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-hidden relative flex flex-col items-center justify-center p-6'>

            {/* Background effects */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <LightRays
                    raysOrigin="top-center"
                    raysColor={scanComplete ? "#5fe2ad" : "#8b5cf6"} // Shifts to green on complete
                    raysSpeed={scanComplete ? 0.5 : 2} // Faster during scan
                    lightSpread={1}
                    rayLength={2}
                    pulsating={!scanComplete}
                    fadeDistance={1}
                    saturation={1}
                    followMouse={false}
                    noiseAmount={0.05} // Adds a tiny bit of static during scan
                    distortion={scanComplete ? 0 : 0.2}
                />
            </div>

            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
            <div className={`absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none z-0 transition-colors duration-1000 ${scanComplete ? 'bg-emerald-500/10' : 'bg-slate-500/5'}`} />

            {/* Header */}
            <div className="flex flex-col items-center mb-10 z-10">
                <div className="w-16 h-16 rounded-2xl bg-[#0B0F19] border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(139,92,246,0.15)] relative">
                    {scanComplete ? (
                        <Icon icon="solar:check-circle-bold" className="text-emerald-400 text-3xl" />
                    ) : (
                        <>
                            <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                            <Icon icon="solar:radar-linear" className="text-purple-400 text-3xl animate-pulse" />
                        </>
                    )}
                </div>
                <h1 className='text-3xl font-bold text-slate-50 tracking-tight text-center'>
                    {scanComplete ? "Scan Complete" : "Exorcism in Progress"}
                </h1>
                <p className="text-sm text-slate-400 mt-2 font-light text-center max-w-md">
                    {scanComplete
                        ? "We've mapped your cloud waste. Generating your personalized cost savings report."
                        : "Safely mapping your AWS environment. Searching for idle instances, unattached volumes, and forgotten snapshots."}
                </p>
            </div>

            {/* Main Content Grid */}
            <div className='w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10'>

                {/* Left Side: Stepper */}
                <div className='lg:col-span-5 p-6 md:p-8 rounded-3xl bg-[#0B0F19]/80 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col h-[500px]'>
                    <h3 className="text-sm font-semibold text-slate-200 mb-6 uppercase tracking-wider flex items-center gap-2">
                        <Icon icon="solar:list-bold" className="text-slate-500" />
                        Scan Progress
                    </h3>

                    <div className="flex flex-col gap-6 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[15px] top-[24px] bottom-[24px] w-px bg-slate-800 z-0" />

                        {scanPhases.map((phase, index) => {
                            const isPast = index < currentPhaseIndex;
                            const isCurrent = index === currentPhaseIndex && !scanComplete;
                            const isFuture = index > currentPhaseIndex && !scanComplete;

                            return (
                                <div key={phase.id} className="flex items-start gap-4 z-10 relative">
                                    {/* Icon Indicator */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-300 bg-[#0B0F19] ${isPast || scanComplete
                                            ? 'border-emerald-500 text-emerald-400'
                                            : isCurrent
                                                ? 'border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                                                : 'border-slate-800 text-slate-600'
                                        }`}>
                                        {isPast || scanComplete ? (
                                            <Icon icon="solar:check-read-linear" className="text-lg" />
                                        ) : isCurrent ? (
                                            <Icon icon="solar:refresh-circle-linear" className="text-lg animate-spin" />
                                        ) : (
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                        )}
                                    </div>

                                    {/* Text */}
                                    <div className="flex flex-col pt-1">
                                        <span className={`text-sm font-medium transition-colors duration-300 ${isPast || scanComplete ? 'text-emerald-400' : isCurrent ? 'text-slate-50' : 'text-slate-500'
                                            }`}>
                                            {phase.title}
                                        </span>
                                        {isCurrent && (
                                            <span className="text-xs text-purple-400 animate-pulse mt-1">Working...</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Side: Live Logs Terminal */}
                <div className='lg:col-span-7 rounded-3xl bg-[#060810]/90 backdrop-blur-xl border border-white/5 shadow-2xl flex flex-col h-[500px] overflow-hidden font-mono'>
                    {/* Terminal Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0B0F19]/50">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-slate-700/50" />
                                <div className="w-3 h-3 rounded-full bg-slate-700/50" />
                                <div className="w-3 h-3 rounded-full bg-slate-700/50" />
                            </div>
                            <span className="text-xs text-slate-500 ml-2">cwe-engine-v2.1.0</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            {scanComplete ? (
                                <span className="flex items-center gap-1"><Icon icon="solar:stop-circle-bold" className="text-emerald-500" /> Finished</span>
                            ) : (
                                <span className="flex items-center gap-1"><Icon icon="solar:record-circle-bold" className="text-red-500 animate-pulse" /> Live</span>
                            )}
                        </div>
                    </div>

                    {/* Terminal Body */}
                    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar text-xs leading-relaxed space-y-1.5">
                        <div className="text-slate-500 mb-4">
                            [{generateLogTimestamp()}] [SYSTEM] Initializing Exorcist Scan Engine...<br />
                            [{generateLogTimestamp()}] [SYSTEM] Target: Connected AWS Account (ID: 987654321098)<br />
                            [{generateLogTimestamp()}] [SYSTEM] Mode: Read-Only Audit
                        </div>

                        {logs.map((log, i) => (
                            <div key={i} className={`flex gap-3 hover:bg-white/5 px-2 py-1 rounded-sm transition-colors ${log.type === 'error' ? 'text-red-400' :
                                    log.type === 'warning' ? 'text-amber-400' :
                                        log.type === 'success' ? 'text-emerald-400' :
                                            'text-slate-300'
                                }`}>
                                <span className="text-slate-600 shrink-0">[{log.time}]</span>
                                <span className="font-semibold shrink-0">
                                    [{log.type === 'error' ? 'ERR' : log.type.toUpperCase()}]
                                </span>
                                <span className="break-words">{log.msg}</span>
                            </div>
                        ))}

                        {/* Blinking cursor while running */}
                        {!scanComplete && (
                            <div className="px-2 py-1 text-slate-500 animate-pulse">
                                _
                            </div>
                        )}
                        <div ref={logsEndRef} />
                    </div>
                </div>

            </div>

            {/* CTA Appears when done */}
            <div className={`mt-10 transition-all duration-1000 transform ${scanComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <Link href="/dashboard" className="px-8 py-3 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-400 text-slate-950 font-semibold shadow-[0_0_20px_rgba(52,211,153,0.2)] hover:shadow-[0_0_30px_rgba(52,211,153,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                    View Waste Map
                    <Icon icon="solar:arrow-right-linear" className="text-lg" />
                </Link>
            </div>

        </div>
    );
}
