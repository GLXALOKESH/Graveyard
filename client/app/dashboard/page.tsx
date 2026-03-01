"use client";

import React, { useMemo, useState, useCallback } from 'react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, BackgroundVariant, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { CloudNode, RegionNode, ServiceNode, ResourceNode } from '../../components/mock/map/CustomNodes';
import { mockTreeData, generateLayout, transformApiToTree, getStatusFromConfidence } from './layoutUtils';
import { AccountApiService } from '../../services/mockApi';
import { handleApiError } from '../../services/mockApi';

// Register the custom nodes inside the component or outside
const nodeTypes = {
    cloudNode: CloudNode,
    regionNode: RegionNode,
    serviceNode: ServiceNode,
    resourceNode: ResourceNode,
};

export default function WasteMapDashboard() {
    // Generate initial layout
    const initialLayout = useMemo(() => generateLayout(mockTreeData), []);

    const [nodes, setNodes, onNodesChange] = useNodesState<any>(initialLayout.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<any>(initialLayout.edges);
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const [treeData, setTreeData] = useState<any>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        const loadOrFetchData = async () => {
            setIsLoading(true);
            const savedData = localStorage.getItem('aws_dashboard_data');

            // Check if user hit browser refresh to trigger a re-fetch
            let isReload = false;
            if (typeof window !== 'undefined' && window.performance) {
                const navEntries = window.performance.getEntriesByType('navigation');
                if (navEntries.length > 0 && (navEntries[0] as PerformanceNavigationTiming).type === 'reload') {
                    isReload = true;
                } else if (window.performance.navigation && window.performance.navigation.type === 1) {
                    isReload = true;
                }
            }

            // Check for real environment
            let isRealEnv = false;
            const configStr = localStorage.getItem('aws_dashboard_config');
            let parsedConfig: any = null;
            if (configStr) {
                parsedConfig = JSON.parse(configStr);
                if (parsedConfig.accountType === 'real') {
                    isRealEnv = true;
                }
            }

            // 1. Initial Load from Scan (Fast Cache)
            // If it's a real environment AND user refreshed the page, skip cache to get fresh live data
            if (savedData && !(isReload && isRealEnv) && !isReload) {
                try {
                    const parsedData = transformApiToTree(JSON.parse(savedData));
                    setTreeData(parsedData);
                    const newLayout = generateLayout(parsedData);
                    setNodes(newLayout.nodes);
                    setEdges(newLayout.edges);
                    setIsLoading(false);
                    return; // Return early, don't fetch
                } catch (e) {
                    console.error("Failed to parse cached data", e);
                }
            }

            // 2. Refresh or First Load (No Cache) -> Fetch Live Data
            try {
                const configStr = localStorage.getItem('aws_dashboard_config');
                let apiConfig = { accountType: 'mock', credentials: { accessKeyId: "mock-key", secretAccessKey: "mock-secret" } } as any;
                if (configStr) {
                    const parsed = JSON.parse(configStr);
                    apiConfig = {
                        accountType: parsed.accountType,
                        ...(parsed.credentials ? { credentials: parsed.credentials } : {}),
                        ...(parsed.region ? { region: parsed.region } : {})
                    };
                }

                const res = await AccountApiService.getOverview(apiConfig, true); // force refresh

                if (res.data?.data) {
                    localStorage.setItem('aws_dashboard_data', JSON.stringify(res.data.data));
                    const parsedTree = transformApiToTree(res.data.data);
                    setTreeData(parsedTree);
                    const newLayout = generateLayout(parsedTree);
                    setNodes(newLayout.nodes);
                    setEdges(newLayout.edges);
                }
            } catch (err) {
                console.error("Failed to fetch account overview", err);
                setError(handleApiError(err));

                // Fallback to cache if fetch fails
                if (savedData) {
                    try {
                        const parsedTree = transformApiToTree(JSON.parse(savedData));
                        setTreeData(parsedTree);
                        const newLayout = generateLayout(parsedTree);
                        setNodes(newLayout.nodes);
                        setEdges(newLayout.edges);
                    } catch (e) { }
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadOrFetchData();
    }, [setNodes, setEdges]);

    const visibleNodes = useMemo(() => {
        if (filterStatus === 'all') return nodes;
        return nodes.map(n => {
            if (n.type === 'resourceNode') {
                const statusObj = getStatusFromConfidence(n.data.confidence || 0);
                return { ...n, hidden: statusObj.key !== filterStatus };
            }
            return n;
        });
    }, [nodes, filterStatus]);

    const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
        setSelectedNode(node);
    }, []);

    // Calculate Summary Metrics
    const metrics = useMemo(() => {
        let totalWaste = 0;
        let zombieCount = 0;
        let highestCost = 0;
        let highestCostId = "N/A";
        let totalResources = 0;

        nodes.forEach(n => {
            if (n.type === 'resourceNode') {
                totalResources++;
                const statusObj = getStatusFromConfidence(n.data.confidence || 0);
                if (statusObj.key === 'zombie' || statusObj.key === 'likely_zombie') {
                    zombieCount++;
                    const cost = Number(n.data.monthlyCost) || 0;
                    totalWaste += cost;
                    if (cost > highestCost) {
                        highestCost = cost;
                        highestCostId = String(n.data.id);
                    }
                }
            }
        });

        return { totalWaste, zombieCount, totalResources, highestCost, highestCostId };
    }, [nodes]);

    const regionSummaries = useMemo(() => {
        if (!treeData || !treeData.children) return [];
        return treeData.children.filter((c: any) => c.type === 'region').map((region: any) => {
            let tRes = 0;
            let zs = 0;
            let sumConf = 0;
            let sumCost = 0;

            region.children?.forEach((svc: any) => {
                svc.children?.forEach((res: any) => {
                    tRes++;
                    sumConf += res.confidence || 0;
                    sumCost += res.monthlyCost || 0;
                    const s = getStatusFromConfidence(res.confidence || 0);
                    if (s.key === 'zombie' || s.key === 'likely_zombie') zs++;
                });
            });

            return {
                name: region.name,
                totalResources: tRes,
                zombies: zs,
                avgConfidence: tRes > 0 ? (sumConf / tRes).toFixed(0) : 0,
                cost: sumCost
            };
        });
    }, [treeData]);

    return (
        <div className="flex h-screen bg-[#020618] font-sans selection:bg-emerald-500/30 selection:text-emerald-200">

            {/* Interactive Waste Map (Left Panel) */}
            <div className="flex-1 relative border-r border-white/5 bg-[#0B0F19]">
                <ReactFlow
                    nodes={visibleNodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={onNodeClick}
                    nodeTypes={nodeTypes}
                    fitView
                    fitViewOptions={{ padding: 0.2 }}
                    minZoom={0.1}
                    maxZoom={2}
                    className="xyflow-dark"
                >
                    <Background variant={BackgroundVariant.Dots as any} gap={24} size={2} color="rgba(255,255,255,0.05)" />
                    <Controls className="bg-slate-900 border-white/10 fill-slate-300" />
                    <Panel position="top-left" className="m-4">
                        <div className="px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-2xl flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <Icon icon="solar:map-bold" className="text-emerald-400 text-lg" />
                            </div>
                            <div>
                                <h1 className="text-sm font-bold text-slate-100 tracking-tight">Interactive Waste Map</h1>
                                <p className="text-[10px] text-slate-400">
                                    {isLoading ? 'Loading live data...' : error ? 'Showing cached/mock data' : 'Live Data Active'} • Scroll to zoom • Drag to pan
                                </p>
                            </div>
                            <div className="h-6 w-px bg-white/10 mx-2"></div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-slate-800 text-xs text-slate-200 pl-3 pr-8 py-1.5 rounded border border-white/10 focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"
                            >
                                <option value="all">View: All Resources</option>
                                <option value="healthy">Healthy</option>
                                <option value="warning">Warning</option>
                                <option value="suspect">Suspect</option>
                                <option value="likely_zombie">Likely Zombie</option>
                                <option value="zombie">Zombie</option>
                            </select>
                        </div>
                    </Panel>
                </ReactFlow>
            </div>

            {/* Summary Panel (Right Panel) */}
            <div className="w-80 lg:w-96 bg-[#060810] flex flex-col shrink-0 custom-scrollbar overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-white/5 sticky top-0 bg-[#060810]/95 backdrop-blur-md z-10">
                    <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        <Icon icon="solar:chart-pie-bold" className="text-amber-400" />
                        Executive Summary
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Real-time mock environment analysis</p>
                </div>

                <div className="p-6 flex flex-col gap-6">
                    {/* Primary Metric: Total Waste */}
                    <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.05)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                            <Icon icon="solar:dollar-minimalistic-bold" className="text-8xl text-rose-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon icon="solar:danger-triangle-bold" className="text-rose-500" />
                                <h3 className="text-xs font-bold text-rose-400/80 uppercase tracking-widest">Total Monthly Waste</h3>
                            </div>
                            <div className="text-4xl font-black text-rose-100 tracking-tighter">
                                ${metrics.totalWaste.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    </div>

                    {/* Cleanup Action CTA */}
                    <Link href="/cleanup" className="w-full relative group overflow-hidden rounded-xl p-0.5 pointer-events-auto">
                        <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-sky-500 opacity-70 group-hover:opacity-100 transition-opacity blur-sm"></div>
                        <div className="relative bg-[#060810] px-4 py-3 rounded-[10px] flex items-center justify-between transition-all group-hover:bg-[#060810]/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                    <Icon icon="solar:magic-stick-3-bold" className="text-emerald-400 text-lg" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-100">Cleanup Planner</span>
                                    <span className="text-[10px] text-slate-400">Generate safe remediation scripts</span>
                                </div>
                            </div>
                            <Icon icon="solar:alt-arrow-right-linear" className="text-emerald-400 text-lg group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    {/* Secondary Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-slate-900 border border-white/5">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Zombie Resources</div>
                            <div className="text-2xl font-bold text-amber-200">
                                {metrics.zombieCount} <span className="text-sm text-slate-500 font-medium">/ {metrics.totalResources}</span>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-900 border border-white/5">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Clean Resources</div>
                            <div className="text-2xl font-bold text-emerald-400">
                                {metrics.totalResources - metrics.zombieCount}
                            </div>
                        </div>
                    </div>

                    {/* Highest Cost Offender */}
                    <div className="p-4 rounded-xl bg-linear-to-br from-amber-500/10 to-rose-500/5 border border-amber-500/20">
                        <div className="flex items-center gap-2 mb-3">
                            <Icon icon="solar:target-bold" className="text-amber-400" />
                            <h3 className="text-xs text-amber-200/80 uppercase font-bold tracking-widest">Highest Cost Offender</h3>
                        </div>
                        <div className="bg-black/40 rounded-lg p-3 border border-white/5 flex items-center justify-between">
                            <span className="font-mono text-xs text-rose-300 truncate pr-4">{metrics.highestCostId}</span>
                            <span className="font-bold text-rose-400 text-sm whitespace-nowrap">${metrics.highestCost.toFixed(2)}/mo</span>
                        </div>
                    </div>

                    {/* Region Summaries */}
                    {regionSummaries.length > 0 && (
                        <div className="mt-2 space-y-3">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                                <Icon icon="solar:globus-bold" />
                                Region Breakdowns
                            </h3>
                            {regionSummaries.map((r: any, i: number) => (
                                <div key={i} className="bg-slate-900/40 rounded-xl p-4 border border-white/5">
                                    <h4 className="text-sm font-bold text-slate-200 mb-3">{r.name}</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <div className="text-[10px] text-slate-500">Resources</div>
                                            <div className="text-sm font-semibold text-slate-300">{r.totalResources}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-slate-500">Zombies</div>
                                            <div className="text-sm font-semibold text-amber-500">{r.zombies}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-slate-500">Avg Confidence</div>
                                            <div className="text-sm font-semibold text-sky-400">{r.avgConfidence}%</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-slate-500">Cost/mo</div>
                                            <div className="text-sm font-semibold text-rose-400">${r.cost.toFixed(2)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Selected Node Details */}
                    {selectedNode && (
                        <div className="mt-4 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                                <Icon icon="solar:info-circle-linear" className="text-sky-400" />
                                Selected Element Scope
                            </h3>
                            <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500">Type</span>
                                    <span className="text-xs font-medium text-slate-300 capitalize">{selectedNode.type.replace('Node', '')}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500">Name/ID</span>
                                    <span className="text-xs font-mono text-sky-300 max-w-[150px] truncate" title={selectedNode.data.label}>{selectedNode.data.label}</span>
                                </div>
                                {selectedNode.type === 'resourceNode' && (
                                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
                                        <span className="text-xs text-slate-400">Calculated State</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded ${getStatusFromConfidence(selectedNode.data.confidence || 0).color}`}>
                                            {getStatusFromConfidence(selectedNode.data.confidence || 0).label}
                                        </span>
                                    </div>
                                )}
                                {selectedNode.data.monthlyCost > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-500">Est. Waste</span>
                                        <span className="text-xs font-bold text-rose-400">${selectedNode.data.monthlyCost}/mo</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
