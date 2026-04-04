import { MemoryRouter as Router, Routes, Route, data, useLocation } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import MapBackground from '../../assets/circle_PNG63.png';
import Super_Ziemia from '../../assets/Super_Ziemia.png';
import Planet_data from '../../assets/planets/planets.json';
import './App.css';
import { use, useState, useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
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

  
  map?.addSource('points', {
    type: 'geojson',
    data: geojson,
    cluster: false
  });
  const addSectors = () => 
  {
    map?.addLayer({
    id: 'circle-outline',
    type: 'line',
    source: 'points',
    paint: {
      'line-color': '#007cbf',
      'line-width': 20
    }
  });
  }
  addSectors();
  

};
map?.on('load', () => {
  map.addSource('circle-source', {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [1, 1] // [lng, lat]
      },
      properties: {}
    }
  });

  map.addLayer({
    id: 'circle-layer',
    type: 'circle',
    source: 'circle-source',
    paint: {
      'circle-pitch-alignment': 'map',  // tilts with the map plane
  'circle-pitch-scale': 'map',   
      'circle-radius': 40,        // pixels
      'circle-color': '#3887be',
      'circle-opacity': 0.8,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
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
          /* default color */ '#ffffff' 
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
      generate_Hyperlanes(planet,mapRef.current!,planets);
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
  /*
  const loadIcons = async () => {
    await loadPlanetIcons(map!);
      map!.addLayer({
    id: `points-layer${planet.index}`,
    type: 'symbol',
    source: `points`,
    layout: {
      'icon-image': `${Planet_data[nazwa].biome}`,        // matches the key loaded by loadPlanetIcons
      'icon-size': 0.11,
      'icon-anchor': 'bottom',
      'text-field': Planet_data[nazwa].name,
      'text-anchor': 'top',
      'text-offset': [1, 0.5],
      'text-size': 14,
      'icon-allow-overlap': true,
      'text-allow-overlap': true,
    },
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': '#000000',
      'text-halo-width': 2,
    }
  });;
  }
  */
 
  //loadIcons();
//console.log(planet);
//console.log(map!.hasImage(planet.biome));
//console.log(planetIcons[Planet_data[0].biome]);

      /*
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
      name.style = `font-size: 0.9rem`
      name.style.opacity = '0';
      name.style.color = 'white';
      name.style.webkitTextStroke = '0.2px black';
      name.style.transition = 'opacity 0.7s ease';
      name.style.transform = `${img.style.transform.replace(/\s*scale\([^)]*\)/, '')} scale(${scale})`;

      if(planet.index === 0) {
        //super ziemia
        img.src = `${planetIcons[Planet_data[0].biome]}`;
        BASE_SIZE = 50;
        img.className = 'Super-Earth';
        img.style.width = 43 + "px";
        img.style.height = 53 + "px";
        img.style.transformOrigin = 'bottom center';
        name.style.textShadow = `#ffcc00 1px 0 10px`;
        

      }
      else if(planet.index === 115){
        //penta
          BASE_SIZE = 20;
          console.log(Planet_data[nazwa].name)
          console.log(`${Planet_data[64].biome}`);
          img.src=`${planetIcons[Planet_data[64].biome]}`;
          img.className="black_hole_penta"
        img.style.width = BASE_SIZE + "px";
        img.style.height = BASE_SIZE + "px"; 
        }
      else if(planet.index === 51 || planet.index === 85 || planet.index === 127){
        //fractured planets
          BASE_SIZE = 20;
          console.log(Planet_data[nazwa].name)
          console.log(`${Planet_data[64].biome}`);
          img.src=`${planetIcons["fractured_planet"]}`;
          img.className="fractured_planet"
        img.style.width = BASE_SIZE + "px";
        img.style.height = BASE_SIZE + "px"; 
        }
      else if(planet.index === 64){
        //meridia
          BASE_SIZE = 20;
          console.log(Planet_data[nazwa].name)
          console.log(`${Planet_data[64].biome}`);
          img.src=`${planetIcons[Planet_data[64].biome]}`;
          img.className="black_hole_penta"
        img.style.width = BASE_SIZE + "px";
        img.style.height = BASE_SIZE + "px"; 
        }
      else if(Planet_data[nazwa].name==""){
          BASE_SIZE = 0;
          img.src=""
          img.className="empty"
          img.style.width = '0px';
          img.style.height = '0px'; 
        }
        else{
        BASE_SIZE = 15;
        img.src = `${planetIcons[Planet_data[nazwa].biome]}`;
        img.className = 'planet';
        img.style.width = BASE_SIZE + "px";
        img.style.height = BASE_SIZE + "px"; 
        img.style.transformOrigin = 'bottom center';
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
            break;
          case 3:
            name.style.color='#b60000'
            break;
          case 4:
            name.style.color='#ab00fd'
            break;
          default:
            console.log(Wardata.planetStatus[planet.index].owner)
            break;
        }


      //zoom logic
      const updateScale = () => {
        scale = Math.pow(2, (zoom - 8) / 2);
        zoom = mapRef.current!.getZoom();
        img.style.transform = `${img.style.transform.replace(/\s*scale\([^)]*\)/, '')} scale(${scale})`;
        name.style.fontSize= `${0.58 * Math.sqrt(scale)}rem`;
        
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
      
      if(planet.index !=64) {
      const marker = new maplibregl.Marker({ element: container })
        .setLngLat([planet.position.x + 1, planet.position.y + 1])
        .addTo(mapRef.current!);
      }
      else{
        //pozycja meridii w grze jest inna niż w api, więc trzeba to poprawić ręcznie
        const marker = new maplibregl.Marker({ element: container })
        .setLngLat([0.269 + 1, 0.116 + 1])
        .addTo(mapRef.current!);
        
      }
      */
      //updateScale(); // set correct size on init
      //generate hyperlanes
      
    });
    
    const check_Name_Visibility = (CurZoom:number, name:HTMLSpanElement) => {
      if(CurZoom <= 9.0){
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
