async function fetchNurkiAPI() {
  const response = await fetch('https://api.live.prod.thehelldiversgame.com/api/NewsFeed/801?fromTimestamp=60000000&maxEntries=1024');
  const data = await response.json();
  return data;
}
export default fetchNurkiAPI;