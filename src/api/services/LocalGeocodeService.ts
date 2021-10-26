import { Client, GeocodeService } from '~flow/api';
import { GetGeocodeResult, GetGeocodeResults, GetGeocodeSuggestions } from '~flow/api/requests';
import { GeocodeSearchQuery, GeocodeSuggestion } from '~flow/types';

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
