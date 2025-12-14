// Map functionality for Staylo

// Check if mapboxgl is available
if (typeof mapboxgl !== 'undefined') {
  // Set access token if available
  if (typeof mapToken !== 'undefined' && mapToken) {
    mapboxgl.accessToken = mapToken;
  }

  // Initialize map only if listing data is available
  if (typeof listing !== 'undefined' && listing && listing.geometry) {
    // Create map
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: listing.geometry.coordinates,
      zoom: 9
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl());

    // Create marker
    const marker = new mapboxgl.Marker()
      .setLngLat(listing.geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(
            `<h6>${listing.title}</h6><p>${listing.location}, ${listing.country}</p>`
          )
      )
      .addTo(map);

    // Fly to location with smooth animation
    map.flyTo({
      center: listing.geometry.coordinates,
      zoom: 12,
      speed: 0.8,
      curve: 1,
      easing(t) {
        return t;
      }
    });
  } else {
    // Handle case where map token or listing data is not available
    console.warn('Mapbox token or listing data not available');
    
    // Hide map container if no data
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      mapContainer.style.display = 'none';
      
      // Show a message instead
      const message = document.createElement('div');
      message.className = 'alert alert-info';
      message.textContent = 'Map data is not available for this listing.';
      mapContainer.parentNode.insertBefore(message, mapContainer);
    }
  }
} else {
  // Handle case where mapboxgl is not loaded
  console.warn('Mapbox GL JS library not loaded');
  
  // Hide map container
  const mapContainer = document.getElementById('map');
  if (mapContainer) {
    mapContainer.style.display = 'none';
    
    // Show a message instead
    const message = document.createElement('div');
    message.className = 'alert alert-warning';
    message.textContent = 'Interactive map is not available. Please check your connection.';
    mapContainer.parentNode.insertBefore(message, mapContainer);
  }
}

// Handle window resize for responsive map
window.addEventListener('resize', function() {
  if (typeof map !== 'undefined') {
    map.resize();
  }
});