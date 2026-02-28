import axios from 'axios';

const API_BASE_URL = 'https://jpcft5nn-8099.inc1.devtunnels.ms/api/v1/mock';
const ACCOUNT_API_BASE_URL = 'https://jpcft5nn-8099.inc1.devtunnels.ms/api/v1/account';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const accountApiClient = axios.create({
    baseURL: ACCOUNT_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface ApiError {
    statusCode: number;
    message: string;
    errors?: Record<string, string>;
}
export const lsd = "dd";
// Helper to extract error message
export const handleApiError = (error: any): string => {
    if (axios.isAxiosError(error)) {
        if (error.response?.data?.data?.errors) {
            const errors = error.response.data.data.errors;
            return Object.values(errors).join(', ');
        }
        return error.response?.data?.message || error.message || 'An error occurred';
    }
    return 'An unexpected error occurred';
};

// --- Interfaces based on MOCK_API.md ---

// EC2
export interface CreateEc2Params {
    region: string;
    instanceType?: string;
    state?: 'running' | 'stopped';
    tags?: Record<string, string>;
    isZombie?: boolean;
    count?: number;
}

// ECS
export interface EcsServiceConfig {
    serviceName: string;
    runningCount: number;
    desiredCount: number;
    status?: string;
}

export interface CreateEcsParams {
    region: string;
    clusterName: string;
    services?: EcsServiceConfig[];
}

// Lambda
export interface CreateLambdaParams {
    region: string;
    functionName: string;
    runtime?: 'nodejs18.x' | 'nodejs16.x' | 'python3.11' | 'python3.10' | 'java17' | 'dotnet6' | 'go1.x' | 'ruby3.2';
    memorySize?: number;
    isZombie?: boolean;
    count?: number;
}

// RDS
export interface CreateRdsParams {
    region: string;
    dbInstanceIdentifier: string;
    engine?: 'postgres' | 'mysql' | 'mariadb' | 'sqlserver-ex' | 'oracle-se2';
    status?: string;
    isZombie?: boolean;
    count?: number;
}

// S3
export interface CreateS3Params {
    region: string;
    bucketName: string;
}

// Volumes
export interface CreateVolumeParams {
    region: string;
    status?: 'available' | 'in-use' | 'creating' | 'deleting';
    size?: number;
    isZombie?: boolean;
    count?: number; // Added count as it's common, though not explicitly in the docs for single create
}

// Bulk
export interface BulkCreateParams {
    ec2Count?: number;
    lambdaCount?: number;
    rdsCount?: number;
    ecsClusters?: CreateEcsParams[];
    s3Count?: number;
    volumeCount?: number;
    zombieRatio?: number;
}


export const MockApiService = {
    // EC2
    createEc2: (data: CreateEc2Params) => apiClient.post('/ec2', data),
    getEc2: (region: string) => apiClient.get(`/ec2/${region}`),

    // ECS
    createEcs: (data: CreateEcsParams) => apiClient.post('/ecs', data),
    getEcs: (region: string) => apiClient.get(`/ecs/${region}`),

    // Lambda
    createLambda: (data: CreateLambdaParams) => apiClient.post('/lambda', data),
    getLambda: (region: string) => apiClient.get(`/lambda/${region}`),

    // RDS
    createRds: (data: CreateRdsParams) => apiClient.post('/rds', data),
    getRds: (region: string) => apiClient.get(`/rds/${region}`),

    // S3
    createS3: (data: CreateS3Params) => apiClient.post('/s3', data),
    getS3: (region: string) => apiClient.get(`/s3/${region}`),

    // Volumes
    createVolume: (data: CreateVolumeParams) => apiClient.post('/volume', data),
    getVolume: (region: string) => apiClient.get(`/volume/${region}`),

    // Bulk Operations
    createBulk: (region: string, data: BulkCreateParams) => apiClient.post(`/bulk/${region}`, data),

    // State Management
    resetAll: () => apiClient.post('/reset'),
    resetRegion: (region: string) => apiClient.post(`/reset/${region}`),
};

// --- Account API ---
export interface AccountOverviewParams {
    accountType: 'mock' | 'real';
    credentials?: {
        accessKeyId: string;
        secretAccessKey: string;
        sessionToken?: string;
    };
    region?: string;
}

export const AccountApiService = {
    getOverview: (data: AccountOverviewParams, refresh: boolean = true) =>
        accountApiClient.post(`/overview?refresh=${refresh}`, data)
};
