import {  Client, CAPABILITIES } from '@movici-flow-common/api';
import { Backend } from '@movici-flow-common/types';
import MockDatasetService from './MockDatasetService';
import MockGeocodeService from './MockGeocodeService';
import MockProjectService from './MockProjectService';
import MockScenarioService from './MockScenarioService';
import MockSummaryService from './MockSummaryService';
import MockUpdatesService from './MockUpdatesService';
import MockUserService from './MockUserService';
import MockViewService from './MockViewService';

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
