import ProjectService from './project';
import DatasetService from './dataset';
import UserService from './user';
import ScenarioService from './scenario';
import SummaryService from './summary';
import ViewService from './view';
import UpdatesService from './updates';

export default interface Backend {
  getCapabilities(): string[];
  user: UserService;
  project: ProjectService;
  dataset: DatasetService;
  scenario: ScenarioService;
  summary: SummaryService;
  view: ViewService;
  updates: UpdatesService;
}
