var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
  {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});

var googleLayer = L.gridLayer
  .googleMutant({
    type: "hybrid", // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
  });

const map = L.map('map', layers[osmLayer, googleLayer]);

osmLayer.addTo(map);
googleLayer.addTo(map);

var baseMaps = { "OSM": osmLayer, "Google": googleLayer };

var layerControl = L.control.layers(baseMaps).addTo(map);

let bounds = [];
for (let i = 0; i < markers.length; i++ ) {
    const marker = L.marker([markers[i].latitude, markers[i].longitude]).addTo(map);
    marker.bindPopup(markers[i].date);
    bounds.push([markers[i].latitude, markers[i].longitude]);
}

map.fitBounds(bounds);