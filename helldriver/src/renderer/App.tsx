import { MemoryRouter as Router, Routes, Route, data, useLocation } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import MapBackground from '../../assets/circle_PNG63.png';
import './App.css';
import fetchNurkiAPI from '../main/API';
import { use, useState, useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

function Hello() {
  const [text,setText] = useState<string>('');
// renderer.js

async function fetchAPIData() {
  const data = await window.api.getAPI();
  console.log(data[0].setting.overrideBrief);
  setText(data[0].setting.overrideBrief);
}
fetchAPIData();
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
  const mapRef = useRef<maplibregl.Map | null>(null);;

  useEffect(() => {
    if (mapRef.current) return; // prevent double init
    if (!mapContainerRef.current) return;

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
  center: [0, 0],
  zoom: 0,
  bearing: 0,
  pitch: 40,
  maxBounds: [
    [MIN, MIN],
    [MAX, MAX]
  ]
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
