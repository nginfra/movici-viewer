/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client, GeocodeService } from '~flow/api';
import { GeocodeSearchQuery, GeocodeSuggestion } from '~flow/types';

export default class MockGeocodeService implements GeocodeService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  getSuggestions(query: GeocodeSearchQuery) {
    return new Promise<null>(resolve => resolve(null));
  }

  resolveSuggestion(suggestion: GeocodeSuggestion) {
    return new Promise<null>(resolve => resolve(null));
  }

  getResults(query: GeocodeSearchQuery) {
    return new Promise<null>(resolve => resolve(null));
  }
}
