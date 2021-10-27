import { ApplicationSettings } from '@movici-flow-common/types';
import { AxiosRequestConfig } from 'axios';
import { BaseRequest } from '@movici-flow-common/api';

export class GetGlobalSettings extends BaseRequest<ApplicationSettings> {
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `/static/settings/settings.json`
    };
  }
}
