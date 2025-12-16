import type { ProjectService } from "@movici-flow-lib/types";

export default class DummyProjectService implements ProjectService {
  async list() {
    return null;
  }
}
