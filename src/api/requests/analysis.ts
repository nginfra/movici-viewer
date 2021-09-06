import { AnalysisTemplate, UUID } from '@/types';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import uri, { dataEngineBase } from '@/api/uri';
import { BaseRequest, Request } from '@/api/requests/base';

export class GetAnalysisTemplates extends BaseRequest<AnalysisTemplate[]> {
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: '/static/settings/analysis_templates.json'
    };
  }
}

export class GetAnalysisPlot extends Request<{ data: ArrayBuffer; contentType: string }> {
  scenarioUUID: UUID;
  config: Record<string, unknown>;
  constructor(scenarioUUID: UUID, config: Record<string, unknown>) {
    super();
    this.scenarioUUID = scenarioUUID;
    this.config = config;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      url: `${dataEngineBase}${uri.scenarios}/${this.scenarioUUID}${uri.analysisPlot}`,
      responseType: 'arraybuffer',
      method: 'post',
      data: this.config
    };
  }
  makeResponse(resp: AxiosResponse): { data: ArrayBuffer; contentType: string } {
    return {
      data: resp.data,
      contentType: 'image/png'
    };
  }
}
