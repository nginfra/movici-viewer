import { Backend, Client } from '~flow/api';
import LocalDatasetService from '@/api/services/LocalDatasetService';
import LocalGeocodeService from './services/LocalGeocodeService';
import LocalProjectService from '@/api/services/LocalProjectService';
import LocalScenarioService from '@/api/services/LocalScenarioService';
import LocalSummaryService from '@/api/services/LocalSummaryService';
import LocalUpdatesService from '@/api/services/LocalUpdatesService';
import LocalUserService from '@/api/services/LocalUserService';
import LocalViewService from '@/api/services/LocalViewService';

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
