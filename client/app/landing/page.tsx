"use client";

import React from "react";
import { Icon } from '@iconify/react';
import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden">

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-lg border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-linear-to-br from-purple-500/20 to-emerald-400/20 border border-white/10 flex items-center justify-center">
                            <Icon icon="solar:ghost-linear" className="text-emerald-400 text-lg" />
                        </div>
                        <span className="text-slate-50 font-semibold text-lg tracking-tighter">CWE</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <a href="#problem" className="hover:text-slate-50 transition-colors">The Problem</a>
                        <a href="#engine" className="hover:text-slate-50 transition-colors">Detection Engine</a>
                        <a href="#safety" className="hover:text-slate-50 transition-colors">Safety Guarantee</a>
                        <a href="#roi" className="hover:text-slate-50 transition-colors">ROI</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/connect" className="hidden md:block text-sm font-medium hover:text-slate-50 transition-colors">
                            Login
                        </Link>
                        <Link href="/connect" className="text-sm font-medium bg-slate-50 text-slate-950 px-4 py-2 rounded-md hover:bg-slate-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            Start Audit
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                {/* Background glows */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">

                    {/* Trust Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-white/5 shadow-sm mb-8">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-[pulse-subtle_3s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
                        <span className="text-xs font-medium text-slate-400 tracking-wide uppercase">Read-Only Access Verified</span>
                        <Icon icon="solar:shield-check-linear" className="text-slate-500 text-lg" />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-slate-50 max-w-4xl leading-[1.1]">
                        Stop Paying for <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-emerald-200">Ghosts</span> in Your Cloud.
                    </h1>

                    <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl font-light leading-relaxed">
                        Expose, explain, and safely eliminate zombie resources. The only Read-Only cloud auditor that prioritizes engineering judgment over blind automation.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                        <Link href="/connect" className="w-full sm:w-auto px-6 py-3 rounded-lg bg-linear-to-b from-purple-500 to-purple-700 text-white text-sm font-medium shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all border border-purple-400/30">
                            Scan Your Waste Map
                        </Link>
                        <Link href="#" className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-900 border border-white/10 text-slate-50 text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                            <Icon icon="solar:play-circle-linear" className="text-lg" />
                            Watch Demo
                        </Link>
                    </div>

                    {/* Dashboard Mockup */}
                    <div className="mt-20 w-full max-w-5xl rounded-2xl bg-[#0B0F19] border border-white/10 shadow-2xl overflow-hidden relative">
                        {/* Mac window controls */}
                        <div className="h-10 bg-slate-900/50 border-b border-white/5 flex items-center px-4 gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                            <div className="mx-auto flex items-center gap-2 text-xs text-slate-500 font-medium">
                                <Icon icon="solar:lock-keyhole-linear" />
                                read-only-audit.cwe
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                            {/* Metrics Sidebar */}
                            <div className="flex flex-col gap-4">
                                <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Total Waste Detected</div>
                                    <div className="text-3xl font-semibold text-emerald-400 tracking-tight">$14,280<span className="text-sm text-slate-500 font-normal">/mo</span></div>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-3">Zombie Distribution</div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Icon icon="solar:server-square-linear" className="text-slate-400 text-lg" />
                                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-purple-500 w-[45%]" />
                                            </div>
                                            <span className="text-xs text-slate-400 w-8 text-right">45%</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Icon icon="solar:hard-drive-linear" className="text-slate-400 text-lg" />
                                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-400 w-[30%]" />
                                            </div>
                                            <span className="text-xs text-slate-400 w-8 text-right">30%</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Icon icon="solar:global-linear" className="text-slate-400 text-lg" />
                                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-slate-500 w-[25%]" />
                                            </div>
                                            <span className="text-xs text-slate-400 w-8 text-right">25%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Abstract Waste Map */}
                            <div className="lg:col-span-2 relative min-h-[300px] rounded-xl border border-white/5 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-slate-900 to-[#0B0F19] flex items-center justify-center p-6">
                                {/* Grid lines */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px]" />

                                {/* Nodes Container */}
                                <div className="relative w-full max-w-md aspect-video flex items-center justify-center">
                                    {/* Center Node */}
                                    <div className="absolute w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center z-20 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                                        <Icon icon="solar:cloud-linear" className="text-slate-300 text-xl" />
                                    </div>

                                    {/* Connecting Lines */}
                                    <div className="absolute top-1/2 left-1/2 w-32 h-px bg-linear-to-r from-slate-600 to-emerald-500/50 -rotate-45 origin-left z-10" />
                                    <div className="absolute top-1/2 left-1/2 w-40 h-px bg-linear-to-r from-slate-600 to-purple-500/50 rotate-12 origin-left z-10" />
                                    <div className="absolute top-1/2 left-1/2 w-28 h-px bg-linear-to-l from-slate-600 to-slate-500/50 rotate-[160deg] origin-left z-10" />

                                    {/* Zombie Nodes */}
                                    <div className="absolute top-[10%] left-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-20">
                                        <div className="w-8 h-8 rounded-full bg-emerald-400/20 border border-emerald-400 flex items-center justify-center animate-[pulse-subtle_3s_cubic-bezier(0.4,0,0.6,1)_infinite] shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                                            <Icon icon="solar:server-square-linear" className="text-emerald-400 text-sm" />
                                        </div>
                                        <span className="text-[10px] bg-slate-900 border border-white/10 px-1.5 py-0.5 rounded text-slate-300">i-0a1b2c...</span>
                                    </div>

                                    <div className="absolute top-[70%] left-[90%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-20">
                                        <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                                            <Icon icon="solar:hard-drive-linear" className="text-purple-400 text-sm" />
                                        </div>
                                        <span className="text-[10px] bg-slate-900 border border-white/10 px-1.5 py-0.5 rounded text-slate-300">vol-09x8...</span>
                                    </div>

                                    <div className="absolute top-[30%] left-[10%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-20">
                                        <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center">
                                            <Icon icon="solar:global-linear" className="text-slate-400 text-xs" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The "Zombie" Problem */}
            <section id="problem" className="py-24 bg-slate-950 border-t border-white/5 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col items-center text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-50">Identify the Undead.</h2>
                        <p className="mt-4 text-slate-400 text-lg max-w-2xl font-light">Resources that drain your budget while providing zero value to production. We find them based on strict, transparent rules.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {[
                            { title: "Idle EC2 Instances", icon: "solar:server-square-linear", desc: "Compute resources that are powered on but doing absolutely nothing, accumulating hourly charges.", rule: "Rule: CPU < 2% for 7 days" },
                            { title: "Unattached EBS Volumes", icon: "solar:hard-drive-linear", desc: "Disks that were detached when a server was terminated but never deleted. Silent storage costs.", rule: "Rule: State = Available > 14 days" },
                            { title: "Orphaned IPs", icon: "solar:global-linear", desc: "Elastic IP addresses that are reserved but not attached to any running instance. AWS penalizes you for hoarding these.", rule: "Rule: Unassociated EIPs" },
                            { title: "Ancient Snapshots", icon: "solar:history-linear", desc: "Backups from years ago tied to infrastructure that no longer exists. Rarely needed, always billed.", rule: "Rule: Age > 90d & No active AMI" }
                        ].map((card, i) => (
                            <div key={i} className="group p-6 rounded-2xl bg-linear-to-b from-slate-900 to-slate-950 border border-white/5 hover:border-white/10 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center mb-6 group-hover:bg-slate-700 transition-colors">
                                    <Icon icon={card.icon} className="text-2xl text-slate-300 group-hover:text-emerald-400 transition-colors" />
                                </div>
                                <h3 className="text-xl font-medium text-slate-50 mb-2">{card.title}</h3>
                                <p className="text-sm text-slate-400 mb-6 font-light">{card.desc}</p>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-400/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                                    <Icon icon="solar:code-square-linear" />
                                    {card.rule}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The Detection Engine */}
            <section id="engine" className="py-24 bg-slate-900 border-t border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium uppercase tracking-wide mb-6">
                                Detection Engine
                            </div>
                            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-50 mb-6">
                                Explainable Logic, Not Black Box Magic.
                            </h2>
                            <p className="text-lg text-slate-400 font-light mb-8">
                                We don't just flag resources; we prove why they are waste. Our <strong className="font-medium text-slate-200">Zombie Confidence Score</strong> aggregates multiple data points so your engineering team can confidently say "delete" without fear of breaking production.
                            </p>

                            <ul className="space-y-4">
                                {[
                                    { title: "Multi-metric weighted scoring", desc: "Combines CPU utilization, network I/O, and lifecycle states." },
                                    { title: "Contextual Tag Analysis", desc: "Identifies environments (dev vs prod) to adjust risk weighting." },
                                    { title: "Customizable Rule Sandbox", desc: "Adjust thresholds globally or per-team to match your risk appetite." }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Icon icon="solar:check-circle-linear" className="text-emerald-400 text-xl shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-200">{item.title}</h4>
                                            <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-1 bg-linear-to-r from-emerald-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-50" />

                            <div className="relative bg-slate-950 border border-white/10 rounded-2xl p-6 shadow-2xl">
                                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-slate-900 border border-white/5 flex items-center justify-center">
                                            <Icon icon="solar:server-square-linear" className="text-slate-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-200 font-mono">i-0abcdef1234567890</div>
                                            <div className="text-xs text-slate-500">us-east-1a • t3.large</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">Confidence Score</div>
                                        <div className="text-2xl font-semibold text-emerald-400">92%</div>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <div className="flex justify-between text-xs mb-2">
                                            <span className="text-slate-400 flex items-center gap-1.5"><Icon icon="solar:cpu-linear" /> CPU Weight (40%)</span>
                                            <span className="text-emerald-400 font-mono">Max 1.2% / 14d</span>
                                        </div>
                                        <div className="w-full bg-slate-900 rounded-full h-1.5">
                                            <div className="bg-linear-to-r from-emerald-600 to-emerald-400 h-1.5 rounded-full w-[95%]" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-2">
                                            <span className="text-slate-400 flex items-center gap-1.5"><Icon icon="solar:routing-linear" /> Network I/O (30%)</span>
                                            <span className="text-emerald-400 font-mono">&lt; 5MB / 14d</span>
                                        </div>
                                        <div className="w-full bg-slate-900 rounded-full h-1.5">
                                            <div className="bg-linear-to-r from-emerald-600 to-emerald-400 h-1.5 rounded-full w-[88%]" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-2">
                                            <span className="text-slate-400 flex items-center gap-1.5"><Icon icon="solar:tag-linear" /> Tag Context (30%)</span>
                                            <span className="text-emerald-400 font-mono">env: sandbox</span>
                                        </div>
                                        <div className="w-full bg-slate-900 rounded-full h-1.5">
                                            <div className="bg-linear-to-r from-emerald-600 to-emerald-400 h-1.5 rounded-full w-[100%]" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                                    <div className="text-xs text-slate-500">Status: <span className="text-emerald-400 font-medium">Ready for Exorcism</span></div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400">Mark Ignore</span>
                                        <div className="w-8 h-4 bg-slate-800 rounded-full relative cursor-pointer border border-white/5">
                                            <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-slate-500 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Safety Guarantee */}
            <section id="safety" className="py-24 bg-slate-950 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-50">Exorcism without the Risk.</h2>
                        <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto font-light">Built for DevOps teams who know that deleting the wrong thing is worse than paying for waste.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Read-Only IAM Assumed", icon: "solar:shield-check-linear", iconColor: "text-purple-400", bgProps: "bg-purple-500/10 border-purple-500/20", desc: "We connect via strict Cross-Account Roles with ReadOnlyAccess. We literally cannot delete your infrastructure even if we wanted to." },
                            { title: "Zero Auto-Delete", icon: "solar:hand-stop-linear", iconColor: "text-slate-300", bgProps: "bg-slate-800 border-white/5", desc: "Unlike overzealous automation tools, we generate actionable reports and Jira tickets. A human engineer always makes the final call." },
                            { title: "Blast Radius Awareness", icon: "solar:radar-linear", iconColor: "text-emerald-400", bgProps: "bg-emerald-500/10 border-emerald-500/20", desc: "Before flagging an item, we map its dependencies. Is that \"idle\" EC2 actually part of a dormant disaster recovery Auto Scaling Group? We check." }
                        ].map((feature, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-6">
                                <div className={`w-16 h-16 rounded-full border flex items-center justify-center mb-6 ${feature.bgProps}`}>
                                    <Icon icon={feature.icon} className={`text-3xl ${feature.iconColor}`} />
                                </div>
                                <h3 className="text-lg font-medium text-slate-50 mb-3">{feature.title}</h3>
                                <p className="text-sm text-slate-400 font-light leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cost Savings (ROI Calculator) */}
            <section id="roi" className="py-24 bg-slate-900 border-t border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)]" />

                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <div className="bg-[#0B0F19] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">Calculate Your Haunting Costs</h2>
                            <p className="mt-3 text-sm text-slate-400">Industry average cloud waste is 32%. See what finding yours is worth.</p>
                        </div>

                        <div className="space-y-8 max-w-lg mx-auto">
                            {/* Fake Slider 1 */}
                            <div>
                                <div className="flex justify-between text-sm mb-4">
                                    <span className="text-slate-300 font-medium">Monthly AWS Spend</span>
                                    <span className="text-slate-50 font-mono">$50,000</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full w-full relative">
                                    <div className="absolute left-0 top-0 h-full bg-slate-600 rounded-full w-1/2" />
                                    <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-slate-300 rounded-full border-2 border-[#0B0F19] shadow cursor-ew-resize" />
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                                    <span>$1k</span>
                                    <span>$1M+</span>
                                </div>
                            </div>

                            {/* Fake Slider 2 */}
                            <div>
                                <div className="flex justify-between text-sm mb-4">
                                    <span className="text-slate-300 font-medium">Estimated Waste Factor</span>
                                    <span className="text-slate-50 font-mono">20%</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full w-full relative">
                                    <div className="absolute left-0 top-0 h-full bg-slate-600 rounded-full w-1/5" />
                                    <div className="absolute left-1/5 top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-slate-300 rounded-full border-2 border-[#0B0F19] shadow cursor-ew-resize" />
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                                    <span>5% (Optimized)</span>
                                    <span>40% (Messy)</span>
                                </div>
                            </div>

                            {/* Result */}
                            <div className="mt-10 p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-purple-500 to-transparent opacity-50" />
                                <div className="text-sm text-purple-300/80 uppercase tracking-widest font-medium mb-2">Potential Monthly Savings</div>
                                <div className="text-5xl font-semibold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-purple-200">
                                    $10,000
                                </div>
                                <div className="text-xs text-slate-500 mt-4">That's $120,000 annualized. What could your engineering team build with that?</div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 border-t border-white/5 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded bg-linear-to-br from-purple-500/20 to-emerald-400/20 border border-white/10 flex items-center justify-center">
                                    <Icon icon="solar:ghost-linear" className="text-emerald-400 text-sm" />
                                </div>
                                <span className="text-slate-50 font-semibold text-lg tracking-tighter">CWE</span>
                            </div>
                            <p className="text-sm text-slate-400 font-light max-w-sm mb-6">
                                We find the resources you're paying for but not using—and tell you exactly why. Exorcise your cloud waste safely.
                            </p>
                            <div className="flex items-center gap-4 text-slate-500">
                                <a href="#" className="hover:text-slate-300 transition-colors"><Icon icon="solar:link-circle-linear" className="text-xl" /></a>
                                <a href="#" className="hover:text-slate-300 transition-colors"><Icon icon="solar:letter-linear" className="text-xl" /></a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-slate-50 mb-4">Product</h4>
                            <ul className="space-y-3 text-sm text-slate-400 font-light">
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Waste Map</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Detection Engine</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Security</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Pricing</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-slate-50 mb-4">Resources</h4>
                            <ul className="space-y-3 text-sm text-slate-400 font-light">
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Zombie Rulesets</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact Support</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-slate-500 font-light">© 2024 Cloud Waste Exorcist. All rights reserved.</p>
                        <div className="flex items-center gap-6 text-xs text-slate-500 font-light">
                            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
