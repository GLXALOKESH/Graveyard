import React from 'react'
import LightRays from '../../components/LightRays'
import Link from 'next/link'
import { Icon } from '@iconify/react'

const ConnectCloud = () => {
    // Mock data for saved connections
    const savedConnections = [
        {
            id: 1,
            name: "Production AWS",
            type: "Real AWS Environment",
            status: "Connected",
            lastScanned: "2 hours ago",
            icon: "logos:aws"
        },
        {
            id: 2,
            name: "Staging Sandbox",
            type: "Real AWS Environment",
            status: "Connected",
            lastScanned: "1 day ago",
            icon: "logos:aws"
        },
        {
            id: 3,
            name: "Local Dev Test",
            type: "Mock API (Testing)",
            status: "Inactive",
            lastScanned: "1 week ago",
            icon: "solar:server-square-bold-duotone"
        }
    ];

    return (
        <div className='min-h-screen w-full bg-[#020618] text-slate-300 font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-hidden relative flex items-center justify-center p-6'>

            {/* Background effects */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#5fe2ad"
                    raysSpeed={1}
                    lightSpread={1}
                    rayLength={2}
                    pulsating={false}
                    fadeDistance={1}
                    saturation={1}
                    followMouse
                    mouseInfluence={0.1}
                    noiseAmount={0}
                    distortion={0}
                />
            </div>

            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

            {/* Main Content Grid */}
            <div className='w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 my-8'>

                {/* Left Side: Create New Connection Form */}
                <div className='p-8 md:p-10 rounded-3xl bg-[#0B0F19]/80 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col'>

                    {/* Logo and Back Link */}
                    <div className="flex justify-between items-center mb-8">
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <span className="text-[#5fe2ad] font-bold text-xl tracking-tighter">GRAVEYARD</span>
                        </Link>
                        <Link href="/" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                            <Icon icon="solar:arrow-left-linear" />
                            Back to Home
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h2 className='text-2xl font-semibold text-slate-50 tracking-tight'>Connect AWS Account</h2>
                        <p className="text-sm text-slate-400 mt-2 font-light">Link a new environment to start scanning for zombies.</p>
                    </div>

                    {/* Info Box */}
                    <div className="mb-6 rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-4 flex gap-3 items-start">
                        <Icon icon="solar:shield-check-bold" className="text-indigo-400 text-xl shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-indigo-300">Read-Only Access Required</span>
                            <span className="text-xs text-indigo-200/70 font-light leading-relaxed">We only require 'ViewOnlyAccess' or custom read permissions. We will <strong className="text-indigo-300 font-semibold">never</strong> modify or delete your resources automatically.</span>
                        </div>
                    </div>

                    <form className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-400 ml-1">Connection Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Icon icon="solar:tag-horizontal-linear" className="text-slate-500" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="e.g. Production Account"
                                    className='w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900/50 border border-white/10 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-light text-sm'
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-400 ml-1">Access Key ID</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Icon icon="solar:key-linear" className="text-slate-500" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="AKIAIOSFODNN7EXAMPLE"
                                    className='w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900/50 border border-white/10 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-light text-sm font-mono'
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-400 ml-1">Secret Access Key</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Icon icon="solar:password-minimalistic-linear" className="text-slate-500" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                                    className='w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900/50 border border-white/10 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-light text-sm font-mono'
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-400 ml-1">Environment Type</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Icon icon="solar:server-square-linear" className="text-slate-500 z-10" />
                                </div>
                                <select
                                    className='w-full h-11 pl-10 pr-10 rounded-xl bg-slate-900/50 border border-white/10 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-light text-sm appearance-none cursor-pointer'
                                    defaultValue="aws"
                                >
                                    <option value="aws" className="bg-[#0B0F19]">Real AWS Environment</option>
                                    <option value="mock" className="bg-[#0B0F19]">Mock API (Testing)</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Icon icon="solar:alt-arrow-down-linear" className="text-slate-500" />
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full mt-2 h-11 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-400 text-slate-950 font-semibold text-sm shadow-[0_0_20px_rgba(52,211,153,0.2)] hover:shadow-[0_0_30px_rgba(52,211,153,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            Connect Environment
                            <Icon icon="solar:plug-circle-linear" className="text-lg" />
                        </button>

                    </form>
                </div>

                {/* Right Side: Saved Connections */}
                <div className='p-8 md:p-10 rounded-3xl bg-[#0B0F19]/40 backdrop-blur-xl border border-white/5 flex flex-col h-full'>
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className='text-2xl font-semibold text-slate-50 tracking-tight'>Saved Connections</h2>
                            <p className="text-sm text-slate-400 mt-2 font-light">Manage your existing cloud environments.</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center border border-white/5">
                            <span className="text-sm font-medium text-emerald-400">{savedConnections.length}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                        {savedConnections.map((conn) => (
                            <div key={conn.id} className="group p-5 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-emerald-500/30 hover:bg-slate-900/80 transition-all flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#0B0F19] border border-white/10 flex items-center justify-center shrink-0">
                                        <Icon icon={conn.icon} className={conn.icon === "logos:aws" ? "text-2xl" : "text-2xl text-slate-400"} />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium text-slate-200">{conn.name}</h3>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${conn.status === 'Connected' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'}`}>
                                                {conn.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">{conn.type}</p>
                                        <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400">
                                            <Icon icon="solar:clock-circle-linear" />
                                            Last scanned: {conn.lastScanned}
                                        </div>
                                    </div>
                                </div>

                                <button className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                                    <Icon icon="solar:menu-dots-bold" />
                                </button>
                            </div>
                        ))}

                        {savedConnections.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 text-center h-full border-2 border-dashed border-white/5 rounded-2xl">
                                <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 text-slate-500">
                                    <Icon icon="solar:ghost-smile-linear" className="text-3xl" />
                                </div>
                                <h3 className="text-slate-300 font-medium">No environments found</h3>
                                <p className="text-sm text-slate-500 mt-2 max-w-[200px]">Connect an account to start scanning for zombies.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ConnectCloud