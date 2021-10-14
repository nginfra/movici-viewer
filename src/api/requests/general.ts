import { ApplicationSettings } from '@/flow/types';
import { AxiosRequestConfig } from 'axios';
import { BaseRequest } from '@/flow/api';

export class GetGlobalSettings extends BaseRequest<ApplicationSettings> {
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `/static/settings/settings.json`
    };
  }
}
