from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import orjson as json
from pathlib import Path

from ..model.model import Repository
from .. import dependencies
from ..schemas.dataset import Dataset

editor_router = APIRouter(prefix="/editor")


class EntitySelection(BaseModel):
    dataset_uuid: str
    entity_ids: List[str]
    entity_type: str  # e.g., "road_segment_entities", "track_segment_entities", etc.


class ModifiedDataset(BaseModel):
    name: str
    data: Dict[str, Any]


@editor_router.get("/datasets/{uuid}/editable")
def get_editable_dataset(uuid: str, repository: Repository = Depends(dependencies.repository)):
    """Get dataset in editable format with parsed JSON data"""
    try:
        dataset_info = repository.get_dataset(uuid)
        dataset_path = repository.get_dataset_data(uuid)
        
        with open(dataset_path, 'rb') as f:
            dataset_data = json.loads(f.read())
        
        # Detect network type
        network_type = detect_network_type(dataset_data)
        
        return {
            "uuid": uuid,
            "name": dataset_info["name"],
            "display_name": dataset_info["display_name"],
            "data": dataset_data,
            "editable": True,
            "network_type": network_type
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading dataset: {str(e)}")


def detect_network_type(dataset_data: Dict[str, Any]) -> Dict[str, Any]:
    """Detect the type of network in the dataset"""
    if "data" not in dataset_data:
        return {"type": "unknown", "entity_types": []}
    
    network_info = {
        "road_segment_entities": {"type": "road", "label": "Road Network"},
        "track_segment_entities": {"type": "railway", "label": "Railway Network"},
        "transport_segment_entities": {"type": "waterway", "label": "Waterway Network"},
        "pipe_segment_entities": {"type": "pipeline", "label": "Pipeline Network"},
        "cable_segment_entities": {"type": "cable", "label": "Cable Network"},
        "transport_node_entities": {"type": "transport", "label": "Transport Network"},
        "road_node_entities": {"type": "road", "label": "Road Network"},
        "track_node_entities": {"type": "railway", "label": "Railway Network"},
    }
    
    found_entities = []
    for entity_key, info in network_info.items():
        if entity_key in dataset_data["data"]:
            found_entities.append({
                "key": entity_key,
                "type": info["type"],
                "label": info["label"]
            })
    
    if found_entities:
        return {
            "type": found_entities[0]["type"],
            "label": found_entities[0]["label"],
            "entity_types": found_entities
        }
    
    # Check for generic network entities
    entity_types = []
    for key in dataset_data["data"].keys():
        if key.endswith("_entities"):
            entity_types.append({
                "key": key,
                "type": "generic",
                "label": key.replace("_", " ").title()
            })
    
    if entity_types:
        return {
            "type": "generic",
            "label": "Network",
            "entity_types": entity_types
        }
    
    return {"type": "unknown", "entity_types": []}


def delete_connected_edges(dataset_data: Dict[str, Any], deleted_node_ids: List[str], node_entity_type: str) -> Dict[str, Any]:
    """Delete edges/segments/links connected to deleted nodes"""
    deleted_node_ids_set = set(str(nid) for nid in deleted_node_ids)
    cascade_deletions = {"deleted_edges": [], "edge_types": []}
    
    # Find all edge/segment/link entity types in the dataset
    edge_suffixes = ["_segment_entities", "_link_entities", "_edge_entities"]
    
    for entity_key in dataset_data.get("data", {}).keys():
        for suffix in edge_suffixes:
            if entity_key.endswith(suffix):
                # Check if this edge type has topology connections
                edges_data = dataset_data["data"][entity_key]
                
                if "topology.from_node_id" in edges_data and "topology.to_node_id" in edges_data:
                    from_nodes = edges_data["topology.from_node_id"]
                    to_nodes = edges_data["topology.to_node_id"]
                    edge_ids = edges_data.get("id", [])
                    
                    # Find edges connected to deleted nodes
                    indices_to_delete = []
                    deleted_edge_ids = []
                    
                    for i, (from_node, to_node) in enumerate(zip(from_nodes, to_nodes)):
                        if (str(from_node) in deleted_node_ids_set or 
                            str(to_node) in deleted_node_ids_set):
                            indices_to_delete.append(i)
                            if i < len(edge_ids):
                                deleted_edge_ids.append(str(edge_ids[i]))
                    
                    if indices_to_delete:
                        # Remove the connected edges
                        indices_to_keep = [i for i in range(len(edge_ids)) if i not in indices_to_delete]
                        
                        filtered_edges = {}
                        for attr_name, attr_data in edges_data.items():
                            if isinstance(attr_data, list):
                                filtered_edges[attr_name] = [attr_data[i] for i in indices_to_keep]
                            else:
                                filtered_edges[attr_name] = attr_data
                        
                        dataset_data["data"][entity_key] = filtered_edges
                        cascade_deletions["deleted_edges"].extend(deleted_edge_ids)
                        cascade_deletions["edge_types"].append(entity_key)
                
                break  # Only process once per entity key
    
    return cascade_deletions


@editor_router.post("/datasets/{uuid}/delete-entities")
def delete_network_entities(
    uuid: str, 
    selection: EntitySelection,
    repository: Repository = Depends(dependencies.repository)
):
    """Delete selected network entities from dataset"""
    try:
        dataset_path = repository.get_dataset_data(uuid)
        
        with open(dataset_path, 'rb') as f:
            dataset_data = json.loads(f.read())
        
        # Get entity data based on entity type
        entity_type = selection.entity_type
        if "data" not in dataset_data or entity_type not in dataset_data["data"]:
            raise HTTPException(status_code=400, detail=f"No {entity_type} found in dataset")
        
        entities = dataset_data["data"][entity_type]
        
        # Find indices of entities to delete
        entity_ids = selection.entity_ids
        if "id" not in entities:
            raise HTTPException(status_code=400, detail=f"No entity IDs found in {entity_type}")
        
        # Convert entity IDs to indices for deletion
        ids_to_delete = set(entity_ids)
        indices_to_keep = []
        
        for i, entity_id in enumerate(entities["id"]):
            if str(entity_id) not in ids_to_delete:
                indices_to_keep.append(i)
        
        # Filter all entity attributes
        filtered_entities = {}
        for attr_name, attr_data in entities.items():
            if isinstance(attr_data, list):
                filtered_entities[attr_name] = [attr_data[i] for i in indices_to_keep]
            else:
                filtered_entities[attr_name] = attr_data
        
        # Update dataset
        dataset_data["data"][entity_type] = filtered_entities
        
        # If deleting nodes, also delete connected edges/segments/links
        cascade_result = None
        if "node_entities" in entity_type:
            cascade_result = delete_connected_edges(dataset_data, entity_ids, entity_type)
        
        result = {
            "success": True,
            "deleted_count": len(entity_ids),
            "remaining_count": len(indices_to_keep),
            "modified_data": dataset_data,  # Now includes cascade deletions
            "entity_type": entity_type
        }
        
        if cascade_result:
            result["cascade_deletions"] = cascade_result
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting entities: {str(e)}")


@editor_router.post("/datasets/export")
def export_modified_dataset(modified_dataset: ModifiedDataset, repository: Repository = Depends(dependencies.repository)):
    """Export modified dataset as JSON"""
    try:
        import time
        print(f"DEBUG: Export request for dataset: {modified_dataset.name}")
        
        # Get the original dataset to preserve metadata
        datasets = repository.get_datasets()
        print(f"DEBUG: Available datasets: {[d['name'] for d in datasets]}")
        original_dataset = None
        
        for dataset in datasets:
            print(f"DEBUG: Checking dataset: {dataset['name']} vs {modified_dataset.name}")
            if dataset["name"] == modified_dataset.name:
                # Load the full original dataset
                dataset_path = repository.get_dataset_data(dataset["uuid"])
                print(f"DEBUG: Loading original dataset from: {dataset_path}")
                with open(dataset_path, 'rb') as f:
                    original_dataset = json.loads(f.read())
                print(f"DEBUG: Original dataset loaded successfully")
                break
        
        if not original_dataset:
            print(f"DEBUG: No original dataset found")
            # If no original found, create minimal required structure
            export_data = {
                "name": f"{modified_dataset.name}_modified",
                "display_name": f"{modified_dataset.name.replace('_', ' ').title()} Modified",
                "type": "transport_network",  # Default for road networks
                "format": "entity_based",
                "epsg_code": 28992,  # Dutch RD New
                "created_on": int(time.time()),
                "last_modified": int(time.time()),
                "version": 3,
                "data": modified_dataset.data
            }
        else:
            print(f"DEBUG: Found original dataset")
            # Check if original dataset has required metadata
            if "type" not in original_dataset:
                print(f"DEBUG: Original dataset missing 'type' field, adding required metadata")
                # Original dataset is incomplete, add required fields
                export_data = {
                    "name": f"{modified_dataset.name}_modified",
                    "display_name": f"{modified_dataset.name.replace('_', ' ').title()} Modified",
                    "type": "transport_network",  # Default for road networks
                    "format": "entity_based",
                    "epsg_code": 28992,  # Dutch RD New
                    "created_on": original_dataset.get("created_on", int(time.time())),
                    "last_modified": int(time.time()),
                    "version": 3,
                    "bounding_box": original_dataset.get("bounding_box"),
                    "data": modified_dataset.data.get("data", modified_dataset.data)
                }
            else:
                # Original dataset is complete, preserve metadata
                export_data = original_dataset.copy()
                export_data["data"] = modified_dataset.data.get("data", modified_dataset.data)
                export_data["last_modified"] = int(time.time())
                export_data["name"] = f"{modified_dataset.name}_modified"
        
        return {
            "success": True,
            "filename": f"{modified_dataset.name}_modified.json",
            "data": export_data
        }
        
    except Exception as e:
        print(f"DEBUG: Export error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error exporting dataset: {str(e)}")


@editor_router.get("/datasets/{uuid}/network-entities")
def get_network_entities_info(uuid: str, entity_type: str = None, repository: Repository = Depends(dependencies.repository)):
    """Get network entity information for visualization"""
    try:
        dataset_path = repository.get_dataset_data(uuid)
        
        with open(dataset_path, 'rb') as f:
            dataset_data = json.loads(f.read())
        
        if "data" not in dataset_data:
            return {"entities": [], "entity_types": []}
        
        # Detect available network entity types (segments, links, edges, and nodes)
        entity_types = []
        network_suffixes = ["_segment_entities", "_link_entities", "_edge_entities", "_node_entities"]
        
        for key in dataset_data["data"].keys():
            for suffix in network_suffixes:
                if key.endswith(suffix):
                    entity_types.append(key)
                    break
        
        if not entity_types:
            return {"entities": [], "entity_types": []}
        
        # If specific entity_type requested, use it; otherwise use first available
        if entity_type and entity_type in entity_types:
            primary_entity_type = entity_type
        else:
            # Default priority: prefer actual segment entities over virtual links, then nodes
            primary_entity_type = entity_types[0]
            # First priority: non-virtual segment entities
            for etype in entity_types:
                if "segment_entities" in etype and "virtual" not in etype:
                    primary_entity_type = etype
                    break
            # If no segments found, look for any segment entities (including virtual)
            if primary_entity_type == entity_types[0]:
                for etype in entity_types:
                    if "segment_entities" in etype or "link_entities" in etype or "edge_entities" in etype:
                        primary_entity_type = etype
                        break
        
        entities_data = dataset_data["data"][primary_entity_type]
        
        # Extract key information for visualization
        entities_info = []
        entity_count = len(entities_data.get("id", []))
        
        for i in range(entity_count):
            entity_info = {
                "id": entities_data["id"][i] if "id" in entities_data else i,
                "display_name": entities_data.get("display_name", [f"Entity {i}" for _ in range(entity_count)])[i] if "display_name" in entities_data else f"Entity {i}",
                "entity_type": primary_entity_type
            }
            
            # Add geometry if available (handle both linestring and point geometries)
            if "geometry.linestring_2d" in entities_data:
                entity_info["geometry"] = entities_data["geometry.linestring_2d"][i]
                entity_info["geometry_type"] = "linestring"
            elif "geometry.x" in entities_data and "geometry.y" in entities_data:
                entity_info["geometry"] = [entities_data["geometry.x"][i], entities_data["geometry.y"][i]]
                entity_info["geometry_type"] = "point"
            
            # Add topology if available
            if "topology.from_node_id" in entities_data:
                entity_info["from_node"] = entities_data["topology.from_node_id"][i]
            if "topology.to_node_id" in entities_data:
                entity_info["to_node"] = entities_data["topology.to_node_id"][i]
                
            entities_info.append(entity_info)
        
        return {
            "entities": entities_info,
            "total_count": entity_count,
            "entity_types": entity_types,
            "primary_type": primary_entity_type
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting network entities info: {str(e)}")


# Backwards compatibility endpoints
@editor_router.post("/datasets/{uuid}/delete-segments")
def delete_road_segments_compat(
    uuid: str,
    selection: Dict[str, Any],
    repository: Repository = Depends(dependencies.repository)
):
    """Backwards compatibility endpoint for deleting network segments"""
    # Detect the appropriate entity type for this dataset
    try:
        dataset_path = repository.get_dataset_data(uuid)
        with open(dataset_path, 'rb') as f:
            dataset_data = json.loads(f.read())
        
        # Find the primary entity type using same logic as network-entities endpoint
        entity_types = []
        network_suffixes = ["_segment_entities", "_link_entities", "_edge_entities", "_node_entities"]
        
        for key in dataset_data["data"].keys():
            for suffix in network_suffixes:
                if key.endswith(suffix):
                    entity_types.append(key)
                    break
        
        # Default priority: prefer actual segment entities over virtual links, then nodes
        primary_entity_type = entity_types[0] if entity_types else "road_segment_entities"
        # First priority: non-virtual segment entities
        for etype in entity_types:
            if "segment_entities" in etype and "virtual" not in etype:
                primary_entity_type = etype
                break
        # If no segments found, look for any segment entities (including virtual)
        if primary_entity_type == entity_types[0] and entity_types:
            for etype in entity_types:
                if "segment_entities" in etype or "link_entities" in etype or "edge_entities" in etype:
                    primary_entity_type = etype
                    break
        
        entity_selection = EntitySelection(
            dataset_uuid=selection.get("dataset_uuid", uuid),
            entity_ids=selection.get("segment_ids", []),
            entity_type=primary_entity_type
        )
        return delete_network_entities(uuid, entity_selection, repository)
        
    except Exception as e:
        # Fallback to road_segment_entities if detection fails
        entity_selection = EntitySelection(
            dataset_uuid=selection.get("dataset_uuid", uuid),
            entity_ids=selection.get("segment_ids", []),
            entity_type="road_segment_entities"
        )
        return delete_network_entities(uuid, entity_selection, repository)


@editor_router.get("/datasets/{uuid}/segments")
def get_road_segments_info_compat(uuid: str, entity_type: str = None, repository: Repository = Depends(dependencies.repository)):
    """Backwards compatibility endpoint for getting network segments"""
    result = get_network_entities_info(uuid, entity_type, repository)
    # Transform the response to match old format, removing new fields
    segments = []
    for entity in result.get("entities", []):
        segment = {
            "id": entity.get("id"),
            "display_name": entity.get("display_name"),
            "geometry": entity.get("geometry"),
            "from_node": entity.get("from_node"),
            "to_node": entity.get("to_node")
        }
        segments.append(segment)
    
    return {
        "segments": segments,
        "total_count": result.get("total_count", 0)
    }