import { Controller } from '@hotwired/stimulus';
import mapboxgl from 'mapbox-gl';

// TODO: make Map model in Rails? How much of this stuff can you move there?

export default class extends Controller {
  connect() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaXN0cm91c2UiLCJhIjoiY20zMXd5OGJ2MTI5YTJqcHpjeWZqazNxOCJ9.eIFUQ6YXkHt6kmKb_gLaQw';
    const mapElement = document.getElementById('map');
    console.log({mapElement})

    let tags, tracks;
    if (mapElement.dataset.tags) {
      tags = JSON.parse(mapElement.dataset.tags);
    } else if (mapElement.dataset.tag) {
      tags = [JSON.parse(mapElement.dataset.tag)];
      tracks = JSON.parse(mapElement.dataset.tracks)
    }
    console.log('tags: ', tags);

    
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
    console.log({map})


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


    /////////////////////////////////// TAGS ///////////////////////////////////
    tags.map(tag => {
      const marker = new mapboxgl.Marker({
        color: "#FD4F00",
        draggable: true
      }).setLngLat([parseFloat(tag.lng), parseFloat(tag.lat)])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <p>${tag.name}</p>
          <p><a href="/map/tags/${tag.id}">See on Map</a></p>
          <p><a href="/tags/${tag.id}">Edit Tag Info</a></p>
          <p><a href="/tracks/new?tag_id=${tag.id}">Add Track</a></p>
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
}
