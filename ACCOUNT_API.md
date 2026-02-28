# Account API Documentation

API endpoints for account summary and overview with AWS resource intelligence.

---

## Base URL

```
/api/v1/account
```

---

## Endpoints

### 1. Get Account Summary

Returns a high-level summary of AWS account resources.

**URL:** `POST /api/v1/account/summary`

**Request Body:**

```json
{
  "accountType": "mock" | "real",
  "credentials": {
    "accessKeyId": "string",
    "secretAccessKey": "string",
    "sessionToken": "string (optional)"
  },
  "region": "string (optional, default: us-east-1)"
}
```

**Example Request:**

```bash
curl -X POST http://localhost:8080/api/v1/account/summary \
  -H "Content-Type: application/json" \
  -d '{
    "accountType": "real",
    "credentials": {
      "accessKeyId": "AKIAIOSFODNN7EXAMPLE",
      "secretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
    },
    "region": "us-east-1"
  }'
```

**Example Response:**

```json
{
  "status": true,
  "message": "Account summary retrieved successfully",
  "data": {
    "accountId": "123456789012",
    "userArn": "arn:aws:iam::123456789012:user/admin",
    "totalRegions": 5,
    "totalRunningInstances": 12,
    "totalUnattachedVolumes": 3
  }
}
```

---

### 2. Get Account Overview

Returns detailed overview with resource intelligence (zombie detection and cost estimation).

**URL:** `POST /api/v1/account/overview?refresh=true`

**Query Parameters:**
- `refresh` (optional): Set to `true` to bypass cache and fetch fresh data

**Request Body:**

```json
{
  "accountType": "mock" | "real",
  "credentials": {
    "accessKeyId": "string",
    "secretAccessKey": "string",
    "sessionToken": "string (optional)"
  },
  "region": "string (optional, default: us-east-1)"
}
```

**Example Request:**

```bash
curl -X POST "http://localhost:8080/api/v1/account/overview?refresh=true" \
  -H "Content-Type: application/json" \
  -d '{
    "accountType": "mock",
    "region": "us-east-1"
  }'
```

**Example Response:**

```json
{
  "status": true,
  "message": "Account overview retrieved successfully",
  "data": {
    "accountId": "123456789012",
    "userArn": "arn:aws:iam::123456789012:user/admin",
    "overallZombieScore": 35,
    "regions": [
      {
        "region": "us-east-1",
        "ec2": {
          "running": 5,
          "avgCpuUtilization": 15.5,
          "zombieScore": 40,
          "instances": [
            {
              "instanceId": "i-1234567890abcdef0",
              "instanceType": "t3.large",
              "tags": { "Name": "web-server-1" },
              "intelligence": {
                "status": "zombie",
                "confidence": 80,
                "monthlyCost": 60
              }
            }
          ],
          "totalMonthlyCost": 300
        },
        "rds": {
          "running": 2,
          "avgCpuUtilization": 8.2,
          "zombieScore": 50,
          "instances": [
            {
              "dbInstanceIdentifier": "my-db",
              "dbInstanceStatus": "available",
              "engine": "postgres",
              "intelligence": {
                "status": "zombie",
                "confidence": 80,
                "monthlyCost": 120
              }
            }
          ],
          "totalMonthlyCost": 240
        },
        "ecs": {
          "services": 3,
          "runningTasks": 10,
          "zombieScore": 0,
          "servicesList": [
            {
              "serviceName": "api-service",
              "runningCount": 3,
              "desiredCount": 3,
              "clusterArn": "arn:aws:ecs:us-east-1:123456789012:cluster/my-cluster",
              "intelligence": {
                "status": "healthy",
                "confidence": 0,
                "monthlyCost": 90
              }
            }
          ],
          "totalMonthlyCost": 270
        },
        "lambda": {
          "functions": 8,
          "avgInvocations": 1250,
          "zombieScore": 0,
          "functionsList": [
            {
              "functionName": "process-data",
              "runtime": "nodejs18.x",
              "lastModified": "2024-01-15T10:30:00.000Z",
              "memorySize": 256,
              "intelligence": {
                "status": "healthy",
                "confidence": 0,
                "monthlyCost": 10
              }
            }
          ],
          "totalMonthlyCost": 80
        },
        "regionZombieScore": 23
      }
    ]
  }
}
```

---

## Resource Intelligence

Every running resource includes an `intelligence` object with:

| Field | Type | Description |
|-------|------|-------------|
| `status` | `"healthy" \| "zombie"` | Resource utilization status |
| `confidence` | `number (0-100)` | Zombie score - higher means more likely a zombie |
| `monthlyCost` | `number` | Estimated monthly cost in USD |

### Zombie Detection Rules

**EC2:**
- CPU < 2% → +40 points
- Network < 1KB → +30 points
- No tags → +10 points
- Score >= 60 = zombie

**RDS:**
- CPU < 5% → +50 points
- Connections < 2 → +30 points
- Score >= 60 = zombie

**Lambda:**
- Invocations < 5/day → +60 points
- Memory underutilized → +20 points
- Score >= 60 = zombie

**ECS:**
- Running = 0 AND Desired > 0 → +50 points
- Score >= 50 = zombie

### Cost Estimation

| Resource | Calculation |
|----------|-------------|
| EC2 | t3.micro: $8, t3.large: $60, etc. |
| RDS | Postgres: $120, MySQL: $100 |
| Lambda | $5 base at 128MB, scales with memory |
| ECS | $30 per running task |
| Volume | $0.10 per GB |

---

## Account Types

### Mock Account
Use for testing without real AWS credentials.

```json
{
  "accountType": "mock",
  "region": "us-east-1"
}
```

### Real Account
Use with actual AWS credentials.

```json
{
  "accountType": "real",
  "credentials": {
    "accessKeyId": "AKIA...",
    "secretAccessKey": "..."
  },
  "region": "us-east-1"
}
```

---

## Error Responses

**400 Bad Request - Validation Error:**

```json
{
  "status": false,
  "message": "Validation failed",
  "errors": [
    "accountType must be one of: mock, real"
  ]
}
```

**401 Unauthorized - Invalid Credentials:**

```json
{
  "status": false,
  "message": "AWS credentials are invalid"
}
```

**500 Internal Server Error:**

```json
{
  "status": false,
  "message": "Internal server error"
}
```

---

## Frontend Integration Example

```typescript
async function getAccountOverview(accountType: string, credentials?: AWSCredentials) {
  const response = await fetch('/api/v1/account/overview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accountType,
      credentials,
      region: 'us-east-1'
    })
  });

  const data = await response.json();

  if (data.status) {
    return data.data; // OverviewDTO
  } else {
    throw new Error(data.message);
  }
}

// Usage
const overview = await getAccountOverview('mock');
console.log(`Total monthly cost: $${overview.regions[0].ec2.totalMonthlyCost}`);
```
