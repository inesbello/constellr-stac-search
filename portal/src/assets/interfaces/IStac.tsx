import { Geometry } from 'geojson';
export interface IStacBody {
  collections: string[];
  limit?: number;
  datetime?: string;
  intersects?: Geometry;
}
