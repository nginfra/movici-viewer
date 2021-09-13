import { Action, Module, VuexModule } from 'vuex-module-decorators';
import { generalStore } from '@/store/store';
import { UUID, View } from '@/types';
import { AddView, DeleteView, GetView, GetViews, UpdateView } from '@/api/requests';
import Client from '@/api/client';

@Module({
  name: 'view',
  namespaced: true
})
class ViewStore extends VuexModule {
  @Action({ rawError: true })
  async getViews(scenarioUUID: UUID): Promise<View[]> {
    const api: Client = generalStore.api;
    return (await api.request(new GetViews(scenarioUUID))) ?? [];
  }

  @Action({ rawError: true })
  async getView(viewUUID: UUID) {
    const api: Client = generalStore.api;
    return await api.request(new GetView(viewUUID));
  }

  @Action({ rawError: true })
  async createView({ scenarioUUID, view }: { scenarioUUID: UUID; view: View }) {
    const api: Client = generalStore.api;
    return await api.request(new AddView(scenarioUUID, view));
  }

  @Action({ rawError: true })
  async updateView({ viewUUID, view }: { viewUUID: UUID; view: View }) {
    const api: Client = generalStore.api;
    return await api.request(new UpdateView(viewUUID, view));
  }

  @Action({ rawError: true })
  async deleteView(viewUUID: UUID) {
    const api: Client = generalStore.api;
    return await api.request(new DeleteView(viewUUID));
  }
}
export default ViewStore;
