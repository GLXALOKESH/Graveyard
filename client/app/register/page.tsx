import React from 'react'
import LightRays from '../../components/LightRays'
import Link from 'next/link'
import { Icon } from '@iconify/react'

const Register = () => {
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

            {/* Registration Form Card */}
            <div className='w-full max-w-md p-8 md:p-10 rounded-3xl bg-[#0B0F19]/80 backdrop-blur-xl border border-white/10 shadow-2xl relative z-10 flex flex-col'>

                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <span className="text-[#5fe2ad] font-bold text-2xl tracking-tighter">GRAVEYARD</span>
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <h1 className='text-2xl font-semibold text-slate-50 tracking-tight'>Create an account</h1>
                    <p className="text-sm text-slate-400 mt-2 font-light">Join Graveyard and defeat your Cloud Zombies.</p>
                </div>

                <form className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-400 ml-1">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon icon="solar:user-linear" className="text-slate-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className='w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900/50 border border-white/10 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-light text-sm'
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-400 ml-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon icon="solar:letter-linear" className="text-slate-500" />
                            </div>
                            <input
                                type="email"
                                placeholder="john@example.com"
                                className='w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900/50 border border-white/10 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-light text-sm'
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-400 ml-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon icon="solar:lock-password-linear" className="text-slate-500" />
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className='w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900/50 border border-white/10 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-light text-sm'
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-400 ml-1">Confirm Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon icon="solar:shield-check-linear" className="text-slate-500" />
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className='w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900/50 border border-white/10 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-light text-sm'
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        className="w-full mt-2 h-11 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-400 text-slate-950 font-semibold text-sm shadow-[0_0_20px_rgba(52,211,153,0.2)] hover:shadow-[0_0_30px_rgba(52,211,153,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        Create Account
                        <Icon icon="solar:arrow-right-linear" className="text-lg" />
                    </button>

                    <div className="text-center mt-4 border-t border-white/5 pt-4">
                        <p className="text-sm text-slate-400 font-light">
                            Already have an account?{' '}
                            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                                Login here
                            </Link>
                        </p>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default Register