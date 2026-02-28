import { Icon } from '@iconify/react';
import GhostCursor from './GhostCursor';


export default function DashboardMockup() {
  return (
    <div className="mt-20 w-full max-w-5xl rounded-2xl bg-[#0B0F19] border border-white/10 shadow-2xl overflow-hidden relative">
      <style jsx>{`\n        @keyframes fade-in-up {\n          from { opacity: 0; transform: translateY(10px); }\n          to { opacity: 1; transform: translateY(0); }\n        }\n      `}</style>
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
        <div className="lg:col-span-2 relative min-h-[300px] rounded-xl border border-white/5 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-slate-900 to-[#0B0F19] flex items-center justify-center p-6 overflow-hidden">
          <GhostCursor
            color="#B19EEF"
            brightness={2}
            edgeIntensity={0}
            trailLength={50}
            inertia={0.5}
            grainIntensity={0.05}
            bloomStrength={0.1}
            bloomRadius={1}
            bloomThreshold={0.025}
            fadeDelayMs={1000}
            fadeDurationMs={1500}
          />
          
          {/* Graveyard reveal */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-6xl font-extrabold text-emerald-400 opacity-0 animate-[fade-in-up_0.8s_ease-out_forwards]" style={{ animationDelay: '0.3s' }}>
              Graveyard
            </span>
            <span className="mt-2 text-sm text-slate-400 opacity-0 animate-[fade-in-up_0.8s_ease-out_forwards]" style={{ animationDelay: '1.2s' }}>
              our project name
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
