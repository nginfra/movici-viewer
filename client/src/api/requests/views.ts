import { Request } from '@movici-flow-lib/api/requests/base'
import uri from './uri'
import type { UUID, View, ViewCrudResponse } from '@movici-flow-lib/types'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export class GetViews extends Request<View[]> {
  scenarioUUID: UUID

  constructor(scenarioUUID: UUID) {
    super()
    this.scenarioUUID = scenarioUUID
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${uri.scenarios}/${this.scenarioUUID}${uri.views}`
    }
  }

  makeResponse(resp: AxiosResponse): View[] {
    return resp.data.views
  }
}

export class GetView extends Request<View> {
  viewUUID: UUID

  constructor(viewUUID: UUID) {
    super()
    this.viewUUID = viewUUID
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: `${uri.views}/${this.viewUUID}`
    }
  }
}

export class AddView extends Request<ViewCrudResponse> {
  payload: View
  scenarioUUID: UUID
  constructor(scenarioUUID: UUID, payload: View) {
    super()
    this.payload = payload
    this.scenarioUUID = scenarioUUID
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'post',
      url: `${uri.scenarios}/${this.scenarioUUID}${uri.views}`,
      data: this.payload
    }
  }
}

export class UpdateView extends Request<ViewCrudResponse> {
  payload: Partial<View>
  viewUUID: UUID
  constructor(viewUUID: UUID, payload: Partial<View>) {
    super()
    this.payload = payload
    this.viewUUID = viewUUID
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'put',
      url: `${uri.views}/${this.viewUUID}`,
      data: this.payload
    }
  }
}

export class DeleteView extends Request<ViewCrudResponse> {
  viewUUID: UUID
  constructor(viewUUID: UUID) {
    super()
    this.viewUUID = viewUUID
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'delete',
      url: `${uri.views}/${this.viewUUID}`
    }
  }
}
