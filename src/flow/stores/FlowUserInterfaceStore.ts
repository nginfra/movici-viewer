import { FlowSection, FlowSectionItem } from '@/flow/types';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({
  name: 'flowUI',
  namespaced: true
})
class FlowUIStore extends VuexModule {
  flowSections: FlowSection[] = [];
  collapse = false;
  disableCollapser = false;
  loading = false;
  loadingMessage: string | null = null;

  @Mutation
  SET_SECTIONS(payload: FlowSection[]) {
    this.flowSections = payload;
  }

  @Mutation
  toggleCollapse(force?: boolean) {
    this.collapse = force ?? !this.collapse;
  }

  @Mutation
  setDisableCollapser(value: boolean) {
    this.disableCollapser = value;
  }

  @Mutation
  setLoading({ value, msg }: { value: boolean; msg?: string | null }) {
    this.loading = value;
    this.loadingMessage = value ? msg ?? null : null;
  }

  @Action({ rawError: true })
  setSections(payload: FlowSection[]) {
    this.SET_SECTIONS(payload);
  }

  @Action({ rawError: true })
  enableSection(payload: Partial<Record<FlowSectionItem, boolean>>) {
    const affectedSections = Object.keys(payload);
    this.SET_SECTIONS(
      this.flowSections.map((section, idx) => {
        return Object.assign({}, this.flowSections[idx], {
          enabled:
            affectedSections.indexOf(section.name) !== -1 ? payload[section.name] : section.enabled
        });
      })
    );
  }
}

export default FlowUIStore;
