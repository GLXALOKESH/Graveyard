# Graveyard
> AI-powered Cloud Zombie Detection & Recommendation Engine

Graveyard is a cloud infrastructure intelligence system built to detect underutilized, idle, or wasteful cloud resources and recommend what to do next using AI. It supports both real AWS accounts (via read-only IAM credentials) and a mock cloud environment for safe testing.

---

## 🚀 Features

### 🔍 Zombie Resource Scanner
- Detects idle compute resources across EC2, RDS, Lambda, ECS, and more
- Computes resource utilization, monthly cost estimation, and zombie confidence scores

### 🧠 AI Recommendation Engine
- Provides intelligent action suggestions for each flagged resource
- Generates AWS CLI commands for safe remediation
- Uses `gemini-2.5-flash:generatecontent` model via Google AIStudio

### 📊 Dashboard (Frontend)
- Visualizes resource status and intelligence
- Color-coded confidence badges
- Click to view AI recommendations
- Filters for easy exploration (Healthy, Warning, Suspect, Zombie)

### 🛠️ Mock Cloud Mode
- Full mock backend to simulate AWS responses
- Enables safe testing without AWS account
- Supports reset and bulk generation of mock resources

### 📈 Cost & Optimization Insight
- Monthly cost summaries
- Overall region and account zombie scores
- Potential savings estimation

---

## 📁 Repo Structure

```

GRAVEYARD/
│
├── client/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── services/
│   ├── .gitignore
│   ├── components.json
│   ├── eslint.config.mjs
│   ├── next.config.ts
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── README.md
│   └── tsconfig.json
│
├── Server/
│   ├── src/
│   ├── .gitignore
│   ├── jest.config.js
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── tsconfig.json
│
├── MOCK_API.md
├── package-lock.json
└── README.md

````

---

## 📦 Installation

### 🧩 Backend

```bash
git clone https://github.com/GLXALOKESH/Graveyard.git
cd Graveyard
pnpm install
````

Create a `.env` file based on `.env.example`:

```
PORT=3000
USE_MOCK=true

# AWS
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1

# Redis
REDIS_URL=rediss://...

# OpenRouter
OPENROUTER_API_KEY=
```

Start the backend:

```bash
pnpm dev
```

---

### 🧩 Frontend

Navigate to the frontend folder:

```bash
cd frontend
pnpm install
pnpm dev
```

---

## 📡 API Endpoints

### 📍 Overview

Retrieve full cloud overview:

```
GET /overview
```

Refresh cache:

```
GET /overview?refresh=true
```

---

<!-- ### 🤖 AI Recommendation

Get AI suggestions for a specific resource:

```
POST /ai/recommendation
```

Example Request:

```json
{
  "resourceType": "EC2",
  "region": "us-east-1",
  "resourceData": {
    "id": "i-600a7585",
    "confidence": 80,
    "monthlyCost": 8,
    "metrics": {
      "avgCpuUtilization": 2.1,
      "networkIn": 120,
      "networkOut": 98
    }
  }
}
``` -->

---

## 🧠 Scoring & Status

Each resource gets:

* `confidence`: 0–100 score indicating zombie likelihood
* `status`:

  * `healthy` (0–20)
  * `warning` (21–40)
  * `suspect` (41–60)
  * `likely zombie` (61–80)
  * `zombie` (81–100)

Frontend uses these for color badges and filters.

---

## ⚙️ Mock Cloud Mode

Enable:

```
USE_MOCK=true
```

Mock system supports:

* Create Mock EC2, RDS, Lambda, ECS, S3
* List mock resources
* Reset mock state

Useful for development and demo.

---

## 🔒 Security

* IAM ReadOnly only
* Rate limiting on AI endpoint
* AI response caching via Redis
* Input validation and sanitization
* CLI command generation only for provided resource

---

## 🧪 Testing

### Backend Unit Tests

ZombieScoringService and AI fallback logic are covered by Jest tests:

```bash
pnpm test
```

---

## 💡 Future Roadmap

* Carbon footprint estimation
* Terraform suggestion generator
* Scheduled automation
* Notifications (Slack, Email)
* Real time WebSocket updates

---

## 🏆 Why Graveyard

Cloud waste is real. Organizations waste 20–35% of cloud spend every year on idle resources.

Graveyard not only **detects waste** but also **recommends actions** — backed by AI — making it practical and effective.

---

## 📫 Contributing

1. Fork the repo
2. Create feature branch
3. Push and create a PR

All contributions welcome!

---

## 📜 License

MIT © Graveyard