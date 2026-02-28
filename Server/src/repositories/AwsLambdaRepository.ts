import {
  LambdaClient,
  ListFunctionsCommand,
} from "@aws-sdk/client-lambda";
import {
  ILambdaRepository,
  LambdaFunction,
} from "../interfaces/ILambdaRepository.js";
import { createLambdaClient } from "../configs/awsClientFactory.js";

export class AwsLambdaRepository implements ILambdaRepository {
  protected createLambdaClient(region: string): LambdaClient {
    return createLambdaClient(region);
  }

  async getFunctions(region: string): Promise<LambdaFunction[]> {
    const lambdaClient = this.createLambdaClient(region);

    try {
      const functions: LambdaFunction[] = [];
      let marker: string | undefined;

      do {
        const command = new ListFunctionsCommand({
          Marker: marker,
        });

        const response = await lambdaClient.send(command);

        if (response.Functions) {
          for (const func of response.Functions) {
            if (func.FunctionName) {
              functions.push({
                functionName: func.FunctionName,
                runtime: func.Runtime || "unknown",
                lastModified: func.LastModified || "unknown",
                memorySize: func.MemorySize || 128,
              });
            }
          }
        }

        marker = response.NextMarker;
      } while (marker);

      return functions;
    } finally {
      lambdaClient.destroy();
    }
  }
}
