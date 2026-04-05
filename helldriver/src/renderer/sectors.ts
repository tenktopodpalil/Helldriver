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
function BarnardSector(): GeoJSON.Feature<GeoJSON.Polygon> {

const arc = arcCoordinates(
  [1, 1],  // centre of the circle your arc curves around
  23,              // radius
  90,              // start angle (degrees, 0=north, clockwise)
  105,               // end angle
);
const arc2 = arcCoordinates(
  [1, 1],  // centre of the circle your arc curves around
  33.7,              // radius
  106.7,              // start angle (degrees, 0=north, clockwise)
  135,               // end angle
);
const arc3 = arcCoordinates(
  [1, 1],  // centre of the circle your arc curves around
  23,              // radius
  135,              // start angle (degrees, 0=north, clockwise)
  165,               // end angle
);
const arc4 = arcCoordinates(
  [1, 1],  // centre of the circle your arc curves around
  10,              // radius
  165,              // start angle (degrees, 0=north, clockwise)
  90,               // end angle
);

const polygon: GeoJSON.Feature<GeoJSON.Polygon> = {
  type: 'Feature',
  properties: {name: 'Barnard Sector'},
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [1.09, 1.0],
      [1.19, 1.0],
      ...arc,
      [1.29,0.914],
      ...arc2,
      [1.147,0.853],
      ...arc3,
      [1.02,0.912],
      ...arc4

    ]],
  },
};
return polygon;
}
function CancriSector(): GeoJSON.Feature<GeoJSON.Polygon> {


const arc2 = arcCoordinates(
  [1, 1],  // centre of the circle your arc curves around
  33.7,              // radius
  135,              // start angle (degrees, 0=north, clockwise)
  192,               // end angle
);

const arc = arcCoordinates(
  [1, 1],  // centre of the circle your arc curves around
  23,              // radius
  165,              // start angle (degrees, 0=north, clockwise)
  135,             // end angle
);
const arc3 = arcCoordinates(
  [1, 1],  // centre of the circle your arc curves around
  10,              // radius
  192,              // start angle (degrees, 0=north, clockwise)
  165,             // end angle
);
console.log(arc2);
const polygon: GeoJSON.Feature<GeoJSON.Polygon> = {
  type: 'Feature',
  properties: {name: 'Cancri Sector'},
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [1.02,0.912],
      [1.053,0.800],
      ...arc,
      [1.214,0.785],
      ...arc2,
      [0.98,0.912],
      ...arc3,
      [1.02,0.912],

    ]],
  },
};
return polygon;
}
function GothmarSector(): GeoJSON.Feature<GeoJSON.Polygon> {


const arc2 = arcCoordinates(
  [1, 1],  // centre of the circle your arc curves around
  23,              // radius
  223,              // start angle (degrees, 0=north, clockwise)
  204,               // end angle
);

const arc = arcCoordinates(
  [1, 1],  // centre of the circle your arc curves around
  33.7,              // radius
  192,              // start angle (degrees, 0=north, clockwise)
  222,             // end angle
);
const arc3 = arcCoordinates(
  [1, 1],  // centre of the circle your arc curves around
  10,              // radius
  204,              // start angle (degrees, 0=north, clockwise)
  193,             // end angle
);


const polygon: GeoJSON.Feature<GeoJSON.Polygon> = {
  type: 'Feature',
  properties: {name: 'Gothmar Sector'},
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [0.937,0.703],
      ...arc,
      [0.86,0.8489],
      ...arc2,
      [0.96,0.92],
      ...arc3,
      

    ]],
  },
};
return polygon;
}
function CantolusSector(): GeoJSON.Feature<GeoJSON.Polygon> {


const arc2 = arcCoordinates(
  [1, 1],  // centre of the circle your arc curves around
  23,              // radius
  223,              // start angle (degrees, 0=north, clockwise)
  204,               // end angle
);

const arc = arcCoordinates(
  [1, 1],  // centre of the circle your arc curves around
  33.7,              // radius
  192,              // start angle (degrees, 0=north, clockwise)
  222,             // end angle
);
const arc3 = arcCoordinates(
  [1, 1],  // centre of the circle your arc curves around
  10,              // radius
  204,              // start angle (degrees, 0=north, clockwise)
  193,             // end angle
);


const polygon: GeoJSON.Feature<GeoJSON.Polygon> = {
  type: 'Feature',
  properties: {name: 'Cantolus Sector'},
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [0.937,0.703],
      ...arc,
      [0.86,0.8489],
      ...arc2,
      [0.96,0.92],
      ...arc3,
      

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