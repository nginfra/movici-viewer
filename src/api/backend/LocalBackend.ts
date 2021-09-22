import Backend from '@/flow/api/backend';
import LocalDatasetService from '@/api/backend/services/LocalDatasetService';
import LocalGeocodeService from './services/LocalGeocodeService';
import LocalProjectService from '@/api/backend/services/LocalProjectService';
import LocalScenarioService from '@/api/backend/services/LocalScenarioService';
import LocalSummaryService from '@/api/backend/services/LocalSummaryService';
import LocalUpdatesService from '@/api/backend/services/LocalUpdatesService';
import LocalUserService from '@/api/backend/services/LocalUserService';
import LocalViewService from '@/api/backend/services/LocalViewService';
import Client from '@/flow/api/client';

export default class LocalBackend implements Backend {
  dataset: LocalDatasetService;
  project: LocalProjectService;
  geocode: LocalGeocodeService;
  scenario: LocalScenarioService;
  summary: LocalSummaryService;
  updates: LocalUpdatesService;
  user: LocalUserService;
  view: LocalViewService;

  constructor(client: Client) {
    this.dataset = new LocalDatasetService(client);
    this.geocode = new LocalGeocodeService(client);
    this.project = new LocalProjectService(client);
    this.scenario = new LocalScenarioService(client);
    this.summary = new LocalSummaryService(client);
    this.updates = new LocalUpdatesService(client);
    this.user = new LocalUserService(client);
    this.view = new LocalViewService(client);
  }

  getCapabilities(): string[] {
    return [];
  }
}
