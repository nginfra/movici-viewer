import { ApplicationSettings } from '@/flow/src/types';
import { AxiosRequestConfig } from 'axios';
import { BaseRequest } from '@/flow/src/api/requests/base';

export class GetGlobalSettings extends BaseRequest<ApplicationSettings> {
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `/static/settings/settings.json`
    };
  }
}
