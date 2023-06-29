import type { GeocodeService } from '@movici-flow-lib/types';

export default class LocalGeocodeService implements GeocodeService {
  async upstreamEPSG() {
    return 28992;
  }

  async getSuggestions() {
    return null;
  }

  async resolveSuggestion() {
    return null;
  }

  async getResults() {
    return null;
  }
}
