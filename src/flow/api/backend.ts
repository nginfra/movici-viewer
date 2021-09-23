import DatasetService from './services/dataset';
import GeocodeService from './services/geocode';
import ProjectService from './services/project';
import ScenarioService from './services/scenario';
import SummaryService from './services/summary';
import UpdatesService from './services/updates';
import UserService from './services/user';
import ViewService from './services/view';

export default interface Backend {
  getCapabilities(): string[];
  dataset: DatasetService;
  geocode: GeocodeService;
  project: ProjectService;
  scenario: ScenarioService;
  summary: SummaryService;
  updates: UpdatesService;
  user: UserService;
  view: ViewService;
}
