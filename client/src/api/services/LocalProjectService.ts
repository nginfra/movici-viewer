import type { ProjectService } from "@nginfra/movici-flow-lib/types";

export default class DummyProjectService implements ProjectService {
  async list() {
    return null;
  }
}
