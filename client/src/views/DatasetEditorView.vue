<template>
  <div class="dataset-editor">
    <header class="editor-header">
      <h1>Dataset Editor</h1>
      <div class="header-controls">
        <button @click="goHome" class="btn btn-secondary">← Back to Viewer</button>
        <button 
          v-if="selectedDataset" 
          @click="exportDataset" 
          :disabled="!hasModifications"
          class="btn btn-primary"
        >
          Export Modified Dataset
        </button>
      </div>
    </header>

    <div class="editor-content">
      <!-- No Dataset ID Error -->
      <div v-if="!route.query.datasetId" class="no-dataset-error">
        <h2>No Dataset Selected</h2>
        <p>Please navigate to a dataset from the main viewer and use the EDITOR tab to edit it.</p>
        <button @click="goHome" class="btn btn-primary">← Back to Viewer</button>
      </div>

      <!-- Loading State -->
      <div v-else-if="loading" class="loading-state">
        <h2>Loading Dataset...</h2>
      </div>

      <!-- Editor Interface -->
      <div v-else-if="selectedDataset" class="editor-interface">
        <div class="editor-sidebar">
          <h3>{{ selectedDataset.display_name || selectedDataset.name }}</h3>
          
          <!-- Entity Type Selection -->
          <div v-if="availableEntityTypes.length > 1" class="entity-type-selection">
            <h4>Entity Type:</h4>
            <div class="entity-type-options">
              <label v-for="entityType in availableEntityTypes" :key="entityType" class="entity-type-option">
                <input 
                  type="checkbox" 
                  :value="entityType" 
                  :checked="selectedEntityTypes.has(entityType)"
                  @change="toggleEntityType(entityType)"
                />
                <span>{{ formatEntityTypeName(entityType) }}</span>
                <small>({{ entityType.includes('virtual') ? 'Virtual' : 'Physical' }})</small>
              </label>
            </div>
            <div v-if="isNodeType && !hasSegmentType" class="entity-type-hint">
              <small>💡 Tip: Also select segment/link entities to see edges connected to nodes</small>
            </div>
          </div>

          <div class="selection-info">
            <p><strong>Total {{ isNodeType ? 'Nodes' : 'Segments' }}:</strong> {{ totalSegments }}</p>
            <p><strong>Selected:</strong> {{ selectedSegments.size }}</p>
            <p v-if="deletedSegments.size > 0"><strong>Deleted:</strong> {{ deletedSegments.size }}</p>
          </div>

          <div class="controls">
            <button 
              @click="clearSelection" 
              :disabled="selectedSegments.size === 0"
              class="btn btn-secondary btn-sm"
            >
              Clear Selection
            </button>
            <button 
              @click="deleteSelected" 
              :disabled="selectedSegments.size === 0"
              class="btn btn-danger btn-sm"
            >
              Delete Selected {{ isNodeType ? 'Nodes' : 'Segments' }} ({{ selectedSegments.size }})
            </button>
            <button 
              @click="undoLastDelete" 
              :disabled="deleteHistory.length === 0"
              class="btn btn-warning btn-sm"
            >
              Undo Last Delete
            </button>
          </div>

          <div v-if="selectedSegments.size > 0" class="selected-segments">
            <h4>Selected {{ isNodeType ? 'Nodes' : 'Segments' }}:</h4>
            <ul class="segment-list">
              <li v-for="segmentId in selectedSegments" :key="segmentId">
                {{ getSegmentDisplayName(segmentId) }}
                <button @click="deselectSegment(segmentId)" class="btn-remove">×</button>
              </li>
            </ul>
          </div>
        </div>

        <div class="map-container">
          <NetworkVisualization
            :segments="filteredSegments"
            :selectedSegments="selectedSegments"
            :deletedSegments="deletedSegments"
            @segmentClick="toggleSegmentSelection"
            @segmentHover="onSegmentHover"
            @featuresDeleted="onFeaturesDeleted"
          />
        </div>
      </div>
    </div>

    <!-- Loading overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">Loading...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NetworkVisualization from '../components/NetworkVisualization.vue'

interface EditableDataset {
  uuid: string
  name: string
  display_name?: string
  type: string
  data: any
  editable: boolean
}

interface Segment {
  id: string | number
  display_name?: string
  geometry?: number[][] | number[]
  from_node?: string | number
  to_node?: string | number
  _entityType?: string
}

const router = useRouter()
const route = useRoute()

// State
const loading = ref(false)
const selectedDataset = ref<EditableDataset | null>(null)
const segments = ref<Segment[]>([])
const selectedSegments = ref<Set<string>>(new Set())
const deletedSegments = ref<Set<string>>(new Set())
const deleteHistory = ref<string[][]>([])
const hoveredSegment = ref<string | null>(null)
const availableEntityTypes = ref<string[]>([])
const selectedEntityTypes = ref<Set<string>>(new Set())

// Computed
const totalSegments = computed(() => segments.value.length)
const hasModifications = computed(() => deletedSegments.value.size > 0)
const isNodeType = computed(() => Array.from(selectedEntityTypes.value).some(type => type.includes('node')))
const hasSegmentType = computed(() => Array.from(selectedEntityTypes.value).some(type => type.includes('segment') || type.includes('link') || type.includes('edge')))
const hasMultipleTypes = computed(() => selectedEntityTypes.value.size > 1)

const filteredSegments = computed(() => {
  const filtered = segments.value.filter(segment => !deletedSegments.value.has(String(segment.id)))
  console.log('filteredSegments:', {
    totalSegments: segments.value.length,
    deletedSegments: deletedSegments.value.size,
    deletedIds: Array.from(deletedSegments.value),
    filteredCount: filtered.length
  })
  return filtered
})

// Methods
const goHome = () => {
  router.push('/')
}


const selectDataset = async (uuid: string) => {
  loading.value = true
  try {
    // Load editable dataset
    const datasetResponse = await fetch(`/editor/datasets/${uuid}/editable`)
    const dataset = await datasetResponse.json()
    
    // Load network entities to get available entity types
    const networkResponse = await fetch(`/editor/datasets/${uuid}/network-entities`)
    const networkData = await networkResponse.json()
    
    selectedDataset.value = dataset
    availableEntityTypes.value = networkData.entity_types || []
    
    // Start with no entity types selected by default
    selectedEntityTypes.value.clear()
    
    // Clear segments since no entity types are selected
    segments.value = []
    
  } catch (error) {
    console.error('Error loading dataset:', error)
  } finally {
    loading.value = false
  }
}

const loadSegmentsForEntityTypes = async () => {
  if (!selectedDataset.value) return
  
  // If no entity types selected, clear everything
  if (selectedEntityTypes.value.size === 0) {
    segments.value = []
    selectedSegments.value.clear()
    deletedSegments.value.clear()
    deleteHistory.value = []
    console.log('No entity types selected, cleared all segments')
    return
  }
  
  try {
    // Load entities for all selected types and combine them
    const allEntities: any[] = []
    
    for (const entityType of selectedEntityTypes.value) {
      const segmentsResponse = await fetch(
        `/editor/datasets/${selectedDataset.value.uuid}/segments?entity_type=${entityType}`
      )
      const segmentsData = await segmentsResponse.json()
      
      // Add entity type information to each entity for identification
      const entitiesWithType = (segmentsData.segments || []).map((entity: any) => ({
        ...entity,
        _entityType: entityType
      }))
      
      allEntities.push(...entitiesWithType)
    }
    
    segments.value = allEntities
    console.log('Loaded entities for types:', Array.from(selectedEntityTypes.value), segments.value.length)
    selectedSegments.value.clear()
    
    // Clear deletion tracking for entities that no longer exist in the dataset
    // (they've been physically removed by cascade deletion)
    const currentEntityIds = new Set(allEntities.map(entity => String(entity.id)))
    const validDeletedSegments = new Set<string>()
    
    deletedSegments.value.forEach(deletedId => {
      if (currentEntityIds.has(deletedId)) {
        validDeletedSegments.add(deletedId)
      }
    })
    
    deletedSegments.value = validDeletedSegments
    console.log('Cleaned up deletion tracking, valid deleted segments:', Array.from(validDeletedSegments))
    
  } catch (error) {
    console.error('Error loading segments for entity types:', error)
  }
}

const toggleEntityType = async (entityType: string) => {
  if (selectedEntityTypes.value.has(entityType)) {
    selectedEntityTypes.value.delete(entityType)
  } else {
    selectedEntityTypes.value.add(entityType)
  }
  
  // Trigger reactivity and reload
  selectedEntityTypes.value = new Set(selectedEntityTypes.value)
  await loadSegmentsForEntityTypes()
}

const formatEntityTypeName = (entityType: string): string => {
  // Convert "road_segment_entities" to "Road Segments", "transport_node_entities" to "Transport Nodes"
  if (!entityType || typeof entityType !== 'string') {
    return 'Unknown Type'
  }
  
  // Handle special cases for better naming
  const specialCases: { [key: string]: string } = {
    'transport_node_entities': 'Transport Nodes',
    'virtual_node_entities': 'Virtual Nodes', 
    'road_segment_entities': 'Road Segments',
    'track_segment_entities': 'Track Segments',
    'waterway_segment_entities': 'Waterway Segments',
    'virtual_link_entities': 'Virtual Links'
  }
  
  if (specialCases[entityType]) {
    return specialCases[entityType]
  }
  
  return entityType
    .replace(/_entities$/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

const toggleSegmentSelection = (segmentId: string) => {
  const id = String(segmentId)
  if (selectedSegments.value.has(id)) {
    selectedSegments.value.delete(id)
  } else {
    selectedSegments.value.add(id)
  }
  // Trigger reactivity
  selectedSegments.value = new Set(selectedSegments.value)
}

const deselectSegment = (segmentId: string) => {
  selectedSegments.value.delete(segmentId)
  selectedSegments.value = new Set(selectedSegments.value)
}

const clearSelection = () => {
  selectedSegments.value.clear()
  selectedSegments.value = new Set()
}

const deleteSelected = async () => {
  if (selectedSegments.value.size === 0 || !selectedDataset.value) return
  
  const entityIds = Array.from(selectedSegments.value)
  
  try {
    loading.value = true
    
    // Determine the correct entity type based on the selected segments
    let entityType = 'road_segment_entities'
    const firstSegment = segments.value.find(s => entityIds.includes(String(s.id)))
    if (firstSegment && firstSegment._entityType) {
      entityType = firstSegment._entityType
    }
    
    const response = await fetch(`/editor/datasets/${selectedDataset.value.uuid}/delete-entities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dataset_uuid: selectedDataset.value.uuid,
        entity_ids: entityIds,
        entity_type: entityType
      })
    })
    
    const result = await response.json()
    
    if (result.success) {
      // Add to delete history for undo functionality
      deleteHistory.value.push(entityIds)
      
      // Mark entities as deleted
      entityIds.forEach(id => deletedSegments.value.add(id))
      
      // Handle cascade deletions if nodes were deleted
      if (result.cascade_deletions && result.cascade_deletions.deleted_edges.length > 0) {
        console.log('Cascade deletions:', result.cascade_deletions)
        
        // Add ALL cascade deleted edges to our tracking, even if not currently visible
        // This ensures they stay deleted even when switching entity types
        result.cascade_deletions.deleted_edges.forEach((edgeId: string) => {
          deletedSegments.value.add(String(edgeId))
        })
        
        console.log(`Cascade deleted ${result.cascade_deletions.deleted_edges.length} edges`)
      }
      
      deletedSegments.value = new Set(deletedSegments.value)
      
      // Update dataset with modified data
      if (result.modified_data) {
        selectedDataset.value.data = result.modified_data
        
        // Since the server has already removed the cascade deleted edges,
        // we need to remove them from our local segments array too
        if (result.cascade_deletions && result.cascade_deletions.deleted_edges.length > 0) {
          const cascadeDeletedSet = new Set(result.cascade_deletions.deleted_edges.map((id: any) => String(id)))
          segments.value = segments.value.filter(s => !cascadeDeletedSet.has(String(s.id)))
        }
      }
      
      // Clear selection
      clearSelection()
    }
    
  } catch (error) {
    console.error('Error deleting segments:', error)
  } finally {
    loading.value = false
  }
}

const undoLastDelete = () => {
  const lastDeleted = deleteHistory.value.pop()
  if (lastDeleted) {
    lastDeleted.forEach(id => deletedSegments.value.delete(id))
    deletedSegments.value = new Set(deletedSegments.value)
  }
}

const getSegmentDisplayName = (segmentId: string) => {
  const segment = segments.value.find(s => String(s.id) === segmentId)
  return segment?.display_name || `Segment ${segmentId}`
}

const onSegmentHover = (segmentId: string | null) => {
  hoveredSegment.value = segmentId
}

const onFeaturesDeleted = async (deletedIds: string[]) => {
  console.log('Features deleted via editable layer:', deletedIds)
  
  if (deletedIds.length === 0 || !selectedDataset.value) return
  
  // Group deleted IDs by entity type to handle properly
  const nodeIds: string[] = []
  const edgeIds: string[] = []
  
  deletedIds.forEach(id => {
    const segment = segments.value.find(s => String(s.id) === id)
    if (segment) {
      if (segment._entityType?.includes('node')) {
        nodeIds.push(id)
      } else {
        edgeIds.push(id)
      }
    }
  })
  
  // Process each entity type separately to ensure cascade deletion works
  const processEntityDeletion = async (entityIds: string[], isNodeType: boolean) => {
    if (entityIds.length === 0) return
    
    try {
      loading.value = true
      
      // Determine the correct entity type
      const segment = segments.value.find(s => entityIds.includes(String(s.id)))
      const entityType = segment?._entityType || (isNodeType ? 'transport_node_entities' : 'road_segment_entities')
      
      console.log(`Deleting ${entityIds.length} entities of type ${entityType}:`, entityIds)
      console.log('Segment found for entity type detection:', segment)
      console.log('Is detected as node type:', isNodeType, 'Final entity type:', entityType)
      
      const response = await fetch(`/editor/datasets/${selectedDataset.value?.uuid}/delete-entities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dataset_uuid: selectedDataset.value?.uuid,
          entity_ids: entityIds,
          entity_type: entityType
        })
      })
      
      const result = await response.json()
      console.log('Server deletion result for entities:', entityIds)
      console.log('Full server response:', JSON.stringify(result, null, 2))
      
      if (result.success) {
        // Add to delete history for undo functionality
        deleteHistory.value.push(entityIds)
        
        // Mark entities as deleted
        entityIds.forEach(id => {
          deletedSegments.value.add(id)
          selectedSegments.value.delete(id)
        })
        
        // Handle cascade deletions if nodes were deleted
        if (result.cascade_deletions && result.cascade_deletions.deleted_edges.length > 0) {
          console.log('Processing cascade deletions:', result.cascade_deletions)
          
          // Add ALL cascade deleted edges to our tracking
          result.cascade_deletions.deleted_edges.forEach((edgeId: string) => {
            deletedSegments.value.add(String(edgeId))
          })
          
          console.log(`Cascade deleted ${result.cascade_deletions.deleted_edges.length} edges`)
          
          // Remove cascade deleted edges from our local segments array
          const cascadeDeletedSet = new Set(result.cascade_deletions.deleted_edges.map((id: any) => String(id)))
          segments.value = segments.value.filter(s => !cascadeDeletedSet.has(String(s.id)))
        }
        
        // Update dataset with modified data
        if (result.modified_data) {
          if (selectedDataset.value) {
            selectedDataset.value.data = result.modified_data
          }
        }
      }
      
    } catch (error) {
      console.error('Error deleting entities via editable layer:', error)
    } finally {
      loading.value = false
    }
  }
  
  // Process nodes first (to get cascade deletions), then edges
  if (nodeIds.length > 0) {
    await processEntityDeletion(nodeIds, true)
  }
  if (edgeIds.length > 0) {
    await processEntityDeletion(edgeIds, false)
  }
  
  // Trigger reactivity
  deletedSegments.value = new Set(deletedSegments.value)
  selectedSegments.value = new Set(selectedSegments.value)
  
  // Don't reload segments here - it would clear our tracking of cascade deletions
  // The visualization will update based on the deletedSegments set
}

const exportDataset = async () => {
  if (!selectedDataset.value || !hasModifications.value) return
  
  try {
    loading.value = true
    
    const response = await fetch('/editor/datasets/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: selectedDataset.value.name,
        data: selectedDataset.value.data
      })
    })
    
    const result = await response.json()
    
    if (result.success) {
      // Create and download file
      const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = result.filename
      link.click()
      URL.revokeObjectURL(url)
    }
    
  } catch (error) {
    console.error('Error exporting dataset:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  // Check if datasetId is provided in the query params
  const datasetId = route.query.datasetId as string
  if (datasetId) {
    // Auto-load the specified dataset
    await selectDataset(datasetId)
  }
})
</script>

<style scoped>
.dataset-editor {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.editor-header {
  background: white;
  padding: 1rem 2rem;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.editor-header h1 {
  margin: 0;
  color: #333;
}

.header-controls {
  display: flex;
  gap: 1rem;
}

.editor-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.no-dataset-error,
.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
}

.no-dataset-error h2,
.loading-state h2 {
  margin-bottom: 1rem;
  color: #333;
}

.no-dataset-error p {
  margin-bottom: 2rem;
  color: #666;
  max-width: 500px;
}

.loading-spinner {
  font-size: 1.2rem;
  color: #007bff;
}

.editor-interface {
  flex: 1;
  display: flex;
  height: 100%;
}

.editor-sidebar {
  width: 350px;
  background: white;
  border-right: 1px solid #ddd;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.editor-sidebar h3 {
  margin: 0;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

.entity-type-selection {
  margin: 1.5rem 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.entity-type-selection h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #495057;
}

.entity-type-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.entity-type-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
}

.entity-type-option input[type="radio"] {
  margin: 0;
}

.entity-type-option small {
  color: #6c757d;
  font-style: italic;
}

.entity-type-hint {
  margin-top: 8px;
  padding: 8px;
  background: #fff3cd;
  border-radius: 4px;
  color: #856404;
}

.selection-info p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.selected-segments {
  flex: 1;
}

.selected-segments h4 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1rem;
}

.segment-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
}

.segment-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f8f9fa;
  margin-bottom: 0.25rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.btn-remove {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}

.map-container {
  flex: 1;
  position: relative;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  font-size: 1.2rem;
}

/* Button styles */
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-warning:hover:not(:disabled) {
  background: #e0a800;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}
</style>