import { UUID } from '@/types/general';

export interface ModelTypeCollection {
  model_types: ModelType[];
}

export interface ModelType {
  uuid: UUID;
  name: string;
  strict_validation: boolean;
  dataset_categories: DatasetCategory[];
  entity_categories: EntityCategory[];
  schema: ModelTypeSchema;
  created_on?: number;
  last_modified?: number;
}

export interface DatasetCategory {
  name: string;
  type: string;
  required: boolean;
  require_one?: string;
}

export interface EntityCategory {
  name: string;
  required: boolean;
}

export interface ModelTypeSchema {
  type?: string;
  required?: string[];
  properties?: unknown;
}
