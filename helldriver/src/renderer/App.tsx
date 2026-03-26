import { MemoryRouter as Router, Routes, Route, data, useLocation } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import MapBackground from '../../assets/circle_PNG63.png';
import Super_Ziemia from '../../assets/Super_Ziemia.png';
import Planet_data from '../../assets/planets/planets.json';
import './App.css';
import { use, useState, useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Generate_Hyperlanes from './Hyperlanes';

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
  const [WarapiData, setWarApiData] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

    useEffect(() => {
    fetchAPIData('WarSeason/801/WarInfo').then((data) => {
      setApiData(data);
      console.log(data.planetInfos);
      mapRef.current?.on
    });
    fetchAPIData('WarSeason/801/Status').then((Wardata) => {
      setWarApiData(Wardata);
      console.log(Wardata);
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
          [MIN-0.2, MAX+0.2],
          [MAX+0.2, MAX+0.2],
          [MAX+0.2, MIN-0.2],
          [MIN-0.2, MIN-0.2]
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
  maxZoom: 12,
  pitch: 40,
  maxBounds: [
    [MIN-1, MIN-1],
    [MAX+1, MAX+1]
  ]
});
// Add the point after the map loads

    
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
    const Wardata = WarapiData;
    
    type Planet_data_processed = keyof typeof Planet_data;
    //console.log(planets);
    planets?.forEach((planet: any) => {
      const nazwa = planet.index as Planet_data_processed;
      let BASE_SIZE
      const upper = document.createElement('div'); //maplibre handler
      const container = document.createElement('div'); //true container
      
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.gap = '4px';
      const img = document.createElement('img'); //planet image
      const imgWrapper = document.createElement('div');  // wraps the image 

      let zoom = mapRef.current!.getZoom();
      let scale = Math.pow(2, (zoom - 8) / 2);
      const name = document.createElement('span'); //planet name  ----------------nazwy planet z planets.json
      name.textContent = Planet_data[nazwa].name;
      name.className = 'planet-name';
      name.style = `font-size: 15px`
      name.style.opacity = '0';
      name.style.transition = 'opacity 0.7s ease';
      name.style.transform = `${img.style.transform.replace(/\s*scale\([^)]*\)/, '')} scale(${scale})`;

      //determine special places
      if(planet.index === 0) {
        img.src = Super_Ziemia;
        BASE_SIZE = 40;
        img.className = 'Super-Earth';
        img.style.width = BASE_SIZE + "px";
        img.style.height = BASE_SIZE + "px";

      }
      else{
        if(Planet_data[nazwa].name==""){
          BASE_SIZE = 0;
          img.src=""
          img.className="empty"
          img.style.width = '0px';
          img.style.height = '0px'; 
        }
        else{
        BASE_SIZE = 20;
        img.src = Super_Ziemia;
        img.className = 'planet';
        img.style.width = BASE_SIZE + "px";
        img.style.height = BASE_SIZE + "px"; 
           }
      }

      //faction logic

      if(Wardata.planetStatus[planet.index].owner == 1){

      }
      switch (Wardata.planetStatus[planet.index].owner) {
          case 1:
            // do something
            break;
          case 2:
            name.style.color='yellow'
            console.log("bug")
            break;
          case 3:
            name.style.color='#b60000'
            console.log("bot")
            break;
          case 4:
            name.style.color='#ab00fd'
            console.log("bot")
            break;
          default:
            console.log("nuh uh")
            console.log(Wardata.planetStatus[planet.index].owner)
            break;
        }


      //zoom logic
      const updateScale = () => {
        scale = Math.pow(2, (zoom - 8) / 2);
        zoom = mapRef.current!.getZoom();
        img.style.transform = `${img.style.transform.replace(/\s*scale\([^)]*\)/, '')} scale(${scale})`;

      };

      imgWrapper.style.width = `${BASE_SIZE}px`;
      imgWrapper.style.height = `${BASE_SIZE}px`;
      imgWrapper.style.display = 'flex';
      imgWrapper.style.alignItems = 'center';
      imgWrapper.style.justifyContent = 'center';
      imgWrapper.style.overflow = 'visible';

      mapRef.current!.on('zoom', updateScale);
      mapRef.current!.on('zoomend', updateScale);

      mapRef.current!.on('zoomend', () => {
        const zoom = mapRef.current!.getZoom();
        check_Name_Visibility(zoom, name);
      });


      
      //console.log(planet);
     // console.log(Planet_data[nazwa].name);
      imgWrapper.appendChild(img);
      
      container.appendChild(imgWrapper);
      container.appendChild(name);
      upper.appendChild(container);
      
      const marker = new maplibregl.Marker({ element: container })
        .setLngLat([planet.position.x + 1, planet.position.y + 1])
        .addTo(mapRef.current!);

      updateScale(); // set correct size on init
    });
    const check_Name_Visibility = (CurZoom:number, name:HTMLSpanElement) => {
      if(CurZoom <= 9.8){
        name.style.opacity = '0';
        console.log("ppo") 
      }
      else{
        console.log("oop");
        name.style.opacity = '1';
      }

    }
      


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
