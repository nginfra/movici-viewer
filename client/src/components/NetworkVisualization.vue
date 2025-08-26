<template>
  <div class="network-visualization">
    <div class="debug-message">
      <p><strong>Debug:</strong> Segments loaded: {{ props.segments.length }}</p>
      <p><strong>Issue:</strong> Deck.gl layers created but not rendering</p>
      <p><strong>Next step:</strong> Try ScatterplotLayer as simple test</p>
    </div>
    <Deck
      ref="deckRef"
      :modelValue="viewState"
      @update:modelValue="updateViewState"
      :layers="deckLayers"
      :basemap="basemap"
    >
      <template #control-right>
        <div class="editor-controls">
          <button @click="zoomToFit" class="btn btn-sm btn-secondary">
            Fit to View
          </button>
          <button @click="toggleSelectionMode" :class="['btn', 'btn-sm', selectionMode ? 'btn-primary' : 'btn-secondary']">
            {{ selectionMode ? 'Selection Mode: ON' : 'Selection Mode: OFF' }}
          </button>
          
          <!-- Debug info -->
          <div class="debug-info">
            <p>Segments: {{ props.segments.length }}</p>
            <p>Layers: {{ deckLayers.length }}</p>
            <p>Selected: {{ selectedSegments.size }}</p>
            <p>Deleted: {{ deletedSegments.size }}</p>
          </div>
        </div>
      </template>
      
      <template #control-bottom>
        <!-- Legend -->
        <div class="legend">
          <div class="legend-item">
            <div class="legend-color" style="background: #007bff;"></div>
            <span>Normal Segments</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background: #ffc107;"></div>
            <span>Selected Segments</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background: #dc3545;"></div>
            <span>Deleted Segments</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background: #28a745;"></div>
            <span>Hovered Segment</span>
          </div>
        </div>
      </template>
    </Deck>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, markRaw, onMounted, nextTick } from 'vue'
import type { PropType } from 'vue'
import { PathLayer, ScatterplotLayer } from '@deck.gl/layers'
import type { Layer } from '@deck.gl/core'
import Deck from '@movici-flow-lib/components/Deck.vue'
import type { ViewState } from '@movici-flow-lib/types'
import { useMoviciSettings } from '@movici-flow-lib/baseComposables/useMoviciSettings'
import proj4 from 'proj4'

// Define Dutch RD New projection (EPSG:28992) 
proj4.defs('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.4171,50.3319,465.5524,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs')

// Transform coordinate from Dutch RD New to WGS84
const transformCoordinate = (x: number, y: number): [number, number] => {
  try {
    const [lon, lat] = proj4('EPSG:28992', 'EPSG:4326', [x, y])
    return [lon, lat]
  } catch (error) {
    console.warn('Coordinate transformation failed:', error)
    return [x, y]
  }
}

console.log('NetworkVisualization component loaded')

interface Segment {
  id: string | number
  display_name?: string
  geometry?: number[][] | number[]
  from_node?: string | number
  to_node?: string | number
  _entityType?: string
}

const props = defineProps({
  segments: {
    type: Array as PropType<Segment[]>,
    required: true
  },
  selectedSegments: {
    type: Set as PropType<Set<string>>,
    required: true
  },
  deletedSegments: {
    type: Set as PropType<Set<string>>,
    required: true
  }
})

const emit = defineEmits<{
  segmentClick: [segmentId: string]
  segmentHover: [segmentId: string | null]
}>()

const DEFAULT_VIEWSTATE = useMoviciSettings().settings.defaultViewState
const deckRef = ref<{ zoomToBBox(bbox: any, ratio?: number): void } | null>(null)
const selectionMode = ref(true)
const viewState = ref<ViewState>(DEFAULT_VIEWSTATE)
const basemap = ref('mapbox://styles/mapbox/light-v10') // Use same default as Deck component
const deckLayers = ref<Layer<unknown>[]>([]) // Changed from computed to ref with proper type

// Function to get segment color based on its state
const getSegmentColor = (segmentId: string) => {
  if (props.deletedSegments.has(segmentId)) return [220, 53, 69, 200] // Red for deleted
  if (props.selectedSegments.has(segmentId)) return [255, 193, 7, 255] // Bright yellow for selected
  return [0, 123, 255, 160] // Blue for normal
}

// Function to update Deck.gl layers
const updateLayers = () => {
  console.log('Creating Deck layers for', props.segments.length, 'entities')
  console.log('First few entities:', props.segments.slice(0, 3))
  
  if (props.segments.length === 0) {
    deckLayers.value = []
    return
  }

  // Separate entities by geometry type
  const lineEntities = []
  const pointEntities = []
  
  for (const entity of props.segments) {
    const geometry = entity.geometry || []
    
    // Debug logging for geometry detection
    console.log('Entity', entity.id, '_entityType:', entity._entityType, 'geometry:', geometry, 'length:', geometry.length, 'type of first:', typeof geometry[0])
    
    // Check if it's a point geometry (single coordinate pair) or linestring (array of coordinate pairs)
    if (geometry.length === 2 && typeof geometry[0] === 'number' && typeof geometry[1] === 'number') {
      // Point geometry: [x, y]
      const [x, y] = geometry
      const transformedPoint = transformCoordinate(x, y)
      console.log('Adding point entity:', entity.id, 'at position:', transformedPoint)
      pointEntities.push({
        id: entity.id,
        position: transformedPoint,
        color: getSegmentColor(String(entity.id)),
      })
    } else if (Array.isArray(geometry) && geometry.length > 0 && Array.isArray(geometry[0])) {
      // Linestring geometry: [[x1, y1], [x2, y2], ...]
      const transformedPath = (geometry as number[][]).map(point => {
        const [x, y] = point
        return transformCoordinate(x, y)
      })
      
      if (transformedPath.length > 0) {
        console.log('Adding line entity:', entity.id, 'with path length:', transformedPath.length)
        lineEntities.push({
          id: entity.id,
          path: transformedPath,
          color: getSegmentColor(String(entity.id)),
        })
      }
    } else {
      console.log('Unrecognized geometry format for entity:', entity.id, 'geometry:', geometry, '_entityType:', entity._entityType)
    }
  }

  console.log('Created', lineEntities.length, 'line entities and', pointEntities.length, 'point entities')

  const layers = []

  // Create PathLayer for line entities (segments, links, edges)
  if (lineEntities.length > 0) {
    const pathLayer = new PathLayer({
      id: 'network-segments',
      data: lineEntities,
      getPath: (d: any) => d.path,
      getColor: (d: any) => d.color,
      getWidth: 8,
      widthMinPixels: 3,
      widthMaxPixels: 20,
      pickable: true,
      visible: true,
      autoHighlight: true,
      highlightColor: [0, 255, 0, 200], // Green highlight on hover
      onClick: (info: any) => {
        if (info.object && selectionMode.value) {
          console.log('Segment clicked:', info.object.id)
          emit('segmentClick', String(info.object.id))
        }
      },
      onHover: (info: any) => {
        if (info.object) {
          emit('segmentHover', String(info.object.id))
        } else {
          emit('segmentHover', null)
        }
      },
      updateTriggers: {
        getColor: [props.selectedSegments, props.deletedSegments]
      }
    })
    layers.push(pathLayer)
  }

  // Create ScatterplotLayer for point entities (nodes)
  if (pointEntities.length > 0) {
    console.log('Creating ScatterplotLayer with', pointEntities.length, 'points')
    const pointLayer = new ScatterplotLayer({
      id: 'network-nodes',
      data: pointEntities,
      getPosition: (d: any) => d.position,
      getColor: (d: any) => d.color,
      getRadius: 8,
      radiusMinPixels: 4,
      radiusMaxPixels: 16,
      pickable: true,
      visible: true,
      autoHighlight: true,
      highlightColor: [0, 255, 0, 200], // Green highlight on hover
      onClick: (info: any) => {
        if (info.object && selectionMode.value) {
          console.log('Node clicked:', info.object.id)
          emit('segmentClick', String(info.object.id))
        }
      },
      onHover: (info: any) => {
        if (info.object) {
          emit('segmentHover', String(info.object.id))
        } else {
          emit('segmentHover', null)
        }
      },
      updateTriggers: {
        getColor: [props.selectedSegments, props.deletedSegments]
      }
    })
    layers.push(pointLayer)
  }

  console.log('Created', layers.length, 'visualization layers')

  // Use markRaw to prevent Vue reactivity on Deck.gl layers
  deckLayers.value = markRaw(layers)
}

// Update view state when changed by Deck
const updateViewState = (newViewState: ViewState) => {
  viewState.value = newViewState
}

// Control functions
const zoomToFit = () => {
  console.log('Zoom to fit clicked')
  
  if (props.segments.length === 0) {
    return
  }

  // Calculate bounds from transformed coordinates
  let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity
  let hasValidCoords = false

  props.segments.forEach(segment => {
    if (segment.geometry) {
      // Handle point geometry [x, y]
      if (segment.geometry.length === 2 && typeof segment.geometry[0] === 'number') {
        const [x, y] = segment.geometry as number[]
        const [lon, lat] = transformCoordinate(x, y)
        if (lon && lat && !isNaN(lon) && !isNaN(lat)) {
          minLon = Math.min(minLon, lon)
          minLat = Math.min(minLat, lat)
          maxLon = Math.max(maxLon, lon)
          maxLat = Math.max(maxLat, lat)
          hasValidCoords = true
        }
      } 
      // Handle linestring geometry [[x1, y1], [x2, y2], ...]
      else if (Array.isArray(segment.geometry[0])) {
        (segment.geometry as number[][]).forEach((point: number[]) => {
          const [x, y] = point
          const [lon, lat] = transformCoordinate(x, y)
          if (lon && lat && !isNaN(lon) && !isNaN(lat)) {
            minLon = Math.min(minLon, lon)
            minLat = Math.min(minLat, lat)
            maxLon = Math.max(maxLon, lon)
            maxLat = Math.max(maxLat, lat)
            hasValidCoords = true
          }
        })
      }
    }
  })

  if (hasValidCoords && deckRef.value) {
    const bbox = [minLon, minLat, maxLon, maxLat]
    console.log('Zooming to bbox:', bbox)
    deckRef.value.zoomToBBox(bbox)
  } else {
    // Fallback to Netherlands center
    viewState.value = {
      ...viewState.value,
      longitude: 5.2913,
      latitude: 52.1326,
      zoom: 8
    }
  }
}

const toggleSelectionMode = () => {
  selectionMode.value = !selectionMode.value
}

// Watch for segment changes
watch(() => props.segments, (newSegments) => {
  console.log('Segments changed:', newSegments.length)
  if (newSegments.length > 0) {
    const firstSegment = newSegments[0]
    console.log('First segment sample:', {
      id: firstSegment.id,
      display_name: firstSegment.display_name,
      geometry: firstSegment.geometry?.slice(0, 2)
    })
    
    // Test coordinate transformation on first segment
    if (firstSegment.geometry && firstSegment.geometry.length > 0) {
      if (Array.isArray(firstSegment.geometry[0])) {
        // Linestring geometry: [[x1, y1], [x2, y2], ...]
        const [x, y] = (firstSegment.geometry as number[][])[0]
        const [lon, lat] = transformCoordinate(x, y)
        console.log('First coordinate transformation (linestring):', { x, y }, '->', { lon, lat })
      } else if (firstSegment.geometry.length === 2) {
        // Point geometry: [x, y]
        const [x, y] = firstSegment.geometry as number[]
        const [lon, lat] = transformCoordinate(x, y)
        console.log('First coordinate transformation (point):', { x, y }, '->', { lon, lat })
      }
    }
    
    // Update layers when segments change
    updateLayers()
    
    // Auto-fit when segments load
    setTimeout(() => zoomToFit(), 1000)
  }
}, { immediate: true })

// Watch for selection changes
watch([() => props.selectedSegments, () => props.deletedSegments], () => {
  updateLayers()
})

// Watch deckLayers to confirm they're being set
watch(deckLayers, (newLayers) => {
  console.log('deckLayers watcher triggered, layers:', newLayers?.length)
  if (newLayers && newLayers.length > 0) {
    console.log('First layer in deckLayers:', newLayers[0])
  }
}, { deep: true })

// Ensure layers are updated after mount
onMounted(async () => {
  console.log('NetworkVisualization mounted')
  await nextTick()
  
  // Wait a bit for Deck to be fully initialized (map needs to load first)
  setTimeout(() => {
    if (props.segments.length > 0) {
      console.log('Updating layers after Deck initialization delay')
      updateLayers()
    }
  }, 500) // Give Deck time to initialize after map loads
})
</script>

<style scoped>
.network-visualization {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f8f9fa;
}

.map-controls-overlay {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1000;
}

.debug-info {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  z-index: 1000;
}

.debug-info p {
  margin: 0.25rem 0;
}

.legend-overlay {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1000;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.legend-item:last-child {
  margin-bottom: 0;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 2px;
  border: 1px solid #ccc;
}

.btn {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}
</style>