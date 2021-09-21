import Backend from '@/flow/backend';
import LocalUserService from '@/backend/services/LocalUserService';
import LocalProjectService from '@/backend/services/LocalProjectService';
import LocalDatasetService from '@/backend/services/LocalDatasetService';
import LocalScenarioService from '@/backend/services/LocalScenarioService';
import LocalSummaryService from '@/backend/services/LocalSummaryService';
import LocalViewService from '@/backend/services/LocalViewService';
import LocalUpdatesService from '@/backend/services/LocalUpdatesService';
import Client from '@/api/client';

export default class LocalBackend implements Backend {
  user: LocalUserService;
  project: LocalProjectService;
  dataset: LocalDatasetService;
  scenario: LocalScenarioService;
  view: LocalViewService;
  summary: LocalSummaryService;
  updates: LocalUpdatesService;

  constructor(client: Client) {
    this.user = new LocalUserService(client);
    this.project = new LocalProjectService(client);
    this.dataset = new LocalDatasetService(client);
    this.scenario = new LocalScenarioService(client);
    this.summary = new LocalSummaryService(client);
    this.view = new LocalViewService(client);
    this.updates = new LocalUpdatesService(client);
  }

  getCapabilities(): string[] {
    return [];
  }
}
