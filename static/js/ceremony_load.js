var urlParams = new URLSearchParams(window.location.search);
var ceremony_CID = urlParams.get('ceremony_CID');
if (ceremony_CID) {
  var IPFS_gateway = "https://ipfs.io/ipfs/";
  var ceremony_JSON_URL = IPFS_gateway + ceremony_CID + "/ceremony.json";
  fetch(ceremony_JSON_URL)
    .then(response => response.json())
    .then(function(data) {
      document.getElementById('organizer_identifier').innerText = data["organizer_identifier"];
      document.getElementById('datetime').innerText = data["datetime"];
      document.getElementById('latitude').innerText = data["latitude"];
      document.getElementById('longitude').innerText = data["longitude"];
      document.getElementById('block_height').innerText = data["block_height"];
      document.getElementById('block_hash').innerText = data["block_hash"];
      document.getElementById('IPFS_link')["href"] = IPFS_gateway + ceremony_CID;
	  var seed_picture = document.getElementById('ceremony_picture');
	  for (picture of data["pictures"]) {
        var new_picture = seed_picture.cloneNode()
		new_picture['id'] = "";
        new_picture['src'] = IPFS_gateway + ceremony_CID + "/" + picture;
		seed_picture.parentNode.appendChild(new_picture);
	  }
	  seed_picture.remove();
	  var seed_video = document.getElementById('ceremony_video');
	  for (video of data["videos"]) {
        var new_video = seed_video.cloneNode()
		new_video['id'] = "";
        new_video['src'] = IPFS_gateway + ceremony_CID + "/" + video;
		seed_video.parentNode.appendChild(new_video);
	  }
	  seed_video.remove();
	  makeLightboxable();
	  console.log("loaded");
    })
    .catch((error) => {
      console.error('Erreur en récupérant le JSON : ', error);
    });
}
