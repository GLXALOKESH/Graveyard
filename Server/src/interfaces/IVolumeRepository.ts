export interface IVolumeRepository {
  countUnattachedVolumes(region: string): Promise<number>;
}
