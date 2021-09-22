import Client from '@/flow/api/client';
import GeocodeService from '@/flow/api/backend/geocode';
import { reverseTransform } from '@/flow/crs';
import { GetGeocodeResult, GetGeocodeResults, GetGeocodeSuggestions } from '@/flow/requests';
import { GeocodeSearchQuery, GeocodeSuggestion } from '@/flow/types';

export default class LocalGeocodeService implements GeocodeService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  getSuggestions(query: GeocodeSearchQuery, upstreamEPSG: number) {
    return new Promise<null>(resolve => resolve(null));
    // return this.client.request(new GetGeocodeSuggestions(prepareQuery(query, upstreamEPSG)));
  }

  resolveSuggestion(suggestion: GeocodeSuggestion) {
    return new Promise<null>(resolve => resolve(null));
    // return this.client.request(new GetGeocodeResult(suggestion.result_uuid));
  }

  getResults(query: GeocodeSearchQuery, upstreamEPSG: number) {
    return new Promise<null>(resolve => resolve(null));
    // return this.client.request(new GetGeocodeResults(prepareQuery(query, upstreamEPSG)));
  }
}

function prepareQuery(query: GeocodeSearchQuery, epsg_code: number) {
  query = { ...query };
  if (query.nearby_location) {
    query.nearby_location = reverseTransform(query.nearby_location);
  }
  if (query.bounding_box) {
    query.bounding_box = [
      ...reverseTransform([query.bounding_box[0], query.bounding_box[1]]),
      ...reverseTransform([query.bounding_box[2], query.bounding_box[3]])
    ];
  }
  query.epsg_code = epsg_code;
  return query;
}
