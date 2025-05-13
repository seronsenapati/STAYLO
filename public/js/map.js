mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker({ color: "#fe424d" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h5>${listing.title}</h5><p>Exact Location will be Provied After Booking</p>`
    )
  )
  .addTo(map);
// mapboxgl.accessToken = mapToken;

// const map = new mapboxgl.Map({
//   container: "map",
//   style: "mapbox://styles/mapbox/streets-v11",
//   center: coordinates,
//   zoom: 10,
// });

// // Create a custom HTML element for the marker
// const el = document.createElement("div");
// el.className = "custom-marker";
// el.style.backgroundImage = "url('/images/map-icon.png')"; // <-- use your icon path
// el.style.width = "30px";
// el.style.height = "30px";
// el.style.backgroundSize = "100%";

// // Add marker to map
// new mapboxgl.Marker(el).setLngLat(coordinates).addTo(map);
