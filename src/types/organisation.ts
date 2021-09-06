import { UUID } from '@/types/general';

export interface Organisation {
  organisation_uuid: UUID;
  name: string;
  address?: string;
  zip_code?: string;
  city?: string;
  country?: string;
  chamber_of_commerce?: string;
  contact_email?: string;
  created_on?: string;
  sub_organisations?: Organisation[];
}
