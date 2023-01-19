//   console.log("hi",camp.geometry.coordinates)

  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/outdoors-v10', // style URL
  center: camp.geometry.coordinates,// starting position [lng, lat]
  zoom: 6, // starting zoom
  });
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')




  new mapboxgl.Marker()
  .setLngLat(camp.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h3>${camp.title}</h3><p>${camp.location}</p>`
    )
  )
  .addTo(map)
