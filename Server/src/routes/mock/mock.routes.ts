import { Router } from "express";
import { MockRoutes } from "../../configs/routes/mock.js";
import { validateDto } from "../../middlewares/validateDTOs.js";
import {
  CreateEC2DTO,
  CreateECSDTO,
  CreateLambdaDTO,
  CreateRDSDTO,
  CreateS3DTO,
  CreateVolumeDTO,
  BulkCreateDTO,
} from "../../DTOClasses/mock/index.js";
import {
  createEC2,
  listEC2,
  createECS,
  listECS,
  createLambda,
  listLambda,
  createRDS,
  listRDS,
  createS3,
  listS3,
  createVolume,
  listVolumes,
  resetAll,
  resetRegion,
  createBulk,
} from "../../controllers/mock/mock.controller.js";

const mockRouter = Router();

// EC2 routes with validation
mockRouter.post(MockRoutes.EC2, validateDto(CreateEC2DTO, "body"), createEC2);
mockRouter.get("/ec2/:region", listEC2);

// ECS routes with validation
mockRouter.post(MockRoutes.ECS, validateDto(CreateECSDTO, "body"), createECS);
mockRouter.get("/ecs/:region", listECS);

// Lambda routes with validation
mockRouter.post(MockRoutes.LAMBDA, validateDto(CreateLambdaDTO, "body"), createLambda);
mockRouter.get("/lambda/:region", listLambda);

// RDS routes with validation
mockRouter.post(MockRoutes.RDS, validateDto(CreateRDSDTO, "body"), createRDS);
mockRouter.get("/rds/:region", listRDS);

// S3 routes with validation
mockRouter.post(MockRoutes.S3, validateDto(CreateS3DTO, "body"), createS3);
mockRouter.get("/s3/:region", listS3);

// Volume routes with validation
mockRouter.post(MockRoutes.VOLUME, validateDto(CreateVolumeDTO, "body"), createVolume);
mockRouter.get("/volume/:region", listVolumes);

// State management routes
mockRouter.post(MockRoutes.RESET, resetAll);
mockRouter.post("/reset/:region", resetRegion);

// Bulk creation route with validation
mockRouter.post("/bulk/:region", validateDto(BulkCreateDTO, "body"), createBulk);

export default mockRouter;
