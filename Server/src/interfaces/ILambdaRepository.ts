export interface LambdaFunction {
  functionName: string;
  runtime: string;
  lastModified: string;
}

export interface ILambdaRepository {
  getFunctions(region: string): Promise<LambdaFunction[]>;
}
