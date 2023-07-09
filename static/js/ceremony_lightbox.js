// make lightboxable media clickable
function makeLightboxable () {
  var mediaElements = Array.from(document.querySelectorAll('.lightboxable-media'));
  mediaElements.forEach((media, media_index) => {
    media.addEventListener('click', function (event) {
      // select the proper lightbox containers
      var media = event.target;
      var gallery = media.parentNode.parentNode;
      var lightbox = gallery.querySelector('.lightbox');
      lightbox.style.pointerEvents = 'auto';
      var lightboxImage = lightbox.querySelector('.lightbox-image');
      var lightboxVideo = lightbox.querySelector('.lightbox-video');
      // open the lightbox and load the media
      if (media.tagName === 'IMG') {
        lightboxImage.src = media.src;
        lightboxImage.style.display = '';
        lightboxVideo.style.display = 'none';
        lightboxVideo.src="";
      } else {  // VIDEO
        lightboxVideo.src = media.currentSrc;
        lightboxVideo.style.display = '';
        lightboxImage.style.display = 'none';
        lightboxImage.src = "";
      }
      lightbox.classList.add('open');
      document.body.classList.add('lightbox-open');
    });
  });
  console.log("Lightboxabled");
}

document.addEventListener("DOMContentLoaded", function() {

makeLightboxable();

// Add event listeners to close, next and previous buttons
document.querySelectorAll('.lightbox-close').forEach(function(element) {
  element.addEventListener('click', function (event) {
    var lightbox=event.target.parentNode;
    lightbox.classList.remove('open');
    document.body.classList.remove('lightbox-open'); 
    lightbox.style.pointerEvents = 'none';
  });
});

document.querySelectorAll('.lightbox-next').forEach(function(element) {
  element.addEventListener('click', function (event) {
    // What's the gallery media currently displayed in the lightbox?
    var lightbox = event.target.parentNode;
    var lightboxMediaSrc = lightbox.querySelector(".lightbox-image").src;
    var gallery = lightbox.parentNode;
    var currentMediaElement = gallery.querySelector('.lightboxable-media[src="'+lightboxMediaSrc+'"]');
    if (!currentMediaElement) {
      lightboxMediaSrc = lightbox.querySelector(".lightbox-video").src;
      currentMediaElement = gallery.querySelector('.lightboxable-media[src="'+lightboxMediaSrc+'"]');
    }
    // What's the next element in the gallery after the element with that src ?
    var nextMediaElement = currentMediaElement.nextElementSibling;
    if (!nextMediaElement) { nextMediaElement = currentMediaElement.parentNode.firstElementChild }
    nextMediaElement.click();
  });
});

document.querySelectorAll('.lightbox-previous').forEach(function(element) {
  element.addEventListener('click', function (event) {
    // What's the gallery media currently displayed in the lightbox?
    var lightbox = event.target.parentNode;
    var lightboxMediaSrc = lightbox.querySelector(".lightbox-image").src;
    var gallery = lightbox.parentNode;
    var currentMediaElement = gallery.querySelector('.lightboxable-media[src="'+lightboxMediaSrc+'"]');
    if (!currentMediaElement) {
      lightboxMediaSrc = lightbox.querySelector(".lightbox-video").src;
      currentMediaElement = gallery.querySelector('.lightboxable-media[src="'+lightboxMediaSrc+'"]');
    }
    // What's the previous element in the gallery after the element with that src ?
    var previousMediaElement = currentMediaElement.previousElementSibling;
    if (!previousMediaElement) { previousMediaElement = currentMediaElement.parentNode.lastElementChild }
    previousMediaElement.click();
  });
});

// manage identifiers from the lightbox

/*
// Keep a reference to the original parent of the form and its original style
var originalParent = document.getElementById('identifiers').parentNode;
var originalStyle = document.getElementById('identifiers').getAttribute('style');

// When opening the lightbox...
document.getElementById('lightbox').addEventListener('open', function() {
  // Move the form into the lightbox and change its style
  this.appendChild(document.getElementById('identifiers'));
  document.getElementById('identifiers').style.position = 'fixed';
  document.getElementById('identifiers').style.bottom = '0';
  document.getElementById('identifiers').style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  document.getElementById('identifiers').style.overflowY = 'auto';
  document.getElementById('identifiers').style.maxHeight = '150px';
});

// When closing the lightbox...
document.getElementById('lightbox').addEventListener('close', function() {
  // Move the form back to its original location and restore its style
  originalParent.appendChild(document.getElementById('identifiers'));
  document.getElementById('identifiers').setAttribute('style', originalStyle);
});
*/
});
