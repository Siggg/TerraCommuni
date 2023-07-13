import { IPFS_prefix, prefixIPFS } from "/js/IPFS_finder.js";

let urlParams = new URLSearchParams(window.location.search);
const ceremony_CID = urlParams.get('ceremony_CID');

let load_ceremony = async function (ceremony_CID) {
  console.log("Loading ceremony: " + ceremony_CID);
  let IPFS_prefix = await prefixIPFS();
  let ceremony_JSON_URL = IPFS_prefix + ceremony_CID + "/ceremony.json";
  console.log("from JSON at: " + ceremony_JSON_URL);
  fetch(ceremony_JSON_URL)
    .then(response => response.json())
    .then(function(data) {
      document.getElementById('organizer_identifier').innerText = data["organizer_identifier"];
      document.getElementById('datetime').innerText = data["datetime"];
      document.getElementById('latitude').innerText = data["latitude"];
      document.getElementById('longitude').innerText = data["longitude"];
      document.getElementById('block_height').innerText = data["block_height"];
      document.getElementById('block_hash').innerText = data["block_hash"];
      document.getElementById('IPFS_link')["href"] = IPFS_prefix + ceremony_CID;
	    let seed_picture = document.getElementById('ceremony_picture');
	    for (let picture of data["pictures"]) {
        let new_picture = seed_picture.cloneNode()
		    new_picture['id'] = "";
        new_picture['src'] = IPFS_prefix + ceremony_CID + "/" + picture;
		    seed_picture.parentNode.appendChild(new_picture);
	    }
	    seed_picture.remove();
	    let seed_video = document.getElementById('ceremony_video');
      let video = "";
	    for (video of data["videos"]) {
        let new_video = seed_video.cloneNode(true)
		    new_video['id'] = "";
        new_video['src'] = IPFS_prefix + ceremony_CID + "/" + video;
        /* new_video.firstElementChild.addEventListener("onerror", function(event) {
          console.log("Error in a video source ! ");
          // Chrome v60
          let error="";
          if (event.path && event.path[0]) {
            error = event.path[0].error;
          }
          // Firefox v55
          if (event.originalTarget) {
            error = error.originalTarget.error;
          }
          console.log("<source> error");
          console.log(error);
          // e does not contain anything useful -- https://html.spec.whatwg.org/multipage/media.html#event-source-error
          // e.target would be the <source> element
          // e.target.parentNode would be the <video> element
          // e.target.parentNode.error -- https://html.spec.whatwg.org/multipage/media.html#mediaerror
          // e.target.parentNode.networkState -- https://html.spec.whatwg.org/multipage/media.html#dom-media-networkstate
          console.log(event.target.parentNode.error);
          console.log(event.target.parentNode.networkState);
        }); */
		    seed_video.parentNode.appendChild(new_video);
        new_video.firstElementChild['src'] = IPFS_prefix + ceremony_CID + "/" + video;
	    }
	    seed_video.remove();
	    makeLightboxable();
	    console.log("Videos and pictures URLs loaded.");
    })
    .catch((error) => {
      console.error('Erreur en récupérant le JSON : ', error);
    });
  let videos = document.querySelectorAll('.visible-media video');
  for (let video of videos) {
    let videoUrl = video.src;
	  video.addEventListener('error', function(event) {
      let errorMessage = document.createElement('div');
      errorMessage.innerHTML = `
            <p>Une erreur est survenue lors de la lecture de cette vidéo. Il est possible que le format de la vidéo ne soit pas supporté par votre navigateur.</p>
            <p><a href="${videoUrl}" download>Cliquez ici pour télécharger la vidéo.</a></p>
        `;
      video.replaceWith(errorMessage);
    }, true);
  }
}

let adaptIPFSLinks = async function () {
  console.log("Adapting IPFS links");
  let IPFS_prefix = await prefixIPFS();
  let elements = document.querySelectorAll('[src^="ipfs://"]');
  for(let i = 0; i < elements.length; i++) {
    // Remplace "ipfs://" par "https://" dans l'attribut src de l'élément
    elements[i].src = elements[i].src.replace("ipfs://", IPFS_prefix);
  }
}
	
if (ceremony_CID) {
  // We are displaying just one ceremony
  load_ceremony(ceremony_CID);
  // we are already displaying the details of the ceremony
  for(let element of document.querySelectorAll('div.link-to-details')) {
    element.remove();
  }
} else {
  // A whole list of ceremonies has been displayed, let's adjust the IPFS links
  adaptIPFSLinks();
}

document.addEventListener('DOMContentLoaded', (event) => {
/*  let videos = document.querySelectorAll('.visible-media video');
  for (let video of videos) {
    let videoUrl = video.src;
	  video.addEventListener('error', function(event) {
      let errorMessage = document.createElement('div');
      errorMessage.innerHTML = `
            <p>Une erreur est survenue lors de la lecture de cette vidéo. Il est possible que le format de la vidéo ne soit pas supporté par votre navigateur.</p>
            <p><a href="${videoUrl}" download>Cliquez ici pour télécharger la vidéo.</a></p>
        `;
      video.replaceWith(errorMessage);
    }, true);
  } */
});