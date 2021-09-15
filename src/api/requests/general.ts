import { ApplicationSettings, ColorRuleSet } from '@/flow/types';
import { AxiosRequestConfig } from 'axios';
import { BaseRequest } from '@/flow/requests/base';

export class GetGlobalColorRuleSet extends BaseRequest<ColorRuleSet> {
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `/static/settings/color_rule_set.json`
    };
  }
}

export class GetGlobalSettings extends BaseRequest<ApplicationSettings> {
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `/static/settings/settings.json`
    };
  }
}
