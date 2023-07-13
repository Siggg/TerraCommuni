var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
  {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});


var mutantLayer = L.gridLayer
 .googleMutant({
    type: "satellite", // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
  });
  
const map = L.map('map'); //, layers[osmLayer, googleLayer]);

osmLayer.addTo(map);
mutantLayer.addTo(map);

var baseMaps = { "OSM": osmLayer, "Mutant": mutantLayer };

var layerControl = L.control.layers(baseMaps).addTo(map);

let bounds = [];
for (let i = 0; i < markers.length; i++ ) {
	const ceremony_id = markers[i].datetime + "@" + markers[i].latitude + "," + markers[i].longitude;
	const ceremony_name = markers[i].datetime + " by " + markers[i].organizer_identifier;
  const marker = L.marker([markers[i].latitude, markers[i].longitude], { "title": ceremony_name }).addTo(map);
	const popup_link = document.createElement('a');
	popup_link.setAttribute('href', '#' + ceremony_id);
	popup_link.setAttribute('id', 'popup_' + ceremony_id.replace(':','%3a'));
	popup_link.appendChild(document.createTextNode(ceremony_name));
	marker.bindPopup(popup_link);
  bounds.push([markers[i].latitude, markers[i].longitude]);
}

map.fitBounds(bounds);