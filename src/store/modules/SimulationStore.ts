import { Action, getModule, Module, VuexModule } from 'vuex-module-decorators';
import Client from '@/api/client';
import {
  GetSimulationControlMessage,
  SendSimulationControlMessage,
  SendSimulationUpdateRequest
} from '@/api/requests';
import store from '@/store/store';

@Module({
  name: 'simulation',
  namespaced: true,
  dynamic: true,
  store: store
})
class SimulationStore extends VuexModule {
  @Action({ rawError: true })
  async getSpeed(scenario_uuid: string) {
    const api: Client = this.context.rootGetters.api;

    return await api.request(new GetSimulationControlMessage(scenario_uuid));
  }

  @Action({ rawError: true })
  async updateSpeed(payload: { uuid: string; speed: number }) {
    const api: Client = this.context.rootGetters.api;
    const uuid = payload.uuid;

    const speed = payload.speed;
    return await api.request(new SendSimulationControlMessage(uuid, { speed }));
  }

  @Action({ rawError: true })
  async forwardTo(payload: { uuid: string; forward_to: number }) {
    const api: Client = this.context.rootGetters.api;
    const uuid = payload.uuid;

    const forward_to = payload.forward_to;
    return await api.request(new SendSimulationControlMessage(uuid, { forward_to }));
  }

  @Action({ rawError: true })
  async sendUpdate(payload: { scenario_uuid: string; model_name: string; update: unknown }) {
    const api: Client = this.context.rootGetters.api;

    const uuid = payload.scenario_uuid;
    const model_name = payload.model_name;
    const update = payload.update;

    return await api.request(new SendSimulationUpdateRequest(uuid, model_name, update));
  }
}

export default getModule(SimulationStore);
