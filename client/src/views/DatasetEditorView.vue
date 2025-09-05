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
      <!-- Dataset Selection -->
      <div v-if="!selectedDataset" class="dataset-selection">
        <h2>Select Dataset to Edit</h2>
        <div class="dataset-list">
          <div 
            v-for="dataset in availableDatasets" 
            :key="dataset.uuid"
            @click="selectDataset(dataset.uuid)"
            class="dataset-card"
          >
            <h3>{{ dataset.display_name || dataset.name }}</h3>
            <p>Type: {{ dataset.type }}</p>
            <p>UUID: {{ dataset.uuid }}</p>
          </div>
        </div>
      </div>

      <!-- Editor Interface -->
      <div v-if="selectedDataset" class="editor-interface">
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
import { useRouter } from 'vue-router'
import NetworkVisualization from '../components/NetworkVisualization.vue'

interface Dataset {
  uuid: string
  name: string
  display_name?: string
  type: string
}

interface EditableDataset extends Dataset {
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

// State
const loading = ref(false)
const availableDatasets = ref<Dataset[]>([])
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

const loadDatasets = async () => {
  loading.value = true
  try {
    const response = await fetch('/datasets/')
    const data = await response.json()
    availableDatasets.value = data.datasets || []
  } catch (error) {
    console.error('Error loading datasets:', error)
  } finally {
    loading.value = false
  }
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
  if (!selectedDataset.value || selectedEntityTypes.value.size === 0) return
  
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
    deletedSegments.value.clear()
    deleteHistory.value = []
    
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
    
    // For now, use the first selected entity type for deletion
    // In a more advanced implementation, we could group by entity type
    const entityType = Array.from(selectedEntityTypes.value)[0] || 'road_segment_entities'
    
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
        
        // Only add cascade deleted edges to deletedSegments if they're in our current segments
        // This handles the case where edges might be in different entity types we haven't loaded
        const currentSegmentIds = new Set(segments.value.map(s => String(s.id)))
        let cascadeDeletedInView = 0
        
        result.cascade_deletions.deleted_edges.forEach((edgeId: string) => {
          if (currentSegmentIds.has(edgeId)) {
            deletedSegments.value.add(edgeId)
            cascadeDeletedInView++
          }
        })
        
        console.log(`Cascade deleted ${cascadeDeletedInView} edges that were in current view (of ${result.cascade_deletions.deleted_edges.length} total)`)
        
        // If we have segment entity types loaded, we should see some cascade deletions
        // If not, prompt user to also select segment entities to see full effect
        if (cascadeDeletedInView === 0 && result.cascade_deletions.deleted_edges.length > 0) {
          console.log('Note: Connected edges were deleted but are not visible. Select segment entity types to see edges.')
        }
      }
      
      deletedSegments.value = new Set(deletedSegments.value)
      
      // Update dataset with modified data
      if (result.modified_data) {
        selectedDataset.value.data = result.modified_data
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
      console.log('Server deletion result:', result)
      
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
          
          const currentSegmentIds = new Set(segments.value.map(s => String(s.id)))
          let cascadeDeletedInView = 0
          
          result.cascade_deletions.deleted_edges.forEach((edgeId: string) => {
            if (currentSegmentIds.has(edgeId)) {
              deletedSegments.value.add(edgeId)
              cascadeDeletedInView++
            }
          })
          
          console.log(`Cascade deleted ${cascadeDeletedInView} edges in current view (of ${result.cascade_deletions.deleted_edges.length} total)`)
        }
        
        // Update dataset with modified data
        if (result.modified_data) {
          if (selectedDataset.value) selectedDataset.value.data = result.modified_data
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
onMounted(() => {
  loadDatasets()
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

.dataset-selection {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.dataset-selection h2 {
  margin-bottom: 2rem;
  color: #333;
}

.dataset-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.dataset-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid #ddd;
  cursor: pointer;
  transition: all 0.2s;
}

.dataset-card:hover {
  border-color: #007bff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.dataset-card h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.dataset-card p {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
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