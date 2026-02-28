import { Request, Response, NextFunction } from "express";
import { ResponseDTO } from "../../DTOClasses/response.DTO.js";
import {
  MockCloudState,
  MockInstanceRepository,
  MockEcsRepository,
  MockLambdaRepository,
  MockRdsRepository,
  MockS3Repository,
  MockVolumeRepository,
} from "../../repositories/mock/index.js";

// Initialize repositories
const mockState = MockCloudState.getInstance();
const instanceRepo = new MockInstanceRepository();
const ecsRepo = new MockEcsRepository();
const lambdaRepo = new MockLambdaRepository();
const rdsRepo = new MockRdsRepository();
const s3Repo = new MockS3Repository();
const volumeRepo = new MockVolumeRepository();

// ==================== EC2 Controllers ====================

export const createEC2 = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const region = req.params.region as string;
    const {
      instanceType,
      state,
      tags,
      isZombie,
      count = 1,
    } = req.body;

    const created = [];
    for (let i = 0; i < count; i++) {
      const instance = await instanceRepo.createEC2(region, {
        instanceType,
        state,
        tags,
        isZombie,
      });
      created.push(instance);
    }

    const response = new ResponseDTO();
    response.setStatus(true);
    response.setMessage(`Created ${created.length} EC2 instance(s)`);
    response.setData({ instances: created });

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const listEC2 = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const region = req.params.region as string;
    const data = await instanceRepo.listEC2(region);

    const response = new ResponseDTO();
    response.setStatus(true);
    response.setMessage("EC2 instances retrieved");
    response.setData(data);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ==================== ECS Controllers ====================

export const createECS = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const region = req.params.region as string;
    const { clusterName, services } = req.body;

    const cluster = await ecsRepo.createECS(region, {
      clusterName,
      services,
    });

    const response = new ResponseDTO();
    response.setStatus(true);
    response.setMessage("ECS cluster created");
    response.setData({ cluster });

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const listECS = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const region = req.params.region as string;
    const data = await ecsRepo.listECS(region);

    const response = new ResponseDTO();
    response.setStatus(true);
    response.setMessage("ECS clusters retrieved");
    response.setData(data);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ==================== Lambda Controllers ====================

export const createLambda = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const region = req.params.region as string;
    const {
      functionName,
      runtime,
      memorySize,
      isZombie,
      count = 1,
    } = req.body;

    const created = [];
    for (let i = 0; i < count; i++) {
      const func = await lambdaRepo.createLambda(region, {
        functionName: count > 1 ? `${functionName}-${i + 1}` : functionName,
        runtime,
        memorySize,
        isZombie,
      });
      created.push(func);
    }

    const response = new ResponseDTO();
    response.setStatus(true);
    response.setMessage(`Created ${created.length} Lambda function(s)`);
    response.setData({ functions: created });

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const listLambda = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const region = req.params.region as string;
    const data = await lambdaRepo.listLambda(region);

    const response = new ResponseDTO();
    response.setStatus(true);
    response.setMessage("Lambda functions retrieved");
    response.setData(data);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ==================== RDS Controllers ====================

export const createRDS = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const region = req.params.region as string;
    const {
      dbInstanceIdentifier,
      engine,
      status,
      isZombie,
      count = 1,
    } = req.body;

    const created = [];
    for (let i = 0; i < count; i++) {
      const instance = await rdsRepo.createRDS(region, {
        dbInstanceIdentifier: count > 1 ? `${dbInstanceIdentifier}-${i + 1}` : dbInstanceIdentifier,
        engine,
        status,
        isZombie,
      });
      created.push(instance);
    }

    const response = new ResponseDTO();
    response.setStatus(true);
    response.setMessage(`Created ${created.length} RDS instance(s)`);
    response.setData({ instances: created });

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const listRDS = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const region = req.params.region as string;
    const data = await rdsRepo.listRDS(region);

    const response = new ResponseDTO();
    response.setStatus(true);
    response.setMessage("RDS instances retrieved");
    response.setData(data);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ==================== S3 Controllers ====================

export const createS3 = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const region = req.params.region as string;
    const { bucketName } = req.body;

    const bucket = await s3Repo.createS3(region, { bucketName });

    const response = new ResponseDTO();
    response.setStatus(true);
    response.setMessage("S3 bucket created");
    response.setData({ bucket });

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const listS3 = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const region = req.params.region as string;
    const data = await s3Repo.listS3(region);

    const response = new ResponseDTO();
    response.setStatus(true);
    response.setMessage("S3 buckets retrieved");
    response.setData(data);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ==================== Volume Controllers ====================

export const createVolume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const region = req.params.region as string;
    const { status, size } = req.body;

    const volume = await volumeRepo.createVolume(region, { status, size });

    const response = new ResponseDTO();
    response.setStatus(true);
    response.setMessage("Volume created");
    response.setData({ volume });

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const listVolumes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const region = req.params.region as string;
    const data = volumeRepo.listVolumes(region);

    const response = new ResponseDTO();
    response.setStatus(true);
    response.setMessage("Volumes retrieved");
    response.setData({ volumes: data });

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ==================== State Management Controllers ====================

export const resetAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await mockState.reset();
    volumeRepo.reset();

    const response = new ResponseDTO();
    response.setStatus(true);
    response.setMessage("All mock data reset to defaults");
    response.setData({});

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const resetRegion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const region = req.params.region as string;
    await mockState.clearRegion(region);
    volumeRepo.clearRegion(region);

    const response = new ResponseDTO();
    response.setStatus(true);
    response.setMessage(`Region ${region} reset`);
    response.setData({ region });

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ==================== Bulk Creation Controller ====================

export const createBulk = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const region = req.params.region as string;
    const {
      ec2Count = 0,
      lambdaCount = 0,
      rdsCount = 0,
      ecsClusters = [],
      s3Count = 0,
      volumeCount = 0,
      zombieRatio = 0.3,
    } = req.body;

    const results = {
      ec2: [] as any[],
      lambda: [] as any[],
      rds: [] as any[],
      ecs: [] as any[],
      s3: [] as any[],
      volumes: [] as any[],
    };

    // Create EC2 instances
    const ec2Promises = [];
    for (let i = 0; i < ec2Count; i++) {
      const isZombie = Math.random() < zombieRatio;
      ec2Promises.push(
        instanceRepo.createEC2(region, {
          instanceType: isZombie ? "t3.micro" : "t3.large",
          tags: isZombie ? {} : { Environment: "production", Team: "devops" },
          isZombie,
        })
      );
    }
    results.ec2 = await Promise.all(ec2Promises);

    // Create Lambda functions
    const lambdaPromises = [];
    for (let i = 0; i < lambdaCount; i++) {
      const isZombie = Math.random() < zombieRatio;
      lambdaPromises.push(
        lambdaRepo.createLambda(region, {
          functionName: `function-${i + 1}`,
          runtime: "nodejs18.x",
          isZombie,
        })
      );
    }
    results.lambda = await Promise.all(lambdaPromises);

    // Create RDS instances
    const rdsPromises = [];
    for (let i = 0; i < rdsCount; i++) {
      const isZombie = Math.random() < zombieRatio;
      rdsPromises.push(
        rdsRepo.createRDS(region, {
          dbInstanceIdentifier: `db-${i + 1}`,
          engine: "postgres",
          isZombie,
        })
      );
    }
    results.rds = await Promise.all(rdsPromises);

    // Create ECS clusters
    const ecsPromises = [];
    for (const clusterConfig of ecsClusters) {
      ecsPromises.push(
        ecsRepo.createECS(region, {
          clusterName: clusterConfig.clusterName,
          services: clusterConfig.services,
        })
      );
    }
    results.ecs = await Promise.all(ecsPromises);

    // Create S3 buckets
    const s3Promises = [];
    for (let i = 0; i < s3Count; i++) {
      s3Promises.push(
        s3Repo.createS3(region, {
          bucketName: `my-bucket-${region}-${i + 1}-${Date.now()}`,
        })
      );
    }
    results.s3 = await Promise.all(s3Promises);

    // Create volumes
    const volumePromises = [];
    for (let i = 0; i < volumeCount; i++) {
      volumePromises.push(
        volumeRepo.createVolume(region, {
          status: Math.random() < 0.5 ? "available" : "in-use",
          size: Math.floor(Math.random() * 100) + 10,
        })
      );
    }
    results.volumes = await Promise.all(volumePromises);

    const response = new ResponseDTO();
    response.setStatus(true);
    response.setMessage("Bulk resources created");
    response.setData({
      region,
      created: {
        ec2: results.ec2.length,
        lambda: results.lambda.length,
        rds: results.rds.length,
        ecs: results.ecs.length,
        s3: results.s3.length,
        volumes: results.volumes.length,
      },
      details: results,
    });

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};
