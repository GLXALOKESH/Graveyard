export interface Region {
  regionName: string;
  endpoint: string;
}

export interface IRegionRepository {
  getAllRegions(): Promise<Region[]>;
}
