import { hierarchy, tree } from 'd3-hierarchy';
import { Node, Edge } from '@xyflow/react';

export function getStatusFromConfidence(confidence: number) {
    if (confidence >= 70) return { label: "Zombie", color: "bg-red-500", key: "zombie" };
    if (confidence >= 60) return { label: "Likely Zombie", color: "bg-orange-500", key: "likely_zombie" };
    if (confidence >= 40) return { label: "Suspect", color: "bg-yellow-500", key: "suspect" };
    if (confidence >= 20) return { label: "Warning", color: "bg-blue-500", key: "warning" };
    return { label: "Healthy", color: "bg-green-500", key: "healthy" };
}

// Example Mock Data Structure Matching the User Request + extended for realistic feel
export const mockTreeData = {
    name: "Graveyard Mock Account",
    type: "cloud",
    children: [
        {
            name: "us-east-1",
            type: "region",
            children: [
                {
                    name: "EC2 Instances",
                    type: "service",
                    children: [
                        { id: "i-0abc12345def67890", name: "i-0abc...", type: "resource", confidence: 10, monthlyCost: 0 },
                        { id: "i-0987654321fedcba0", name: "i-0987...", type: "resource", confidence: 95, monthlyCost: 14.50 },
                        { id: "i-11112222333344445", name: "i-1111...", type: "resource", confidence: 99, monthlyCost: 350.00 }
                    ]
                },
                {
                    name: "RDS Databases",
                    type: "service",
                    children: [
                        { id: "production-db-main", name: "production-db-...", type: "resource", confidence: 5, monthlyCost: 0 },
                        { id: "dev-test-db-old", name: "dev-test-...", type: "resource", confidence: 90, monthlyCost: 850.00 }
                    ]
                }
            ]
        },
        {
            name: "ap-south-1",
            type: "region",
            children: [
                {
                    name: "Lambda Functions",
                    type: "service",
                    children: [
                        { id: "image-processor-v1", name: "image-process...", type: "resource", confidence: 85, monthlyCost: 2.50 },
                        { id: "api-handler", name: "api-handler", type: "resource", confidence: 0, monthlyCost: 0 }
                    ]
                }
            ]
        }
    ]
};

// Layout parameters
// Layout parameters
const nodeWidth = 260;
const nodeHeight = 100;
const horizontalSpacing = 450; // Distance between parent and child layers
const verticalSpacing = 200;    // Distance between siblings

export const generateLayout = (data: any) => {
    // 1. Create a hierarchy from the nested data
    const root = hierarchy(data);

    // 2. We use d3's tree layout. 
    // We set nodeSize to roughly the dimensions of our custom nodes + padding.
    // The tree layout usually goes top-to-bottom. We'll swap x/y for left-to-right.
    const treeLayout = tree<any>().nodeSize([verticalSpacing, horizontalSpacing]);
    treeLayout(root);

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Keep track of vertical offsets per depth to create a staggered, "shattered" look
    const depthOffsets: Record<number, number> = {};

    // 3. Traverse the positioned tree and build React Flow nodes and edges
    root.each((d) => {
        // Swap x and y to make the tree layout horizontal (Left to Right)
        let x = d.y || 0;
        let y = d.x || 0;

        // Apply a staggered vertical offset for resource nodes to give them a shattered look
        if (d.data.type === 'resource') {
            const depth = d.depth;
            if (depthOffsets[depth] === undefined) {
                depthOffsets[depth] = 0;
            }
            // Add an oscillating vertical offset
            const staggerOffset = (depthOffsets[depth] % 3) * 120; // 0, 120, 240
            y += staggerOffset;
            depthOffsets[depth]++;
        }

        // Determine node type for xyflow to use the correct custom component
        let type = 'resourceNode';
        if (d.data.type === 'cloud') type = 'cloudNode';
        if (d.data.type === 'region') type = 'regionNode';
        if (d.data.type === 'service') type = 'serviceNode';

        nodes.push({
            id: d.data.id || d.data.name,
            type,
            position: { x, y },
            data: {
                label: d.data.name,
                id: d.data.id || d.data.name,
                status: d.data.status,
                confidence: d.data.confidence,
                monthlyCost: d.data.monthlyCost,
                isMock: d.data.type === 'cloud'
            }
        });

        // If it has a parent, create an edge from the parent to this node
        if (d.parent) {
            // Determine visual style based on confidence
            const isResource = d.data.type === 'resource';
            const itemConf = d.data.confidence || 0;
            const statusObj = getStatusFromConfidence(itemConf);
            const isZombiePath = isResource && itemConf >= 60; // Animated for likely zombie / zombie

            let edgeColor = 'rgba(255, 255, 255, 0.1)';
            if (isResource) {
                if (statusObj.key === 'zombie' || statusObj.key === 'likely_zombie') edgeColor = 'rgba(244, 63, 94, 0.5)'; // red/rose
                else if (statusObj.key === 'suspect') edgeColor = 'rgba(234, 179, 8, 0.5)'; // yellow
                else if (statusObj.key === 'warning') edgeColor = 'rgba(59, 130, 246, 0.5)'; // blue
            }

            edges.push({
                id: `e-${d.parent.data.id || d.parent.data.name}-${d.data.id || d.data.name}`,
                source: d.parent.data.id || d.parent.data.name,
                target: d.data.id || d.data.name,
                type: 'smoothstep', // Gives nicely routed orthogonal lines
                animated: isZombiePath,
                style: {
                    stroke: edgeColor,
                    strokeWidth: 2,
                }
            });
        }
    });

    return { nodes, edges };
};

export const transformApiToTree = (apiData: any) => {
    const root = {
        name: `Account: ${apiData.accountId || 'Unknown'}`,
        type: 'cloud',
        children: [] as any[]
    };

    if (!apiData.regions || !Array.isArray(apiData.regions)) return root;

    apiData.regions.forEach((regionData: any) => {
        const regionNode = {
            name: regionData.region,
            type: 'region',
            children: [] as any[]
        };

        // EC2
        if (regionData.ec2?.instances?.length > 0) {
            const ec2Node = {
                name: 'EC2 Instances',
                type: 'service',
                children: regionData.ec2.instances.map((i: any) => ({
                    id: i.instanceId || i.dbInstanceIdentifier || i.serviceName || i.functionName,
                    name: i.instanceId || i.dbInstanceIdentifier || i.serviceName || i.functionName,
                    type: 'resource',
                    confidence: i.intelligence?.confidence || 0,
                    monthlyCost: i.intelligence?.monthlyCost || 0
                }))
            };
            regionNode.children.push(ec2Node);
        }

        // RDS
        if (regionData.rds?.instances?.length > 0) {
            const rdsNode = {
                name: 'RDS Databases',
                type: 'service',
                children: regionData.rds.instances.map((i: any) => ({
                    id: i.dbInstanceIdentifier,
                    name: i.dbInstanceIdentifier,
                    type: 'resource',
                    status: i.intelligence?.status?.toLowerCase() === 'zombie' ? (i.intelligence?.confidence > 85 ? 'risky_zombie' : 'zombie') : 'healthy',
                    confidence: i.intelligence?.confidence || 0,
                    monthlyCost: i.intelligence?.monthlyCost || 0
                }))
            };
            regionNode.children.push(rdsNode);
        }

        // ECS
        if (regionData.ecs?.servicesList?.length > 0) {
            const ecsNode = {
                name: 'ECS Services',
                type: 'service',
                children: regionData.ecs.servicesList.map((i: any) => ({
                    id: i.serviceName,
                    name: i.serviceName,
                    type: 'resource',
                    status: i.intelligence?.status?.toLowerCase() === 'zombie' ? (i.intelligence?.confidence > 85 ? 'risky_zombie' : 'zombie') : 'healthy',
                    confidence: i.intelligence?.confidence || 0,
                    monthlyCost: i.intelligence?.monthlyCost || 0
                }))
            };
            regionNode.children.push(ecsNode);
        }

        // Lambda
        if (regionData.lambda?.functionsList?.length > 0) {
            const lambdaNode = {
                name: 'Lambda Functions',
                type: 'service',
                children: regionData.lambda.functionsList.map((i: any) => ({
                    id: i.functionName,
                    name: i.functionName,
                    type: 'resource',
                    status: i.intelligence?.status?.toLowerCase() === 'zombie' ? (i.intelligence?.confidence > 85 ? 'risky_zombie' : 'zombie') : 'healthy',
                    confidence: i.intelligence?.confidence || 0,
                    monthlyCost: i.intelligence?.monthlyCost || 0
                }))
            };
            regionNode.children.push(lambdaNode);
        }

        if (regionNode.children.length > 0) {
            root.children.push(regionNode);
        }
    });

    return root;
};
