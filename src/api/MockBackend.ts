import { Backend, Client, CAPABILITIES } from '@movici-flow-common/api';
import MockDatasetService from '@/api/services/MockDatasetService';
import MockGeocodeService from './services/MockGeocodeService';
import MockProjectService from '@/api/services/MockProjectService';
import MockScenarioService from '@/api/services/MockScenarioService';
import MockSummaryService from '@/api/services/MockSummaryService';
import MockUpdatesService from '@/api/services/MockUpdatesService';
import MockUserService from '@/api/services/MockUserService';
import MockViewService from '@/api/services/MockViewService';

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
