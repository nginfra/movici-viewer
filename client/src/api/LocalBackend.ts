import { Backend, Client, CAPABILITIES } from '@movici-flow-common/api';
import LocalDatasetService from './services/LocalDatasetService';
import LocalGeocodeService from './services/LocalGeocodeService';
import DummyProjectService from './services/LocalProjectService';
import LocalScenarioService from './services/LocalScenarioService';
import LocalSummaryService from './services/LocalSummaryService';
import LocalUpdatesService from './services/LocalUpdatesService';
import DummyUserService from './services/LocalUserService';
import LocalViewService from './services/LocalViewService';
export default class LocalBackend implements Backend {
  dataset: LocalDatasetService;
  project: DummyProjectService;
  geocode: LocalGeocodeService;
  scenario: LocalScenarioService;
  summary: LocalSummaryService;
  updates: LocalUpdatesService;
  user: DummyUserService;
  view: LocalViewService;

  constructor(client: Client) {
    this.dataset = new LocalDatasetService(client);
    this.geocode = new LocalGeocodeService();
    this.project = new DummyProjectService();
    this.scenario = new LocalScenarioService(client);
    this.summary = new LocalSummaryService(client);
    this.updates = new LocalUpdatesService(client);
    this.user = new DummyUserService(client);
    this.view = new LocalViewService(client);
  }

  getCapabilities(): CAPABILITIES[] {
    return [];
  }
}
