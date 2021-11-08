import { Backend, Client, CAPABILITIES } from '@movici-flow-common/api';
import MockDatasetService from './services/MockDatasetService';
import MockGeocodeService from './services/MockGeocodeService';
import MockProjectService from './services/MockProjectService';
import MockScenarioService from './services/MockScenarioService';
import MockSummaryService from './services/MockSummaryService';
import MockUpdatesService from './services/MockUpdatesService';
import MockUserService from './services/MockUserService';
import MockViewService from './services/MockViewService';

export default class MockBackend implements Backend {
  dataset: MockDatasetService;
  project: MockProjectService;
  geocode: MockGeocodeService;
  scenario: MockScenarioService;
  summary: MockSummaryService;
  updates: MockUpdatesService;
  user: MockUserService;
  view: MockViewService;

  constructor(client: Client) {
    this.dataset = new MockDatasetService(client);
    this.geocode = new MockGeocodeService(client);
    this.project = new MockProjectService(client);
    this.scenario = new MockScenarioService(client);
    this.summary = new MockSummaryService(client);
    this.updates = new MockUpdatesService(client);
    this.user = new MockUserService(client);
    this.view = new MockViewService(client);
  }

  getCapabilities(): CAPABILITIES[] {
    return [];
  }
}
