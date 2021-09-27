import Client from '@/flow/src/api/client';
import GeocodeService from '@/flow/src/api/services/geocode';
import {
  GetGeocodeResult,
  GetGeocodeResults,
  GetGeocodeSuggestions
} from '@/flow/src/api/requests';
import { GeocodeSearchQuery, GeocodeSuggestion } from '@/flow/src/types';

export default class LocalGeocodeService implements GeocodeService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  getSuggestions(query: GeocodeSearchQuery) {
    // return new Promise<null>(resolve => resolve(null));
    return this.client.request(new GetGeocodeSuggestions(query));
  }

  resolveSuggestion(suggestion: GeocodeSuggestion) {
    // return new Promise<null>(resolve => resolve(null));
    return this.client.request(new GetGeocodeResult(suggestion.result_uuid));
  }

  getResults(query: GeocodeSearchQuery) {
    // return new Promise<null>(resolve => resolve(null));
    return this.client.request(new GetGeocodeResults(query));
  }
}
