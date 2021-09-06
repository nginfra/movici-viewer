import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { downloadAsFile } from '@/store/requests';
import { TimelineInfo, Update } from '@/types';
import Client from '@/api/client';
import { GetTimelineInfo, GetUpdateAsBlob, GetUpdates } from '@/api/requests';
import store from '@/store/store';

@Module({
  name: 'timeline',
  namespaced: true,
  dynamic: true,
  store: store
})
class TimelineStore extends VuexModule {
  currentTimeline: readonly Update[] = [];
  timelineInfo: TimelineInfo | null = null;
  @Mutation
  SET_TIMELINE(updates: Update[]) {
    this.currentTimeline = Object.freeze(updates);
  }

  @Mutation
  SET_TIMELINE_INFO(payload: TimelineInfo) {
    this.timelineInfo = payload;
  }

  @Action({ rawError: true, commit: 'SET_TIMELINE_INFO' })
  async getTimelineInfo(scenario_uuid: string) {
    const api: Client = this.context.rootGetters.api;
    const timeline = await api.request(new GetTimelineInfo(scenario_uuid));
    if (timeline) {
      return {
        scenario_uuid: timeline.scenario_uuid,
        update_count: timeline.update_count,
        timestamps: Object.freeze(timeline.timestamps)
      } as TimelineInfo;
    }
    return null;
  }

  @Action({ rawError: true, commit: 'SET_TIMELINE' })
  async getUpdatesList(payload: { scenario_uuid: string; min_time?: number; max_time?: number }) {
    const api: Client = this.context.rootGetters.api;
    return await api.request(
      new GetUpdates(payload.scenario_uuid, {
        min_time: payload.min_time,
        max_time: payload.max_time
      })
    );
  }

  @Action({ rawError: true })
  async downloadUpdate(update: Update) {
    const api: Client = this.context.rootGetters.api;
    const data = await api.request(new GetUpdateAsBlob(update.uuid));
    if (data) {
      downloadAsFile(
        new Blob([data]),
        `t${update.timestamp}_${update.iteration}_${update.name}.json`
      );
    }
  }
}

export default getModule(TimelineStore);
