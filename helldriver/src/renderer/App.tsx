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
function Hello() {
  const [text,setText] = useState<string>('');
// renderer.js


fetchAPIData(text);
  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚{text}
            </span>
            
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="folded hands">
              🙏
            </span>
            Donate 
          </button>
        </a>
      </div>
    </div>
  );
}
//

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
          [MIN, MAX],
          [MAX, MAX],
          [MAX, MIN],
          [MIN, MIN]
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
  zoom: 11,
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

  const image = await map.loadImage(Super_Ziemia);
  map.addImage('custom-marker', image.data);

  map.addSource('point', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [0.5, 0.5] // 👈 replace with your [lng, lat]
          },
          properties: {}
        }
      ]
    }
  });

  map.addLayer({
    id: 'point',
    type: 'symbol',
    source: 'point',
    layout: {
      'icon-image': 'custom-marker',
      'icon-size': 1,
      'icon-anchor': 'center',
      'icon-allow-overlap': true
    }
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
