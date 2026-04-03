import maplibregl from 'maplibre-gl';

export default function generateHyperlanes(planet: any, map: maplibregl.Map,planets:any) 
{
    //console.log(planet.waypoints.length);
if(planet.waypoints.length >= 1){
    console.log("Generating hyperlanes for planet: " + planet.index);
    console.log(planet)
    planet.waypoints.forEach((waypoint: any) => {
        const destination = planets[waypoint].position;
        //console.log("Destination: " + destination.x + ", " + destination.y);
        const lineCoordinates = [
            [planet.x, planet.y],
            [destination.x, destination.y]
        ];
const sourceId = `route${planet.index}-${waypoint}`;
const layerId = `${sourceId}-2`;

if (!map.getSource(sourceId)) {
    map.addSource(sourceId, {
        type: 'geojson',
        data: {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: [
                    [planet.position.x+1, planet.position.y+1.01],
                    [destination.x+1, destination.y+1.01]
                ]
            }
        }
    });
}

if (!map.getLayer(layerId)) {
    map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': '#0a5fe7',
            'line-width': 4,
            'line-opacity': 1
        }
    });
}
                console.log(`Hyperlane generated between planet ${planet.index} and waypoint ${waypoint}`);
                
    });
}
}