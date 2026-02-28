"use client";

import React, { useState } from 'react';
import MockSidebar from '../../components/mock/MockSidebar';
import MockHeader from '../../components/mock/MockHeader';
import { ToastProvider } from '../../components/mock/ToastProvider';
import Ec2Panel from '../../components/mock/panels/Ec2Panel';
import EcsPanel from '../../components/mock/panels/EcsPanel';
import LambdaPanel from '../../components/mock/panels/LambdaPanel';
import RdsPanel from '../../components/mock/panels/RdsPanel';
import S3Panel from '../../components/mock/panels/S3Panel';
import VolumePanel from '../../components/mock/panels/VolumePanel';
import BulkPanel from '../../components/mock/panels/BulkPanel';
import SettingsPanel from '../../components/mock/panels/SettingsPanel';

export default function MockDashboardPage() {
    const [activeTab, setActiveTab] = useState('ec2');
    const [region, setRegion] = useState('us-east-1');

    const renderPanel = () => {
        switch (activeTab) {
            case 'ec2':
                return <Ec2Panel region={region} />;
            case 'ecs':
                return <EcsPanel region={region} />;
            case 'lambda':
                return <LambdaPanel region={region} />;
            case 'rds':
                return <RdsPanel region={region} />;
            case 's3':
                return <S3Panel region={region} />;
            case 'volume':
                return <VolumePanel region={region} />;
            case 'bulk':
                return <BulkPanel region={region} />;
            case 'settings':
                return <SettingsPanel region={region} />;
            default:
                return null;
        }
    };

    return (
        <ToastProvider>
            <div className="flex h-screen bg-[#020618] font-sans overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
                {/* Sidebar */}
                <MockSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    <MockHeader region={region} setRegion={setRegion} />

                    <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        {/* Panel Container */}
                        <div className="w-full max-w-6xl mx-auto space-y-6">
                            {renderPanel()}
                        </div>
                    </main>
                </div>
            </div>
        </ToastProvider>
    );
}
