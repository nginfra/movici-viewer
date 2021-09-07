import Client from '@/api/client';
import { GetGeocodeResult, GetGeocodeResults, GetGeocodeSuggestions } from '@/api/requests';
import store from '@/store/store';
import { GeocodeSearchQuery, GeocodeSearchResult, GeocodeSuggestion } from '@/types';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { reverseTransform, transform } from '@/crs';

function transformResult(result: GeocodeSearchResult): GeocodeSearchResult {
  return Object.assign({}, result, {
    location: transform(result.location),
    bounding_box: [
      ...transform([result.bounding_box[0], result.bounding_box[1]]),
      ...transform([result.bounding_box[2], result.bounding_box[3]])
    ]
  });
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

@Module({
  name: 'geocode',
  namespaced: true,
  dynamic: true,
  store: store
})
class GeocodeStore extends VuexModule {
  suggestions: GeocodeSuggestion[] = [];
  upstreamEPSG = 28992;

  @Mutation
  setSuggestions(suggestions: GeocodeSuggestion[]) {
    this.suggestions = suggestions;
  }

  @Action({ rawError: true })
  async updateSuggestions(query: GeocodeSearchQuery) {
    const api: Client = this.context.rootGetters.api;
    if (!query) {
      this.setSuggestions([]);
      return;
    }

    this.setSuggestions(
      (await api.request(new GetGeocodeSuggestions(prepareQuery(query, this.upstreamEPSG)))) || []
    );
  }

  @Action({ rawError: true })
  async resolveSuggestion(suggestion: GeocodeSuggestion): Promise<GeocodeSearchResult | null> {
    const api: Client = this.context.rootGetters.api,
      result = await api.request(new GetGeocodeResult(suggestion.result_uuid));
    return (result && transformResult(result)) || null;
  }

  @Action({ rawError: true })
  async getFirstResult(query: GeocodeSearchQuery): Promise<GeocodeSearchResult | null> {
    const api: Client = this.context.rootGetters.api,
      result =
        (await api.request(new GetGeocodeResults(prepareQuery(query, this.upstreamEPSG)))) || [];
    return (result.length && transformResult(result[0])) || null;
  }
}

export default getModule(GeocodeStore);
