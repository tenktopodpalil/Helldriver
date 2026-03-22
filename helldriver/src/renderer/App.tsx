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
  const [isMapLoaded, setIsMapLoaded] = useState(false);

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
const MAX = 2;

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
  console.log("fddjd")
  console.log(apiData);


    //Reszta planet
});

    
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      setIsMapLoaded(true);
    };
  }, []);
  //planety
  useEffect(() => {
    const map = mapRef.current;
    const planets = apiData?.planetInfos;
    console.log(planets);

    planets?.forEach((planet: any) => {
      if(planet.index === 0) {
        const el = document.createElement('img');
        el.src = Super_Ziemia;
        el.className = 'Super-Earth';
        el.style.width = '500px';
        el.style.height = '500px';

      }
     
      const el = document.createElement('img');
      el.src = Super_Ziemia;
      el.className = 'planet';
      el.style.width = '20px';
      el.style.height = '20px';
      mapRef.current!.on('zoom', () => {
        const zoom = mapRef.current!.getZoom();
        const scale = Math.pow(2, (zoom - 8) / 2);
        el.style.transform = `${el.style.transform.replace(/\s*scale\([^)]*\)/, '')} scale(${scale})`;
      });
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([planet.position.x + 1, planet.position.y + 1])
        .addTo(mapRef.current!);
    });
      


  }, [apiData, isMapLoaded]);
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
