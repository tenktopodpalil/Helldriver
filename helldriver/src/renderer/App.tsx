import { MemoryRouter as Router, Routes, Route, data, useLocation } from 'react-router-dom';
import MapBackground from '../../assets/circle_PNG63.png';
import Super_Ziemia from '../../assets/Super_Ziemia.png';
import Planet_data from '../../assets/planets/planets.json';
import './App.css';
import { use, useState, useRef, useEffect } from 'react';
import maplibregl, { Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import generate_Hyperlanes from './Hyperlanes';
import { Console } from 'console';
import { planetIcons } from './PlanetIconImport';
import swampBase from '../../assets/planets/planet_icons/swamp_base.png';
import { loadPlanetIcons } from './LoadPlanetIcons';
import { FeatureCollection, Geometry } from 'geojson';
import { get } from 'http';
import { features } from 'process';
import * as turf from '@turf/turf';
import type { Units } from '@turf/helpers';
import sectorsPNG from '../../assets/planets/planet_icons/empty_map.png';
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

    ]
  },
  center: [0.5, 0.5],
  zoom: 7,
  bearing: 0,
  minZoom: 7,
  maxZoom: 11,
  pitch: 40,
  maxBounds: [
    [MIN-1, MIN-1],
    [MAX+1, MAX+1]
  ]
});
const LoadIcons = async () => 
  {
    //await loadPlanetIcons(mapRef.current!);
  }
  LoadIcons()

// Add the point after the map loads
    

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      setIsMapLoaded(true);
    };
  }, []);

let mouseX = 0;
let mouseY = 0;




  //planety
  useEffect(()  => {
    const map = mapRef.current;
    const planets = apiData?.planetInfos;
    const Wardata = WarapiData;
    
    type Planet_data_processed = keyof typeof Planet_data;
    //console.log(planets);
    console.log(Planet_data[259].biome);



const addPlanetsSource = () => {

  const geojson: FeatureCollection<Geometry> = {
    type: 'FeatureCollection',
    features: planets?.map((planet: any) => {
      
      /*
          console.log(planets)
    console.log(WarapiData)
    console.log(Wardata)
    console.log(Wardata.planetStatus);
    */
   
      const nazwa = planet.index as Planet_data_processed;
      
      let x = planet.position.x + 1;
      let y = planet.position.y + 1;
      if(planet.index === 64){
        //pozycja meridii w grze jest inna niż w api, więc trzeba to poprawić ręcznie
        x += -0.02;
        
        
      }
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [x, y]
        },
        properties: {
          id: planet.index,
          icon: Planet_data[nazwa].biome,
          name: Planet_data[nazwa].name,
          faction: Wardata.planetStatus[planet.index].owner
          
        }
      };
      
    }
  ) ?? []

  };
  function DefenseCampaigns(campaign: any,planets:any) {
    console.log("defenses");
    console.log(campaign);


const pastDate: Date = new Date("2024-02-13T18:37:30");

const now: Date = new Date();
  let UpperText = '';
  switch(campaign.race){
  case 2: {
     UpperText = 'TERMINID ATTACK'
    console.log(UpperText)
    break;
  }
  case 3: {
     UpperText = 'AUTOMATON ATTACK'
    break;
  }
  case 4: {
     UpperText = 'ILLUMINATE ATTACK'
    break;
  }
}


const secondsPassed: number = Math.floor(
  (now.getTime() - pastDate.getTime()) / 1000
);
let final = Math.max(campaign.expireTime - secondsPassed); // remaining seconds
final += 84600
// Convert to hours, minutes, seconds
let hours = Math.floor(final / 3600);
let minutes = Math.floor((final % 3600) / 60);
let seconds = Math.floor(final % 60);

// Format with leading zeros
let formatted = [Math.abs(hours), Math.abs(minutes), Math.abs(seconds)]
  .map(unit => String(unit).padStart(2, '0'))
  .join(':');
  console.log(campaign.expireTime)
  console.log(secondsPassed)
  console.log(final)
  
  setInterval(() => {
    final -=1;
    hours = Math.floor(final / 3600);
    minutes = Math.floor((final % 3600) / 60);
    seconds = Math.floor(final % 60);
    formatted = [Math.abs(hours), Math.abs(minutes), Math.abs(seconds)]
  .map(unit => String(unit).padStart(2, '0'))
  .join(':');
    timer.textContent = `${UpperText}`;
        const br = document.createElement('br'); // line break
        timer.appendChild(br);
        const timeText = document.createTextNode(`${formatted} left`); // second line
        timer.appendChild(timeText);
  }, 1000);


  const el = document.createElement('div');
        el.className = 'marker';
       const timer = document.createElement('span');
        timer.textContent = `${UpperText}`;
        const br = document.createElement('br'); // line break
        timer.appendChild(br);
        const timeText = document.createTextNode(`${formatted} left`); // second line
        timer.appendChild(timeText);
        el.style.height = 'px';
        el.style.marginBottom = `20px`;
        el.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        el.appendChild(timer)
 
        


        new maplibregl.Marker({element: el})
            .setLngLat([planets[campaign.planetIndex].position.x+1, planets[campaign.planetIndex].position.y+1.02])
            .addTo(map!);


  }



  console.log("points added")
  console.log(geojson);
  
  geojson.features.push({
    type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [0.036+1, 0.04+1]
        },
        properties: {
          id: 2137,
          icon: 'mars',
          name: 'mars',
          faction: 1
        }
        
  })
  // center [lng, lat]


  map?.addSource('points', {
    type: 'geojson',
    data: geojson,
    cluster: false,
    
  });
 
    Wardata.planetEvents.map((campaign: any) => {
    
    DefenseCampaigns(campaign,planets)
  });

};

map?.on('load', () => {
  map.addSource('image-source', {
    type: 'image',
    url: sectorsPNG,
    coordinates: [
      [-1+1,  1+1],  // top-left
      [ 1+1,  1+1],  // top-right
      [ 1+1, -1+1],  // bottom-right
      [-1+1, -1+1],  // bottom-left
    ]
  });

  map.addLayer({
    id: 'image-layer',
    type: 'raster',
    source: 'image-source',
    paint: {
      'raster-opacity': 0.85
    }
  });
});

const addPlanetsLayer = (planets : JSON) => 
  {
    const loadIcons = async () => {
    await loadPlanetIcons(map!);
    
    map?.addLayer({
      id: 'planets-layer',
      type: 'symbol',
      source: 'points',
      layout: {
        'icon-image': [
          'match',
          ['get', 'id'],  
          51, 'fractured_planet',   //Fractured planet
          85, 'fractured_planet',   //Fractured planet
          127, 'fractured_planet',  //Fractured planet
          64, 'blackhole',         //Meridia
          115, 'blackhole',   //Penta 
          263, 'unknown',   //Unknown planet
          264, 'unknown',   //Unknown planet
          265, 'unknown',   //Unknown planet
          2137, 'mars',   //Mars
          /* default  */ ['get', 'icon'] 
        ],
        'icon-anchor': 'center',
        'icon-size': [
          'interpolate',
          ['linear'],
          ['zoom'],

          7,
          ['case', ['==', ['get', 'id'], 0], 0.12, 0.06],

          8,
          ['case', ['==', ['get', 'id'], 0], 0.12, 0.06],

          12,
          ['case', ['==', ['get', 'id'], 0], 0.3, 0.18]
          ],
        
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
        'text-allow-overlap': true,      // 👈 add this
        'text-ignore-placement': true ,   // 👈 add this
        'text-field': [
        'step',
        ['zoom'],
        '',              // 👈 below zoom 6 → no text
        9, ['get', 'name'] // 👈 from zoom 6+ → show text
        ], // or any property
        'text-size': [
          'case', ['==', ['get', 'id'], 0], 16, 13
        ],
        'text-anchor': 'bottom',
                
        'text-offset': [
          'interpolate',
          ['exponential', 2.2],
          ['zoom'],
          8,  ['case', ['==', ['get', 'id'], 0], ['literal', [0, 4.0]], ['literal', [0, 2.5]]],
          9,   ['case', ['==', ['get', 'id'], 0], ['literal', [0, 4.35]], ['literal', [0, 2.7]]],
          9.5, ['case', ['==', ['get', 'id'], 0], ['literal', [0, 40.85]], ['literal', [0, 2.9]]],
          
          10,  ['case', ['==', ['get', 'id'], 0], ['literal', [0, 5.1]], ['literal', [0, 3.1]]],
          10.25,  ['case', ['==', ['get', 'id'], 0], ['literal', [0, 5.45]], ['literal', [0, 3.1]]],
          10.5,['case', ['==', ['get', 'id'], 0], ['literal', [0, 5.65]], ['literal', [0, 3.2]]],
          10.75,['case', ['==', ['get', 'id'], 0], ['literal', [0, 5.7]], ['literal', [0, 3.2]]],
          11,  ['case', ['==', ['get', 'id'], 0], ['literal', [0, 5.75]], ['literal', [0, 3.3]]]
          ],
        //'text-offset': [0, 1.2],
        
      },
      paint: {
        'text-color': [
                'match',
                ['get', 'faction'],
                2, 'yellow',
                3, '#b60000',
                4, '#ab00fd',
                '#ffffff'
            ],
        'text-halo-color': [
          'match',
        ['get', 'id'],  
        0, '#ffcc00',
          /* default color */ '#000000' 
        ],
        'text-halo-width': [
         'match',
        ['get', 'id'],  
        0, 0.4,
          /* default */ 10 
        ],
        'text-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        8, 0.5,
        9, 1
        ],

        
      },
      
    });
    }
    loadIcons();
  }
mapRef.current!.on('zoomend', () => console.log(mapRef.current!.getZoom()));
// If the style is already loaded, add immediately; otherwise wait for it
if (map?.isStyleLoaded()) {
  addPlanetsSource();
  addPlanetsLayer(planets);
  console.log("map loaded")
} 
       
    planets?.forEach((planet: any) => {
      const nazwa = planet.index as Planet_data_processed;
      generate_Hyperlanes(planet,mapRef.current!,planets,Wardata);
      map!.addSource(`points${planet.index}`, {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {  },
          geometry: { type: 'Point', coordinates: [planet.position.x+1, planet.position.y+1] }
        }
      ]
    }
  });
 
      
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
