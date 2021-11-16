import { ProjectService } from '@movici-flow-common/api';

export default class DummyProjectService implements ProjectService {
  async list() {
    return null;
  }
}
