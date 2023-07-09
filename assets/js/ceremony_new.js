import { Web3Storage } from 'https://cdn.jsdelivr.net/npm/web3.storage/dist/bundle.esm.min.js'

// select input elements
const form = document.querySelector('#ceremony-form')
const datetimeInput = document.querySelector('#datetime')
const organizerInput = document.querySelector('#organizer_identifier')
const latitudeInput = document.querySelector('#latitude')
const longitudeInput = document.querySelector('#longitude')
const block_heightInput = document.querySelector('#block_height')
const block_hashInput = document.querySelector('#block_hash')
const picturesInput = document.querySelector('#pictures')
const videosInput = document.querySelector('#videos')
const tokenInput = document.querySelector('#token')
const addRowButton = document.querySelector('#add-row')
const output = document.querySelector('#output')

// load default values
let now = new Date();
let dateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
datetimeInput.value = dateTime;
    
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    latitudeInput.value = position.coords.latitude;
    longitudeInput.value = position.coords.longitude;
  });
} else {
  alert("Geolocation is not supported by this browser.");
}

fetch('https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey={{ $.Site.Params.etherscan_API_key }}')
  .then(response => response.json())
  .then(data => {
    let blockNumber = parseInt(data.result, 16);
    block_heightInput.value = blockNumber;
    return fetch(`https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${data.result}&boolean=true&apikey={{ $.Site.Params.etherscan_API_key }}`);
  })
  .then(response => response.json())
  .then(
    data => block_hashInput.value = data.result.hash.substring(0, 8)
  );


showMessage('> ⁂ waiting for form submission...')

// add new ceremony

form.addEventListener('submit', async function (event) {
  // don't reload the page!
  event.preventDefault()

  const ceremonyName = datetimeInput.value + "@" + latitudeInput.value + "@" + longitudeInput.value
  const ceremony = {
    datetime: datetimeInput.value,
    organizer_identifier: organizerInput.value,
    latitude: latitudeInput.value,
    longitude: longitudeInput.value,
    block_height: block_heightInput.value,
    block_hash: block_hashInput.value,
    pictures: [],
    videos: []
  }
		
  // create a DataTransfer object in order to add JSON file
  const dataTransfer = new DataTransfer();
  for(const pictureFile of picturesInput.files) {
    dataTransfer.items.add(pictureFile)
    ceremony["pictures"].push(pictureFile.name)
  }
  for(const videoFile of videosInput.files) {
    dataTransfer.items.add(videoFile)
    ceremony["videos"].push(videoFile.name)
  }
  const ceremony_JSON = JSON.stringify(ceremony);
  dataTransfer.items.add(new File([ceremony_JSON], 'ceremony.json'));
		

  showMessage('> 📦 creating web3.storage client')
  const token = tokenInput.value
  const client = new Web3Storage({ token })

  showMessage('> 🤖 chunking and hashing the files to calculate the Content ID')
  const files = dataTransfer.files
		
  // when each chunk is stored, update the percentage complete and display
  const totalSize = Array.from(files).map(f => f.size).reduce((a, b) => a + b, 0)
  let uploaded = 0
  const onStoredChunk = size => {
    uploaded += size
    const pct = 100 * (uploaded / totalSize)
    showMessage(`> 🛰 uploaded ${size.toLocaleString()} more bytes to web3.storage, ${pct.toFixed(0)}% complete, PLEASE WAIT`)
  }
  const cid = await client.put(files, {
    name: ceremonyName,
    onRootCidReady: (localCid) => {
      showMessage(`> 🔑 locally calculated Content ID: ${localCid} `)
      showMessage('> 📡 sending files to web3.storage, PLEASE WAIT ')
    },
    onStoredChunk: onStoredChunk
  })
  showLink(`https://ipfs.io/ipfs/${cid}`)
  showMessage(`> ✅ New ceremony added here:`)
  showLink(`/page/ceremony?ceremony_CID=${cid}`)
  showMessage(`> ✅ FINISHED.`)
  form.reset();
  },
  false
)

function showMessage (text) {
  const node = document.createElement('div')
  node.innerText = text
  output.appendChild(node)
}

function showLink (url) {
  const node = document.createElement('a')
  node.href = url
  node.innerText = `> 🔗 ${url}`
  output.appendChild(node)
}