import { Client, GeocodeService } from '@movici-flow-common/api';
import {
  GetGeocodeResult,
  GetGeocodeResults,
  GetGeocodeSuggestions
} from '@movici-flow-common/api/requests';
import { GeocodeSearchQuery, GeocodeSuggestion } from '@movici-flow-common/types';

export default class LocalGeocodeService implements GeocodeService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  getSuggestions(query: GeocodeSearchQuery) {
    return this.client.request(new GetGeocodeSuggestions(query));
  }

  resolveSuggestion(suggestion: GeocodeSuggestion) {
    return this.client.request(new GetGeocodeResult(suggestion.result_uuid));
  }

  getResults(query: GeocodeSearchQuery) {
    return this.client.request(new GetGeocodeResults(query));
  }
}
