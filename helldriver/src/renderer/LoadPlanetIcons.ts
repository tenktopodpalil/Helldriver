import { planetIcons } from './PlanetIconImport';
export const loadPlanetIcons = (map: maplibregl.Map): Promise<void> => {
  const promises = Object.entries(planetIcons).map(async ([key, src]) => {
    const image = await map.loadImage(src);
    if (!map.hasImage(key)) {
      map.addImage(key, image.data);
    }
  });

  return Promise.all(promises).then(() => {});
};