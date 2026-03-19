import { MemoryRouter as Router, Routes, Route, data, useLocation } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import MapBackground from '../../assets/circle_PNG63.png';
import Super_Ziemia from '../../assets/Super_Ziemia.png';
import './App.css';
import { use, useState, useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

/**
* Fetches data from the Helldivers API.
* https://api.live.prod.thehelldiversgame.com/api/{endpoint}
*
* @param endpoint API endpoint (example: "v2/Assignment/War/801")
* @returns Parsed JSON response from the API
*/
async function fetchAPIData(endpoint: string) {

  const data = await window.api.getAPI(endpoint);
  //console.log(data[0].setting.overrideBrief);
  return data;
  
}


function MapComponent() {
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [apiData, setApiData] = useState<any>(null);

    useEffect(() => {
    fetchAPIData('WarSeason/801/WarInfo').then((data) => {
      setApiData(data);
      console.log(data.planetInfos);
      mapRef.current?.on
    });
  }, []);
  useEffect(() => {
    if (mapRef.current) return; // prevent double init
    if (!mapContainerRef.current) return;
console.log(apiData?.d?.apiData);
const MIN = 0;
const MAX = 1;

mapRef.current = new maplibregl.Map({
  container: mapContainerRef.current,
  style: {
    version: 8,
    sources: {
      bg: {
        type: 'image',
        url: MapBackground,
        coordinates: [
          [MIN+0.2, MAX-0.2],
          [MAX-0.2, MAX-0.2],
          [MAX-0.2, MIN+0.2],
          [MIN+0.2, MIN+0.2]
        ]
      }
    },
    layers: [
      {
        id: 'bg',
        type: 'raster',
        source: 'bg'
      }
    ]
  },
  center: [0.5, 0.5],
  zoom: 7,
  bearing: 0,
  pitch: 40,
  maxBounds: [
    [MIN, MIN],
    [MAX, MAX]
  ]
});
// Add the point after the map loads
mapRef.current.on('load', async () => {
  const map = mapRef.current!;


});
mapRef.current.on('load', async () => {
  const map = mapRef.current!;

  const image = await map.loadImage(Super_Ziemia);
  map.addImage('custom-marker', image.data);

const markerEl = document.createElement('img');
markerEl.src = Super_Ziemia;
markerEl.style.width = '32px';
markerEl.style.height = '32px';

const marker = new maplibregl.Marker({ element: markerEl, anchor: 'center' })
  .setLngLat([0.5, 0.5])
  .addTo(map);

const BASE_ZOOM = 10;   // zoom level where size = BASE_SIZE
const BASE_SIZE = 28;  // px at BASE_ZOOM

map.on('zoom', () => {
  const scale = Math.pow(2, map.getZoom() - BASE_ZOOM);
  const size = BASE_SIZE * scale;
  markerEl.style.width = `${size}px`;
  markerEl.style.height = `${size}px`;
});
});
    
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div
        ref={mapContainerRef}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapComponent />} />
      </Routes>
    </Router>
  );
}
