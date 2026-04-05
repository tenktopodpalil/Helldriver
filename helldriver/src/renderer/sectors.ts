import * as turf from '@turf/turf';
import maplibregl from 'maplibre-gl';
import { FeatureCollection, Geometry, Position } from 'geojson';


export default function renderSectors(map: maplibregl.Map) {



/**
 * Returns coordinates along a circular arc.
 * Splice these into your polygon's coordinate array wherever you want a curved edge.
 *
 * @param {[number, number]} center       [lng, lat] — centre of the circle the arc belongs to
 * @param {number}           radiusKm     Radius of that circle
 * @param {number}           startAngleDeg  Start angle in degrees (0 = north, clockwise)
 * @param {number}           endAngleDeg    End angle in degrees
 * @param {number}           steps          More steps = smoother curve (default 64)
 */
function arcCoordinates(center: [number, number], radiusKm: number, startAngleDeg: number, endAngleDeg: number, steps = 64) {
  const [lng, lat] = center;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const coords = [];

  for (let i = 0; i <= steps; i++) {
    const angle = toRad(startAngleDeg + ((endAngleDeg - startAngleDeg) * i) / steps);
    const dLat = (radiusKm / 111.32) * Math.cos(angle);
    const dLng = (radiusKm / (111.32 * Math.cos(toRad(lat)))) * Math.sin(angle);
    coords.push([lng + dLng, lat + dLat]);
  }

  return coords;
}





function AltusSector(): GeoJSON.Feature<GeoJSON.Polygon> {

const arc = arcCoordinates(
  [1, 1],  // centre of the circle your arc curves around
  23,              // radius
  0,              // start angle (degrees, 0=north, clockwise)
  90,               // end angle
);
const arc2 = arcCoordinates(
  [1, 1],  // centre of the circle your arc curves around
  10,              // radius
  90,              // start angle (degrees, 0=north, clockwise)
  0,               // end angle
);

const polygon: GeoJSON.Feature<GeoJSON.Polygon> = {
  type: 'Feature',
  properties: {name: 'Altus Sector'},
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [1.0, 1.09],
      [1.0, 1.19],
      ...arc,
      [1.09,1.0],
      ...arc2,
      
      [1.0,1.09]

    ]],
  },
};
return polygon;
}




const altus = AltusSector();

const Sectors: FeatureCollection<Geometry> = {
  type: 'FeatureCollection',
  features: [altus]
};
return Sectors;


}