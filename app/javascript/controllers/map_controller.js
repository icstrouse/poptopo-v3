import { Controller } from '@hotwired/stimulus';
import mapboxgl from 'mapbox-gl';


// TODO: make Map model in Rails? How much of this stuff can you move there?

export default class extends Controller {
  connect() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaXN0cm91c2UiLCJhIjoiY20zMXd5OGJ2MTI5YTJqcHpjeWZqazNxOCJ9.eIFUQ6YXkHt6kmKb_gLaQw';
    const mapElement = document.getElementById('map');

    const tags = JSON.parse(mapElement.dataset.tags);
    const tracks = JSON.parse(mapElement.dataset.tracks);
    console.log('tags: ', tags);
    console.log('tracks: ', tracks);

    
    //////////////////////////////////// MAP ///////////////////////////////////
    const mapOptions = {
      center: [0, 0],
      zoom: 13,
      pitch: 72,
      bearing: 270,
      container: 'map',
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
    };

    if (tags.length === 1) {
      mapOptions.center = [parseFloat(tags[0].lng), parseFloat(tags[0].lat)];
    } else if (tags.length > 1) {
      const lat = tags.reduce((acc, cur) => parseFloat(cur.lat) + acc, 0.0) / tags.length;
      const lng = tags.reduce((acc, cur) => parseFloat(cur.lng) + acc, 0.0) / tags.length;

      mapOptions.center = [lng, lat];
    }

    const map = new mapboxgl.Map(mapOptions);


    ////////////////////////////////// TERRAIN /////////////////////////////////
    map.on('style.load', () => {
      map.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
      });
      // add the DEM source as a terrain layer with exaggerated height
      map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
    });


    /////////////////////////////////// TAGS & TRACKS ///////////////////////////////////
    map.on('load', () => {
      if (tags) {
        tags.map(tag => {
          const marker = new mapboxgl.Marker({
            color: "#FD4F00",
            draggable: true
          }).setLngLat([parseFloat(tag.lng), parseFloat(tag.lat)])
            .setPopup(new mapboxgl.Popup().setHTML(`
              <p>${tag.name}</p>
              <p><a href="/map/tags/${tag.id}">See on Map</a></p>
              <p><a href="/tags/${tag.id}">Edit Tag Info</a></p>
              <p><a href="/tags/${tag.id}/tracks/new">Add Track</a></p>
            `))
            .addTo(map);
            
          // Move existing tag to edit location
          marker.on('dragend', () => {
            const lngLat = marker.getLngLat();
            const title = 'Move tag location?';
            const link = `/tags/${tag.id}/edit?lat=${lngLat.lat}&lng=${lngLat.lng}`;
            createPopup(lngLat, title, link).addTo(map);
  
            // TODO: return tag to original location if canceled
          });
        });
      }

      if (tracks) {
        tracks.forEach((track) => {
          map.addSource(`route-${track.id}`, {
            type: 'geojson',
            data: JSON.parse(track.data),
          });
      
          map.addLayer({
            id: `route-${track.id}`,
            type: 'line',
            source: `route-${track.id}`,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#FD4F00',
              'line-width': 5
            }
          });
        });
      }
    });
  }
}
