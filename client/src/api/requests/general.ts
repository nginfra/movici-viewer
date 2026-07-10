import type { RemoteApplicationSettings } from "@nginfra/movici-flow-lib/types";
import type { AxiosRequestConfig } from "axios";
import { BaseRequest } from "@nginfra/movici-flow-lib/api";

export class GetGlobalSettings extends BaseRequest<RemoteApplicationSettings> {
  makeRequest(): AxiosRequestConfig {
    return {
      method: "get",
      url: `/static/settings/settings.json`,
    };
  }
}
