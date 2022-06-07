import { ProjectService } from '@movici-flow-common/types';

export default class DummyProjectService implements ProjectService {
  async list() {
    return null;
  }
}
