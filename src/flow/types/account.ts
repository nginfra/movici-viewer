import { RoleBinding } from '@/flow/types/users';

export interface SetAccountPasswordPayload {
  password: string;
  token: string;
}
type Language = 'nl' | 'en';
export interface Profile {
  user_uuid: string;
  username: string;
  active: boolean;
  created_on: number;
  firstname: string;
  middlename: null | string;
  lastname: string;
  language: Language;
  roles: RoleBinding[];
}

export interface ProfileUpdate {
  old_password?: string;
  new_password?: string;
  language?: Language;
  active?: boolean;
}
