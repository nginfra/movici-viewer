import { UUID } from '@/types/general';
import { PolygonCoordinate } from '@/types/geometry';

export interface ShortDatasetGenerator {
  uuid: UUID;
  name: string;
  project_name: string;
  polygon: GeoJSONPolygon;
  created_on: Date;
  last_modified: Date | null;
  last_workload_status: string | null;
}

export interface DatasetGenerator extends ShortDatasetGenerator {
  datasets: DatasetGeneratorDataset[];
}

export interface DatasetGeneratorDataset {
  name: string;
  display_name: string;
  params: unknown;
  type: string;
  last_modified?: string;
  last_subsetted?: string;
  childs?: {
    child_type: string;
    datasets: DatasetGeneratorDataset[];
  }[];
}

export interface DatasetGeneratorWorkload {
  created_on: Date;
  status: string;
  uuid: UUID;
  payload: Record<string, unknown>;
}

export interface DatasetGeneratorLog {
  created_on: Date;
  message: string;
  workload_uuid: UUID;
  verbosity: string;
}

export interface DatasetGeneratorDatasetType {
  display_name: string;
  type: string;
  schema: JsonSchema | null;
}

export interface JsonSchema {
  properties: JsonSchemaObject[];
  [key: string]: unknown;
}

interface JsonSchemaObject {
  default?: boolean;
  description?: string;
  type?: string;
  required?: string[];
  [key: string]: unknown;
}

export interface GeoJSONPolygon {
  coordinates: PolygonCoordinate;
  crs: {
    properties: {
      name: string;
    };
    type: string;
  };
  type: 'Polygon';
}
