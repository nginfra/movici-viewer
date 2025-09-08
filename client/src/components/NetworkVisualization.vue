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
          <div class="help-text">
            <small>
              <strong>Instructions:</strong><br>
              1. Click features to select them<br>
              2. Press Delete/Backspace to delete selected<br>
              3. Node deletion automatically removes connected edges
            </small>
          </div>
          
        </div>
      </template>
      
      <template #control-bottom>
        <!-- Legend -->
        <div class="legend">
          <div class="legend-item">
            <div class="legend-color" style="background: #007bff;"></div>
            <span>Normal</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background: #ffc107;"></div>
            <span>Selected</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background: #dc3545;"></div>
            <span>Deleted</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background: #28a745;"></div>
            <span>Hovered</span>
          </div>
        </div>
      </template>
    </Deck>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, markRaw, onMounted, onUnmounted, nextTick, computed } from 'vue'
import type { PropType } from 'vue'
import { PathLayer, ScatterplotLayer } from '@deck.gl/layers'
import type { Layer } from '@deck.gl/core'
import { EditableGeoJsonLayer } from '@deck.gl-community/editable-layers'
import { DrawPointMode, DrawLineStringMode, ModifyMode, ViewMode } from '@deck.gl-community/editable-layers'
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

interface GeoJsonFeature {
  type: 'Feature'
  properties: {
    id: string | number
    display_name?: string
    _entityType?: string
    from_node?: string | number
    to_node?: string | number
  }
  geometry: {
    type: 'Point' | 'LineString'
    coordinates: number[] | number[][]
  }
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
  featuresDeleted: [deletedIds: string[]]
}>()

const DEFAULT_VIEWSTATE = useMoviciSettings().settings.defaultViewState
const deckRef = ref<{ zoomToBBox(bbox: any, ratio?: number): void } | null>(null)
const selectionMode = ref(true)
const deleteMode = ref(false)
const viewState = ref<ViewState>(DEFAULT_VIEWSTATE)
const basemap = ref('mapbox://styles/mapbox/light-v10') // Use same default as Deck component
const deckLayers = ref<Layer<unknown>[]>([]) // Changed from computed to ref with proper type
const editMode = ref<any>(new ViewMode())
const selectedFeatureIndexes = ref<number[]>([])

// Function to get segment color based on its state
const getSegmentColor = (segmentId: string) => {
  if (props.deletedSegments.has(segmentId)) return [220, 53, 69, 200] // Red for deleted
  if (props.selectedSegments.has(segmentId)) return [255, 193, 7, 255] // Bright yellow for selected
  return [0, 123, 255, 160] // Blue for normal
}

// Convert segments to GeoJSON features
const segmentsToGeoJson = computed(() => {
  const features: GeoJsonFeature[] = []
  const nodeMap = new Map<string | number, [number, number]>() // Map of node IDs to coordinates
  
  // First pass: collect all node positions
  for (const segment of props.segments) {
    if (!segment.geometry) continue
    
    // Check if it's a point (node)
    if (segment._entityType?.includes('node') && 
        segment.geometry.length === 2 && 
        typeof segment.geometry[0] === 'number') {
      const [x, y] = segment.geometry as number[]
      const [lon, lat] = transformCoordinate(x, y)
      nodeMap.set(segment.id, [lon, lat])
    }
  }
  
  // Second pass: create features
  for (const segment of props.segments) {
    if (!segment.geometry) continue
    if (props.deletedSegments.has(String(segment.id))) continue // Skip deleted segments
    
    // Handle point geometry (nodes)
    if (segment.geometry.length === 2 && typeof segment.geometry[0] === 'number') {
      const [x, y] = segment.geometry as number[]
      const [lon, lat] = transformCoordinate(x, y)
      
      features.push({
        type: 'Feature',
        properties: {
          id: segment.id,
          display_name: segment.display_name || `Node ${segment.id}`,
          _entityType: segment._entityType,
          from_node: segment.from_node,
          to_node: segment.to_node
        },
        geometry: {
          type: 'Point',
          coordinates: [lon, lat]
        }
      })
    }
    // Handle linestring geometry (edges/segments)
    else if (Array.isArray(segment.geometry[0])) {
      const coordinates = (segment.geometry as number[][]).map(point => {
        const [x, y] = point
        return transformCoordinate(x, y)
      })
      
      features.push({
        type: 'Feature',
        properties: {
          id: segment.id,
          display_name: segment.display_name || `Segment ${segment.id}`,
          _entityType: segment._entityType,
          from_node: segment.from_node,
          to_node: segment.to_node
        },
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        }
      })
    }
  }
  
  return {
    type: 'FeatureCollection',
    features: features
  }
})

// Find connected edges when a node is deleted
const findConnectedEdges = (nodeId: string | number): string[] => {
  const connectedEdgeIds: string[] = []
  
  console.log('=== FINDING CONNECTED EDGES ===')
  console.log('Looking for edges connected to node:', nodeId)
  console.log('Available segments:', props.segments.length)
  
  // Log all segments for debugging - especially for entity 219
  if (String(nodeId) === '219') {
    console.log('=== DEBUGGING ENTITY 219 ===')
    console.log('All segments for entity 219 analysis:')
    props.segments.forEach((segment, index) => {
      console.log(`Segment ${index}:`, {
        id: segment.id,
        display_name: segment.display_name,
        from_node: segment.from_node,
        to_node: segment.to_node,
        _entityType: segment._entityType,
        geometry: segment.geometry ? 'has geometry' : 'no geometry'
      })
    })
  }
  
  for (const segment of props.segments) {
    // Check if this is an edge connected to the deleted node
    // Try different comparison methods since the data types might vary
    const segmentFromNode = String(segment.from_node)
    const segmentToNode = String(segment.to_node)
    const targetNodeId = String(nodeId)
    
    const isConnected = segmentFromNode === targetNodeId || segmentToNode === targetNodeId
    
    if (isConnected) {
      console.log('🔗 Found connected edge:', {
        edgeId: segment.id,
        from_node: segment.from_node,
        to_node: segment.to_node,
        connectedToNode: nodeId,
        _entityType: segment._entityType
      })
      connectedEdgeIds.push(String(segment.id))
    }
    
    // Log segments with any connection info for debugging
    if (segment.from_node !== undefined || segment.to_node !== undefined) {
      console.log('Segment with connections:', {
        id: segment.id,
        from_node: segment.from_node,
        to_node: segment.to_node,
        _entityType: segment._entityType,
        isConnectedToTarget: isConnected
      })
    }
  }
  
  console.log('=== FINAL RESULT ===')
  console.log('Found', connectedEdgeIds.length, 'connected edges:', connectedEdgeIds)
  return connectedEdgeIds
}

// Handle feature deletion with cascade deletion for nodes
const handleFeatureEdit = (event: any) => {
  console.log('handleFeatureEdit called with event:', event)
  
  if (!event) {
    console.log('No event provided')
    return
  }
  
  if (!event.editType) {
    console.log('No editType in event')
    return
  }
  
  console.log('Edit type:', event.editType)
  console.log('Event data:', event.data)
  
  // Handle different deletion event types
  const isDeletionEvent = event.editType === 'removeFeature' || 
                         event.editType === 'deleteFeature' ||
                         event.editType === 'removePosition' ||
                         event.editType === 'finishMovePosition'
  
  if (isDeletionEvent && event.data) {
    const allDeletedIds: string[] = []
    
    // Handle deleted features
    const processDeletedFeatures = (features: any[]) => {
      console.log('Processing deleted features:', features)
      for (const feature of features) {
        const featureId = feature.properties?.id
        if (!featureId) continue
        
        console.log('Processing feature deletion:', featureId, 'geometry type:', feature.geometry?.type)
        allDeletedIds.push(String(featureId))
        
        // If a node is deleted, find and delete connected edges
        if (feature.geometry?.type === 'Point' || feature.properties?._entityType?.includes('node')) {
          console.log('This is a node, looking for connected edges...')
          const connectedEdges = findConnectedEdges(featureId)
          console.log(`Node ${featureId} deleted, cascade deleting ${connectedEdges.length} connected edges:`, connectedEdges)
          allDeletedIds.push(...connectedEdges)
        }
      }
    }
    
    // Try different ways to get deleted features from the event
    let processedSomething = false
    
    if (event.data.deletedFeatures && Array.isArray(event.data.deletedFeatures)) {
      console.log('Processing deletedFeatures from event.data')
      processDeletedFeatures(event.data.deletedFeatures)
      processedSomething = true
    }
    
    if (event.data.features && Array.isArray(event.data.features)) {
      console.log('Processing features from event.data')
      processDeletedFeatures(event.data.features)
      processedSomething = true
    }
    
    if (event.data.selectedFeatures && Array.isArray(event.data.selectedFeatures)) {
      console.log('Processing selectedFeatures from event.data')
      processDeletedFeatures(event.data.selectedFeatures)
      processedSomething = true
    }
    
    // If no features array found, try to extract feature from the event directly
    if (!processedSomething && event.data.updatedData) {
      console.log('Trying to extract deleted features from updatedData')
      const originalFeatures = segmentsToGeoJson.value.features
      const updatedFeatures = event.data.updatedData.features
      
      // Find features that were in original but not in updated (deleted features)
      const originalIds = new Set(originalFeatures.map((f: any) => String(f.properties?.id)))
      const updatedIds = new Set(updatedFeatures.map((f: any) => String(f.properties?.id)))
      
      const deletedFeatureIds = [...originalIds].filter(id => !updatedIds.has(id))
      console.log('Deleted feature IDs from diff:', deletedFeatureIds)
      
      for (const deletedId of deletedFeatureIds) {
        const originalFeature = originalFeatures.find((f: any) => String(f.properties?.id) === deletedId)
        if (originalFeature) {
          processDeletedFeatures([originalFeature])
        }
      }
    }
    
    // Emit the deletion event with all deleted IDs
    console.log('Final deleted IDs to emit:', allDeletedIds)
    if (allDeletedIds.length > 0) {
      emit('featuresDeleted', allDeletedIds)
    }
  }
}

// Function to update Deck.gl layers
const updateLayers = () => {
  console.log('Creating Deck layers for', props.segments.length, 'entities')
  console.log('First few entities:', props.segments.slice(0, 3))
  
  if (props.segments.length === 0) {
    deckLayers.value = []
    return
  }

  const layers = []
  
  // Create EditableGeoJsonLayer for interactive editing  
  const editableLayer = new EditableGeoJsonLayer({
    id: `editable-geojson-${Date.now()}`, // Force update with unique ID
    data: segmentsToGeoJson.value,
    mode: editMode.value,
    
    // Styling
    getFillColor: (feature: any, info: any) => {
      const id = String(feature.properties?.id || '')
      const isSelected = selectedFeatureIndexes.value.includes(info.index)
      
      if (props.deletedSegments.has(id)) return [220, 53, 69, 100]
      if (props.selectedSegments.has(id) || isSelected) return [255, 193, 7, 100]
      return [0, 123, 255, 50]
    },
    getLineColor: (feature: any, info: any) => {
      const id = String(feature.properties?.id || '')
      const isSelected = selectedFeatureIndexes.value.includes(info.index)
      
      if (props.deletedSegments.has(id)) return [220, 53, 69, 200]
      if (props.selectedSegments.has(id) || isSelected) return [255, 193, 7, 255]
      return [0, 123, 255, 200]
    },
    getPointRadius: 8,
    getLineWidth: 3,
    
    // Interaction
    pickable: true,
    autoHighlight: true,
    highlightColor: [0, 255, 0, 200],
    
    // Edit callbacks
    onEdit: handleFeatureEdit,
    
    // Click handling for selection
    onClick: (info: any) => {
      console.log('🖱️ CLICK EVENT:', {
        hasObject: !!info.object,
        index: info.index,
        coordinate: info.coordinate,
        featureId: info.object?.properties?.id,
        featureType: info.object?.geometry?.type,
        entityType: info.object?.properties?._entityType
      })
      
      if (info.object) {
        const featureId = info.object.properties?.id
        if (featureId) {
          console.log('🎯 Feature clicked:', {
            id: featureId,
            index: info.index,
            type: info.object.geometry?.type,
            entityType: info.object.properties?._entityType
          })
          
          if (selectionMode.value) {
            emit('segmentClick', String(featureId))
          }
          
          // Handle selection for EditableGeoJsonLayer
          if (info.index !== undefined) {
            const currentSelected = [...selectedFeatureIndexes.value]
            const indexPos = currentSelected.indexOf(info.index)
            
            console.log('Selection before update:', currentSelected)
            
            if (indexPos >= 0) {
              // Deselect
              currentSelected.splice(indexPos, 1)
              console.log('🔲 Deselected feature at index:', info.index)
            } else {
              // Select
              currentSelected.push(info.index)
              console.log('✅ Selected feature at index:', info.index)
            }
            
            selectedFeatureIndexes.value = currentSelected
            console.log('📊 Updated selectedFeatureIndexes:', selectedFeatureIndexes.value)
          } else {
            console.log('❌ No index in click info')
          }
        } else {
          console.log('❌ No feature ID in clicked object')
        }
      } else {
        console.log('❌ No object in click event')
      }
    },
    
    // Hover handling
    onHover: (info: any) => {
      if (info.object) {
        const featureId = info.object.properties?.id
        emit('segmentHover', featureId ? String(featureId) : null)
      } else {
        emit('segmentHover', null)
      }
    },
    
    // Update triggers for reactive updates
    updateTriggers: {
      getFillColor: [props.selectedSegments, props.deletedSegments, selectedFeatureIndexes.value],
      getLineColor: [props.selectedSegments, props.deletedSegments, selectedFeatureIndexes.value],
      data: [props.segments, props.deletedSegments],
      selectedFeatureIndexes: selectedFeatureIndexes.value
    }
  } as any)
  
  layers.push(editableLayer as any)
  
  // Also add non-editable visualization layers for better rendering
  const lineEntities = []
  const pointEntities = []
  
  for (const entity of props.segments) {
    if (props.deletedSegments.has(String(entity.id))) continue
    
    const geometry = entity.geometry || []
    
    if (geometry.length === 2 && typeof geometry[0] === 'number' && typeof geometry[1] === 'number') {
      const [x, y] = geometry
      const transformedPoint = transformCoordinate(x, y)
      pointEntities.push({
        id: entity.id,
        position: transformedPoint,
        color: getSegmentColor(String(entity.id)),
      })
    } else if (Array.isArray(geometry) && geometry.length > 0 && Array.isArray(geometry[0])) {
      const transformedPath = (geometry as number[][]).map(point => {
        const [x, y] = point
        return transformCoordinate(x, y)
      })
      
      if (transformedPath.length > 0) {
        lineEntities.push({
          id: entity.id,
          path: transformedPath,
          color: getSegmentColor(String(entity.id)),
        })
      }
    }
  }
  
  // Add PathLayer for better edge visualization
  if (lineEntities.length > 0) {
    const pathLayer = new PathLayer({
      id: 'network-segments-viz',
      data: lineEntities,
      getPath: (d: any) => d.path,
      getColor: (d: any) => d.color,
      getWidth: 5,
      widthMinPixels: 2,
      widthMaxPixels: 10,
      pickable: false, // Let EditableGeoJsonLayer handle interaction
      visible: true,
      updateTriggers: {
        getColor: [props.selectedSegments, props.deletedSegments]
      }
    })
    layers.push(pathLayer)
  }
  
  // Add ScatterplotLayer for better node visualization
  if (pointEntities.length > 0) {
    const pointLayer = new ScatterplotLayer({
      id: 'network-nodes-viz',
      data: pointEntities,
      getPosition: (d: any) => d.position,
      getColor: (d: any) => d.color,
      getRadius: 6,
      radiusMinPixels: 3,
      radiusMaxPixels: 12,
      pickable: false, // Let EditableGeoJsonLayer handle interaction
      visible: true,
      updateTriggers: {
        getColor: [props.selectedSegments, props.deletedSegments]
      }
    })
    layers.push(pointLayer)
  }

  console.log('Created', layers.length, 'visualization layers')
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
  if (selectionMode.value) {
    deleteMode.value = false
    editMode.value = new ViewMode()
  }
}

const toggleDeleteMode = () => {
  deleteMode.value = !deleteMode.value
  console.log('Delete mode toggled:', deleteMode.value)
  if (deleteMode.value) {
    selectionMode.value = false
    editMode.value = new ModifyMode()
  } else {
    editMode.value = new ViewMode()
  }
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
    
    // Never auto-fit - let the user control the view
  } else {
    // Still update layers when empty to clear the map
    updateLayers()
  }
}, { immediate: true })

// Watch for selection changes
watch([() => props.selectedSegments, () => props.deletedSegments], () => {
  console.log('Selection or deletion changed, updating layers')
  updateLayers()
}, { deep: true })

// Watch for edit mode changes
watch(editMode, () => {
  updateLayers()
})

// Watch for selection changes
watch(selectedFeatureIndexes, () => {
  updateLayers()
}, { deep: true })

// Watch deckLayers to confirm they're being set
watch(deckLayers, (newLayers) => {
  console.log('deckLayers watcher triggered, layers:', newLayers?.length)
  if (newLayers && newLayers.length > 0) {
    console.log('First layer in deckLayers:', newLayers[0])
  }
}, { deep: true })

// Handle direct deletion of selected features
const handleDirectDelete = () => {
  console.log('🚀 DIRECT DELETE TRIGGERED')
  console.log('Selected feature indexes:', selectedFeatureIndexes.value)
  
  if (selectedFeatureIndexes.value.length === 0) {
    console.log('❌ No features selected for deletion')
    return
  }
  
  const features = segmentsToGeoJson.value.features
  console.log('Total features available:', features.length)
  const deletedIds: string[] = []
  
  // Get selected features and process deletions
  for (const index of selectedFeatureIndexes.value) {
    const feature = features[index]
    if (!feature) {
      console.log('❌ Feature not found at index:', index)
      continue
    }
    
    const featureId = feature.properties?.id
    if (!featureId) {
      console.log('❌ Feature has no ID:', feature)
      continue
    }
    
    console.log('🎯 Processing direct deletion of feature:', {
      id: featureId,
      type: feature.geometry?.type,
      entityType: feature.properties?._entityType,
      index: index
    })
    
    deletedIds.push(String(featureId))
    
    // If a node is deleted, find and delete connected edges
    const isNode = feature.geometry?.type === 'Point' || feature.properties?._entityType?.includes('node')
    if (isNode) {
      console.log('🔍 Direct delete: This is a node, looking for connected edges...')
      const connectedEdges = findConnectedEdges(featureId)
      console.log(`🗑️ Direct delete: Node ${featureId} deleted, cascade deleting ${connectedEdges.length} connected edges:`, connectedEdges)
      deletedIds.push(...connectedEdges)
    } else {
      console.log('📏 This is an edge/segment, no cascade deletion needed')
    }
  }
  
  // Clear selection
  selectedFeatureIndexes.value = []
  
  // Emit deletion
  if (deletedIds.length > 0) {
    console.log('📡 Emitting direct deletion of:', deletedIds)
    emit('featuresDeleted', deletedIds)
  } else {
    console.log('❌ No valid features to delete')
  }
}

// Keyboard shortcuts for delete mode
const handleKeyPress = (event: KeyboardEvent) => {
  console.log('Key pressed:', event.key)
  
  if (event.key === 'Delete' || event.key === 'Backspace') {
    event.preventDefault()
    
    // If in delete mode or selection mode, handle direct deletion
    if (deleteMode.value || selectionMode.value) {
      console.log('Handling direct delete via keyboard')
      handleDirectDelete()
    } else {
      // Enable delete mode on delete/backspace key
      toggleDeleteMode()
    }
  } else if (event.key === 'Escape') {
    // Disable delete mode on escape key
    if (deleteMode.value) {
      toggleDeleteMode()
    }
    // Clear selection
    selectedFeatureIndexes.value = []
  }
}

// Ensure layers are updated after mount
onMounted(async () => {
  console.log('NetworkVisualization mounted')
  await nextTick()
  
  // Add keyboard event listeners
  window.addEventListener('keydown', handleKeyPress)
  
  // Wait a bit for Deck to be fully initialized (map needs to load first)
  setTimeout(() => {
    if (props.segments.length > 0) {
      console.log('Updating layers after Deck initialization delay')
      updateLayers()
    }
  }, 500) // Give Deck time to initialize after map loads
})

// Clean up on unmount
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
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



.legend-overlay {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 0rem;
  border-radius: 8px;
  box-shadow: 0 2px 2px rgba(0,0,0,0.1);
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

.help-text {
  background: rgba(255, 255, 255, 0.95);
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
  border: 1px solid #ddd;
  max-width: 250px;
}

.legend {
  background: white;
  padding: 0.5rem;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  border: 1px solid #ddd;
  font-size: 0.8rem;
  pointer-events: auto;
}

.legend .legend-item {
  margin-bottom: 0.25rem;
}

.legend .legend-item:last-child {
  margin-bottom: 0;
}
</style>