# Mock API Documentation

API endpoints for managing mock AWS resources. These endpoints only work when `USE_MOCK=true` is set in the environment.

**Base URL:** `/api/v1/mock`

---

## Table of Contents

- [Request Validation](#request-validation)
- [EC2](#ec2)
- [ECS](#ecs)
- [Lambda](#lambda)
- [RDS](#rds)
- [S3](#s3)
- [Volumes](#volumes)
- [Bulk Operations](#bulk-operations)
- [State Management](#state-management)
- [Data Storage](#data-storage)
- [Zombie Resource Behavior](#zombie-resource-behavior)
- [Available Regions](#available-regions)
- [Environment Variables](#environment-variables)

---

## Request Validation

All POST endpoints validate request bodies using `class-validator`. Invalid requests return a `400 Bad Request` with detailed error messages.

### Validation Error Response

```json
{
  "status": false,
  "message": "Validation failed",
  "data": {
    "path": "/api/v1/mock/ec2",
    "statusCode": 400,
    "message": "Validation failed",
    "errors": {
      "region": "region must be a string",
      "count": "count must not be greater than 100",
      "state": "state must be one of the following values: running, stopped"
    }
  }
}
```

### Common Validation Rules

| Field | Rules |
|-------|-------|
| `region` | Required string |
| `count` | Optional, min: 1, max: 100 |
| `isZombie` | Optional boolean |
| `state` | Enum: `running`, `stopped` |
| `runtime` | Enum: `nodejs18.x`, `nodejs16.x`, `python3.11`, `python3.10`, `java17`, `dotnet6`, `go1.x`, `ruby3.2` |
| `engine` | Enum: `postgres`, `mysql`, `mariadb`, `sqlserver-ex`, `oracle-se2` |
| `memorySize` | Min: 128, Max: 10240 |
| `zombieRatio` | Min: 0, Max: 1 |

---

## EC2

### Create EC2 Instances

```
POST /api/v1/mock/ec2
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `region` | string | Yes | - | AWS region (e.g., "us-east-1") |
| `instanceType` | string | No | "t3.micro" | EC2 instance type |
| `state` | string | No | "running" | Instance state: "running" or "stopped" |
| `tags` | object | No | {} | Key-value pairs for tags |
| `isZombie` | boolean | No | random | Force zombie metrics (low CPU, no tags) |
| `count` | number | No | 1 | Number of instances to create |

**Example Request:**
```json
{
  "region": "us-east-1",
  "instanceType": "t3.large",
  "state": "running",
  "tags": {
    "Environment": "production",
    "Team": "devops"
  },
  "isZombie": false,
  "count": 3
}
```

**Example Response:**
```json
{
  "status": true,
  "message": "Created 3 EC2 instance(s)",
  "data": {
    "instances": [
      {
        "InstanceId": "i-a1b2c3d4",
        "InstanceType": "t3.large",
        "State": { "Name": "running" },
        "LaunchTime": "2025-01-15T10:30:00.000Z",
        "Tags": [
          { "Key": "Environment", "Value": "production" },
          { "Key": "Team", "Value": "devops" }
        ],
        "CpuUtilization": 45.2,
        "NetworkIn": 50000,
        "NetworkOut": 35000
      }
    ]
  }
}
```

### List EC2 Instances

```
GET /api/v1/mock/ec2/:region
```

**Example Response:**
```json
{
  "status": true,
  "message": "EC2 instances retrieved",
  "data": {
    "Reservations": [
      {
        "Instances": [
          {
            "InstanceId": "i-a1b2c3d4",
            "InstanceType": "t3.large",
            "State": { "Name": "running" },
            "LaunchTime": "2025-01-15T10:30:00.000Z",
            "Tags": [...],
            "CpuUtilization": 45.2,
            "NetworkIn": 50000,
            "NetworkOut": 35000
          }
        ]
      }
    ]
  }
}
```

---

## ECS

### Create ECS Cluster

```
POST /api/v1/mock/ecs
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `region` | string | Yes | - | AWS region |
| `clusterName` | string | Yes | - | Name of the cluster |
| `services` | array | No | [] | Array of service configurations |

**Service Configuration:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `serviceName` | string | Yes | - | Service name |
| `runningCount` | number | Yes | - | Number of running tasks |
| `desiredCount` | number | Yes | - | Desired number of tasks |
| `status` | string | No | "ACTIVE" | Service status |

**Example Request:**
```json
{
  "region": "us-east-1",
  "clusterName": "production-cluster",
  "services": [
    {
      "serviceName": "api-service",
      "runningCount": 3,
      "desiredCount": 3,
      "status": "ACTIVE"
    },
    {
      "serviceName": "worker-service",
      "runningCount": 0,
      "desiredCount": 2,
      "status": "ACTIVE"
    }
  ]
}
```

### List ECS Clusters

```
GET /api/v1/mock/ecs/:region
```

**Example Response:**
```json
{
  "status": true,
  "message": "ECS clusters retrieved",
  "data": {
    "clusters": [
      {
        "clusterName": "production-cluster",
        "clusterArn": "arn:aws:ecs:us-east-1:123456789012:cluster/production-cluster",
        "runningTasksCount": 3,
        "services": [
          {
            "serviceName": "api-service",
            "status": "ACTIVE",
            "runningCount": 3,
            "desiredCount": 3,
            "clusterArn": "arn:aws:ecs:us-east-1:123456789012:cluster/production-cluster"
          }
        ]
      }
    ]
  }
}
```

---

## Lambda

### Create Lambda Functions

```
POST /api/v1/mock/lambda
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `region` | string | Yes | - | AWS region |
| `functionName` | string | Yes | - | Function name |
| `runtime` | string | No | "nodejs18.x" | Runtime environment |
| `memorySize` | number | No | 128 | Memory in MB |
| `isZombie` | boolean | No | random | Force zero invocations |
| `count` | number | No | 1 | Number of functions to create |

**Available Runtimes:**
- `nodejs18.x`
- `nodejs16.x`
- `python3.11`
- `python3.10`
- `java17`
- `dotnet6`
- `go1.x`
- `ruby3.2`

**Example Request:**
```json
{
  "region": "us-east-1",
  "functionName": "process-data",
  "runtime": "python3.11",
  "memorySize": 256,
  "isZombie": false,
  "count": 2
}
```

**Example Response:**
```json
{
  "status": true,
  "message": "Created 2 Lambda function(s)",
  "data": {
    "functions": [
      {
        "FunctionName": "process-data-1",
        "Runtime": "python3.11",
        "MemorySize": 256,
        "LastModified": "2025-01-10T08:15:30.000Z",
        "Invocations": 5000,
        "FunctionArn": "arn:aws:lambda:us-east-1:123456789012:function:process-data-1"
      }
    ]
  }
}
```

### List Lambda Functions

```
GET /api/v1/mock/lambda/:region
```

---

## RDS

### Create RDS Instances

```
POST /api/v1/mock/rds
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `region` | string | Yes | - | AWS region |
| `dbInstanceIdentifier` | string | Yes | - | Database identifier |
| `engine` | string | No | "postgres" | Database engine |
| `status` | string | No | "available" | Instance status |
| `isZombie` | boolean | No | random | Force low CPU/connections |
| `count` | number | No | 1 | Number of instances to create |

**Available Engines:**
- `postgres`
- `mysql`
- `mariadb`
- `sqlserver-ex`
- `oracle-se2`

**Example Request:**
```json
{
  "region": "us-east-1",
  "dbInstanceIdentifier": "production-db",
  "engine": "postgres",
  "isZombie": false,
  "count": 1
}
```

**Example Response:**
```json
{
  "status": true,
  "message": "Created 1 RDS instance(s)",
  "data": {
    "instances": [
      {
        "DBInstanceIdentifier": "production-db",
        "DBInstanceStatus": "available",
        "Engine": "postgres",
        "CpuUtilization": 25.5,
        "Connections": 45
      }
    ]
  }
}
```

### List RDS Instances

```
GET /api/v1/mock/rds/:region
```

---

## S3

### Create S3 Bucket

```
POST /api/v1/mock/s3
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `region` | string | Yes | - | AWS region |
| `bucketName` | string | Yes | - | Unique bucket name |

**Example Request:**
```json
{
  "region": "us-east-1",
  "bucketName": "my-app-data-bucket"
}
```

**Example Response:**
```json
{
  "status": true,
  "message": "S3 bucket created",
  "data": {
    "bucket": {
      "Name": "my-app-data-bucket",
      "CreationDate": "2024-06-15T12:00:00.000Z"
    }
  }
}
```

### List S3 Buckets

```
GET /api/v1/mock/s3/:region
```

**Example Response:**
```json
{
  "status": true,
  "message": "S3 buckets retrieved",
  "data": {
    "Buckets": [
      {
        "Name": "my-app-data-bucket",
        "CreationDate": "2024-06-15T12:00:00.000Z"
      }
    ]
  }
}
```

---

## Volumes

### Create EBS Volume

```
POST /api/v1/mock/volume
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `region` | string | Yes | - | AWS region |
| `status` | string | No | "available" | Volume status |
| `size` | number | No | random | Size in GB (10-110) |

**Available Status Values:**
- `available` - Unattached volume
- `in-use` - Attached to instance
- `creating` - Being created
- `deleting` - Being deleted

**Example Request:**
```json
{
  "region": "us-east-1",
  "status": "available",
  "size": 50
}
```

### List Volumes

```
GET /api/v1/mock/volume/:region
```

---

## Bulk Operations

### Create Multiple Resources

```
POST /api/v1/mock/bulk/:region
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `ec2Count` | number | No | 0 | Number of EC2 instances |
| `lambdaCount` | number | No | 0 | Number of Lambda functions |
| `rdsCount` | number | No | 0 | Number of RDS instances |
| `ecsClusters` | array | No | [] | Array of cluster configs |
| `s3Count` | number | No | 0 | Number of S3 buckets |
| `volumeCount` | number | No | 0 | Number of EBS volumes |
| `zombieRatio` | number | No | 0.3 | Ratio of zombie resources (0-1) |

**ECS Cluster Config:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `clusterName` | string | Yes | Cluster name |
| `services` | array | Yes | Array of service configs |

**Example Request:**
```json
{
  "ec2Count": 5,
  "lambdaCount": 3,
  "rdsCount": 2,
  "ecsClusters": [
    {
      "clusterName": "api-cluster",
      "services": [
        { "serviceName": "api", "runningCount": 3, "desiredCount": 3 },
        { "serviceName": "worker", "runningCount": 0, "desiredCount": 2 }
      ]
    }
  ],
  "s3Count": 2,
  "volumeCount": 4,
  "zombieRatio": 0.4
}
```

**Example Response:**
```json
{
  "status": true,
  "message": "Bulk resources created",
  "data": {
    "region": "us-east-1",
    "created": {
      "ec2": 5,
      "lambda": 3,
      "rds": 2,
      "ecs": 1,
      "s3": 2,
      "volumes": 4
    },
    "details": {
      "ec2": [...],
      "lambda": [...],
      "rds": [...],
      "ecs": [...],
      "s3": [...],
      "volumes": [...]
    }
  }
}
```

---

## State Management

### Reset All Mock Data

Clears all regions and restores default mock data.

```
POST /api/v1/mock/reset
```

**Example Response:**
```json
{
  "status": true,
  "message": "All mock data reset to defaults",
  "data": {}
}
```

### Reset Specific Region

Clears all resources in a specific region.

```
POST /api/v1/mock/reset/:region
```

**Example:**
```
POST /api/v1/mock/reset/us-east-1
```

**Example Response:**
```json
{
  "status": true,
  "message": "Region us-east-1 reset",
  "data": {
    "region": "us-east-1"
  }
}
```

---

## Data Storage

Mock data is persisted in **Redis** (not in-memory). This provides:

- **Persistence**: Data survives server restarts
- **Fast access**: Quick reads/writes for testing
- **No TTL**: Data remains until explicitly deleted or reset
- **Shared state**: Multiple server instances can share mock data

### Redis Keys

| Key Pattern | Description |
|-------------|-------------|
| `mock:region:{region}:ec2` | EC2 instances for region |
| `mock:region:{region}:ecs` | ECS clusters for region |
| `mock:region:{region}:lambda` | Lambda functions for region |
| `mock:region:{region}:rds` | RDS instances for region |
| `mock:region:{region}:s3` | S3 buckets for region |
| `mock:region:{region}:volumes` | EBS volumes for region |

### Clear Redis Mock Data

To manually clear all mock data from Redis:

```bash
redis-cli KEYS "mock:*" | xargs redis-cli DEL
```

---

## Zombie Resource Behavior

When `isZombie: true` or when randomly assigned (based on `zombieRatio`):

| Resource | Zombie Indicators |
|----------|-------------------|
| **EC2** | CPU < 2%, Network < 1KB, No tags |
| **Lambda** | 0-10 invocations/day |
| **RDS** | CPU < 5%, 0-2 connections |
| **ECS** | Running tasks = 0, Desired > 0 |

---

## Available Regions

Default mock regions:
- `us-east-1` (N. Virginia)
- `us-east-2` (Ohio)
- `us-west-1` (N. California)
- `us-west-2` (Oregon)
- `eu-west-1` (Ireland)
- `eu-west-2` (London)
- `eu-central-1` (Frankfurt)
- `ap-southeast-1` (Singapore)

Any valid AWS region string can be used - new regions are initialized automatically.

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `USE_MOCK` | Enable mock mode | `false` |
| `MOCK_ACCOUNT_ID` | Mock AWS account ID | `123456789012` |
| `MOCK_USER_ARN` | Mock user ARN | `arn:aws:iam::123456789012:user/mock-user` |
