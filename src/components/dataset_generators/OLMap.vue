<template>
  <div>
    <div id="map" class="map"></div>
    <div id="mouse-position" />
  </div>
</template>
<script>
import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import { EventBus } from '@/eventbus.ts';
import { mapGetters } from 'vuex';
import { Map, View } from 'ol';
import * as extent from 'ol/extent';
import { Projection } from 'ol/proj';
import { Draw, Modify, Select } from 'ol/interaction';
import { Group, Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource, WMTS as WMTSSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import {
  Control,
  defaults as defaultControls,
  FullScreen,
  MousePosition,
  ZoomToExtent
} from 'ol/control';
import { createStringXY } from 'ol/coordinate';
import { Fill, Stroke, Style } from 'ol/style';
import LayerSwitcher from 'ol-layerswitcher';
import DatasetGeneratorsStore from '@/store/modules/DatasetGeneratorsStore';

// Extent and resolutions of RD GRID (matching our GeoServer grid configuration)
const projectionExtent = [
  634.5732789819012,
  306594.5543000576,
  284300.0254094796,
  636981.7698870874
];

const resolutions = [
  1290.5750608868243,
  645.2875304434122,
  322.6437652217061,
  161.32188261085304,
  80.66094130542652,
  40.33047065271326,
  20.16523532635663,
  10.082617663178315,
  5.041308831589157,
  2.5206544157945787,
  1.2603272078972894,
  0.6301636039486447,
  0.3150818019743223,
  0.1575409009871612,
  0.0787704504935806
];

const projection = new Projection({
  code: 'EPSG:28992',
  units: 'm',
  extent: projectionExtent
});

const matrixIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

export default {
  props: {
    allowDraw: {
      type: Boolean,
      default: true
    },
    basemaps: {
      type: Array,
      default: () => [
        { layer: 'epsg_28992:map_aerial', title: 'Aerial map' },
        { layer: 'epsg_28992:map_basemap', title: 'Base map' },
        { layer: 'epsg_28992:map_basemap_labelled', title: 'Base map with labels' }
      ]
    },
    polygon: {
      type: Object,
      default: null
    }
  },
  name: 'ol-map',
  data() {
    return {
      map: null,
      vectorLayer: null,
      draw: null,
      select: null,
      modify: null,
      polygonUpdatedByThisTab: false,
      tileLayers: [],
      basemapsGroup: null
    };
  },
  methods: {
    createMap() {
      let polygonStyle = new Style({
        stroke: new Stroke({
          color: 'rgba(18,187,252,0.9)',
          width: 5,
          lineDash: [5, 8]
        }),
        fill: new Fill({
          color: 'rgba(255,255,255,0.4)'
        })
      });

      let selectionStyle = new Style({
        stroke: new Stroke({
          color: 'rgba(18,187,252,0.9)',
          width: 5
        }),
        fill: new Fill({
          color: 'rgba(255,255,255,0.4)'
        })
      });

      this.vectorLayer = new VectorLayer({
        source: new VectorSource(),
        style: polygonStyle
      });

      let mousePositionControl = new MousePosition({
        coordinateFormat: createStringXY(2),
        projection: 'EPSG:28992',
        undefinedHTML: '',
        target: document.getElementById('mouse-position'),
        className: 'custom-mouse-position'
      });

      this.map = new Map({
        layers: [this.basemapsGroup, this.vectorLayer],
        target: 'map',
        controls: defaultControls().extend([
          new ZoomToExtent(),
          new FullScreen(),
          mousePositionControl,
          new LayerSwitcher()
        ]),
        view: new View({
          center: [151000, 465000],
          minZoom: 2,
          maxZoom: 12,
          zoom: 2,
          projection: projection
        })
      });

      this.draw = new Draw({
        source: this.vectorLayer.getSource(),
        type: 'Polygon'
      });

      this.select = new Select({
        wrapX: false,
        style: selectionStyle
      });

      this.modify = new Modify({
        features: this.select.getFeatures()
      });

      this.draw.on('drawend', this.onDrawEnd);
      this.modify.on('modifyend', this.onModifyEnd);
    },

    addBasemaps() {
      // Loop over basemap to add
      this.basemaps.forEach(basemap => {
        this.tileLayers.push(
          new TileLayer({
            title: basemap.title,
            type: 'base',
            visible: true,
            source: new WMTSSource({
              url: this.wmtsUrl,
              layer: basemap.layer,
              matrixSet: 'EPSG:28992-RD',
              format: 'image/png',
              projection: projection,
              tileGrid: new WMTSTileGrid({
                origin: extent.getTopLeft(projectionExtent),
                resolutions: resolutions,
                matrixIds: matrixIds
              }),
              wrapx: false
            })
          })
        );
      });

      // Make layer group, to make layer switcher work
      this.basemapsGroup = new Group({
        title: 'Base maps',
        layers: this.tileLayers
      });

      // Set tile load function for each layer, to handle authorization header
      // correctly
      for (let i = 0; i < this.basemapsGroup.getLayers().getLength(); ++i) {
        let layer = this.basemapsGroup.getLayers().item(i);
        let source = layer.getSource();
        source.setTileLoadFunction(this.tileLoadFunction);
      }
    },
    addRemoveFeatureButton() {
      let removeButton = document.createElement('button');
      removeButton.innerHTML = '<i class="fas fa-trash"></i>';

      removeButton.addEventListener('click', this.onRemoveFeature);

      let removeElement = document.createElement('div');
      removeElement.className = 'remove-polygon ol-unselectable ol-control';
      removeElement.appendChild(removeButton);

      let removeControl = new Control({ element: removeElement });

      this.map.addControl(removeControl);
    },

    addDrawPolygonButton() {
      let button = document.createElement('button');
      button.innerHTML = '<i class="fas fa-draw-polygon"></i>';

      let element = document.createElement('div');
      element.className = 'add-polygon ol-unselectable ol-control';
      element.appendChild(button);

      button.addEventListener('click', this.onDrawPolygon, false);

      let drawPolygonControl = new Control({ element: element });

      this.map.addControl(drawPolygonControl);
    },

    onDrawPolygon() {
      let featureCount = this.vectorLayer.getSource().getFeatures().length;

      if (featureCount > 0) {
        this.$buefy.dialog.alert('Only 1 polygon feature is allowed.');
      } else {
        this.map.addInteraction(this.draw);
        this.map.removeInteraction(this.select);
        this.map.removeInteraction(this.modify);
      }
    },

    addPolygon() {
      this.vectorLayer.getSource().clear({
        fast: true
      });

      if (!this.polygon) {
        return;
      }

      let feature = new GeoJSON().readFeature(JSON.stringify(this.polygon));
      this.vectorLayer.getSource().addFeature(feature);

      this.map.removeInteraction(this.draw);
      this.map.addInteraction(this.select);
      this.map.addInteraction(this.modify);

      this.select.getFeatures().clear();
    },

    getPolygonFeature() {
      if (this.vectorLayer.getSource().getFeatures().length === 0) {
        return null;
      }

      return this.vectorLayer.getSource().getFeatures()[0];
    },

    getPolygonGeoJSON(feature) {
      let geojson = JSON.parse(new GeoJSON().writeGeometry(feature.getGeometry(), { decimals: 3 }));
      geojson.crs = { properties: { name: 'EPSG:28992' }, type: 'name' };

      return JSON.stringify(geojson);
    },

    updatePolygon(feature) {
      this.polygonUpdatedByThisTab = true;

      if (feature) {
        let geojson = JSON.parse(this.getPolygonGeoJSON(feature));
        this.$emit('polygon-changed', geojson);
      } else {
        this.$emit('polygon-changed', {});
      }
    },

    zoomToFeature() {
      let feature = this.getPolygonFeature();
      if (feature) {
        this.map.getView().fit(feature.getGeometry());
      }
    },

    onDrawEnd(e) {
      this.map.removeInteraction(this.draw);
      this.map.addInteraction(this.select);
      this.map.addInteraction(this.modify);

      this.select.getFeatures().clear();
      this.updatePolygon(e.feature);
    },

    onModifyEnd() {
      this.updatePolygon(this.getPolygonFeature());
    },

    onRemoveFeature() {
      this.vectorLayer.getSource().clear({
        fast: true
      });

      this.map.removeInteraction(this.select);
      this.map.removeInteraction(this.modify);
      this.map.removeInteraction(this.draw);

      this.updatePolygon(null);
    },

    tileLoadFunction(tile, src) {
      // This sets the authorization headers
      // for the OpenLayers tile requests
      let xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.addEventListener('loadend', function () {
        let data = this.response;
        if (data !== undefined) {
          tile.getImage().src = URL.createObjectURL(data);
        }
      });
      xhr.open('GET', src);
      xhr.setRequestHeader('Authorization', this.apiToken);
      xhr.send();
    },

    update(activeTabId) {
      if ((activeTabId === 'editor' || activeTabId === undefined) && this.map) {
        // UpdateSize of map with delay otherwise
        // map not showing after tab switch
        setTimeout(() => {
          this.map.updateSize();

          if (activeTabId === 'editor') {
            this.zoomToFeature();
          }
        }, 50);
      }
    }
  },
  computed: {
    ...mapGetters({
      apiBase: 'apiBase',
      apiToken: 'apiToken'
    }),
    dataset_generator() {
      return DatasetGeneratorsStore.currentDatasetGenerator;
    },
    wmtsEndpoint() {
      return DatasetGeneratorsStore.wmtsEndPoint;
    },
    wmtsUrl() {
      return this.apiBase + this.wmtsEndpoint;
    }
  },
  watch: {
    polygon() {
      if (this.polygonUpdatedByThisTab) {
        this.polygonUpdatedByThisTab = false;
        return;
      }

      this.addPolygon();
      this.zoomToFeature();
    }
  },
  updated() {
    this.update();
  },
  mounted() {
    this.addBasemaps();
    this.createMap();

    if (this.allowDraw) {
      this.addDrawPolygonButton();
      this.addRemoveFeatureButton();
    }

    this.addPolygon();
    this.zoomToFeature();

    this.update();
  },
  created() {
    EventBus.$on('dataset-generators-active-tab', this.update);
  },
  beforeDestroy() {
    EventBus.$off('dataset-generators-active-tab', this.update);
  }
};
</script>
