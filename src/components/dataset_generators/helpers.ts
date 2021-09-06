// @ts-nocheck
import GeoJSON from 'ol/format/GeoJSON';
import { transformGeoJsonToCRS } from '@/crs';
import { MoviciError } from '@/errors';
import { DatasetGeneratorDataset } from '@/types';

export function findDataset(type: string, currentDataset: DatasetGeneratorDataset) {
  let currentChild, result;

  if (type === currentDataset.type) {
    return currentDataset;
  } else {
    if (currentDataset.childs === undefined) {
      return null;
    }

    // Loop over child types
    for (let childTypeIdx = 0; childTypeIdx < currentDataset.childs.length; ++childTypeIdx) {
      const currentChildType = currentDataset.childs[childTypeIdx];

      for (let childIdx = 0; childIdx < currentChildType.datasets.length; ++childIdx) {
        currentChild = currentChildType.datasets[childIdx];
        // Search in the current child
        result = findDataset(type, currentChild);

        if (result !== null) {
          return result;
        }
      }

      // Return the result if the node has been found
    }

    // The node has not been found and we have no more options
    return null;
  }
}

export function validateGeoJSON(textData: string) {
  let feature;
  try {
    feature = new GeoJSON().readFeature(textData);
  } catch (e) {
    console.warn('Invalid GeoJSON supplied');
    failMessage('Invalid GeoJSON supplied');
    return false;
  }

  const featureType = feature?.getGeometry()?.getType();
  if (featureType?.toLowerCase() == 'polygon') {
    return true;
  }

  failMessage(`Feature is not a Polygon but a ${featureType}`);
  return false;
}

export function transformGeoJSON(geojson: GeoJSON) {
  let transformed;
  try {
    transformed = transformGeoJsonToCRS(geojson);
  } catch (e) {
    console.warn(e.message);
    if (e instanceof MoviciError) {
      failMessage(e.message);
    }
  }
  return transformed;
}
