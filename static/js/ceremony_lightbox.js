var lightbox = document.getElementById('lightbox');
var lightboxImg = document.getElementById('lightbox-img');
var lightboxVideo = document.getElementById('lightbox-video');
// var draggableInput = document.getElementById('draggable-input');
var mediaElements = Array.from(document.querySelectorAll('.media-gallery img, .media-gallery video'));
var currentMediaIndex;

// Add event listeners to media elements
mediaElements.forEach((media, index) => {
  media.addEventListener('click', () => {
    currentMediaIndex = index;
    if (media.tagName === 'img') {
      lightboxImg.src = media.src;
      lightboxImg.style.display = '';
      lightboxVideo.style.display = 'none';
    } else {  // VIDEO
      lightboxVideo.src = media.src;
      lightboxVideo.style.display = '';
      lightboxImg.style.display = 'none';
    }
    lightbox.style.display = '';
    if (document.getElementById('identifiers')) {
      // draggableInput.style.display = '';
    }
  });
});

// Add event listeners to close, next and previous buttons
document.getElementById('close').addEventListener('click', () => {
  lightbox.style.display = 'none';
  // draggableInput.style.display = 'none';
});

document.getElementById('next').addEventListener('click', () => {
  currentMediaIndex = (currentMediaIndex + 1) % mediaElements.length;
  mediaElements[currentMediaIndex].click();
});

document.getElementById('previous').addEventListener('click', () => {
  currentMediaIndex = (currentMediaIndex - 1 + mediaElements.length) % mediaElements.length;
  mediaElements[currentMediaIndex].click();
});

// manage identifiers from the lightbox


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
