import { GeocodeSearchQuery, GeocodeSearchResult, GeocodeSuggestion } from '@/flow/types';

export default interface GeocodeService {
  resolveSuggestion(suggestion: GeocodeSuggestion): Promise<GeocodeSearchResult | null>;
  getSuggestions(
    query: GeocodeSearchQuery,
    upstreamEPSG: number
  ): Promise<GeocodeSuggestion[] | null>;
  getResults(
    query: GeocodeSearchQuery,
    upstreamEPSG: number
  ): Promise<GeocodeSearchResult[] | null>;
}
