import type { CAPABILITIES } from '@movici-flow-lib/api';
import type { Backend, IClient } from '@movici-flow-lib/types';
import LocalDatasetService from './services/LocalDatasetService';
import LocalGeocodeService from './services/LocalGeocodeService';
import DummyProjectService from './services/LocalProjectService';
import LocalScenarioService from './services/LocalScenarioService';
import LocalSummaryService from './services/LocalSummaryService';
import LocalUpdatesService from './services/LocalUpdatesService';
import DummyUserService from './services/LocalUserService';
import LocalViewService from './services/LocalViewService';
import LocalFetchRequestService from './services/LocalFetchRequestService';
export default class LocalBackend implements Backend {
  dataset: LocalDatasetService;
  project: DummyProjectService;
  geocode: LocalGeocodeService;
  scenario: LocalScenarioService;
  summary: LocalSummaryService;
  updates: LocalUpdatesService;
  user: DummyUserService;
  view: LocalViewService;
  fetch: LocalFetchRequestService;
  constructor(client: IClient) {
    this.dataset = new LocalDatasetService(client);
    this.geocode = new LocalGeocodeService();
    this.project = new DummyProjectService();
    this.scenario = new LocalScenarioService(client);
    this.summary = new LocalSummaryService(client);
    this.updates = new LocalUpdatesService(client);
    this.user = new DummyUserService(client);
    this.view = new LocalViewService(client);
    this.fetch = new LocalFetchRequestService(client);
  }

  getCapabilities(): CAPABILITIES[] {
    return [];
  }
}
