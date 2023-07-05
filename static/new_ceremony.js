      import { Web3Storage } from 'https://cdn.jsdelivr.net/npm/web3.storage/dist/bundle.esm.min.js'

      const form = document.querySelector('#ceremony-form')
      const datetimeInput = document.querySelector('#datetime')
      const organizerInput = document.querySelector('#organizer_identifer')
      const latitudeInput = document.querySelector('#latitude')
      const longitudeInput = document.querySelector('#longitude')
      const block_heightInput = document.querySelector('#block_height')
      const block_hashInput = document.querySelector('#block_hash')
      const picturesInput = document.querySelector('#pictures')
      const videosInput = document.querySelector('#videos')
	  const identifiers = document.querySelector('#identifiers')
      const tokenInput = document.querySelector('#token')
      
	  const addRowButton = document.querySelector('#add-row')
      const output = document.querySelector('#output')

      showMessage('> ⁂ waiting for form submission...')

	  // Identifiers can be added to or removed from the form
      addRowButton.addEventListener('click', async function (event) {
        const identifiers = document.querySelector('#identifiers')
        const clonedRow = identifiers.lastElementChild.cloneNode(true);
        const delRowButton = clonedRow.lastElementChild.lastElementChild
        delRowButton.hidden=false;
        identifiers.insertBefore(clonedRow, null);
        delRowButton.addEventListener('click', async function (event) {
          event.currentTarget.parentElement.parentElement.remove()
        })
      })
	  
      form.addEventListener('submit', async function (event) {
        // don't reload the page!
        event.preventDefault()

        const ceremonyName = datetimeInput.value + "@" + latitudeInput.value + "@" + longitudeInput.value
        const ceremony = {
          datetime: datetimeInput.value,
		  organizer_identifer: organizerInput.value,
          latitude: latitudeInput.value,
          longitude: longitudeInput.value,
          block_height: block_heightInput.value,
          block_hash: block_hashInput.value,
          identifiers: {},
          pictures: [],
          videos: []
        }
        for (const identifierRow of identifiers.children) {
          const identifier = identifierRow.querySelector('input[name="identifier"]').value;
          const persons = identifierRow.querySelector('input[name="persons"]').value;
          ceremony["identifiers"][identifier] = persons;
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

        showMessage('> 🤖 chunking and hashing the files (in your browser!) to calculate the Content ID')
        const files = dataTransfer.files
		
        // when each chunk is stored, update the percentage complete and display
        const totalSize = Array.from(files).map(f => f.size).reduce((a, b) => a + b, 0)
        let uploaded = 0
        const onStoredChunk = size => {
          uploaded += size
          const pct = 100 * (uploaded / totalSize)
          showMessage(`> 🛰 uploaded ${size.toLocaleString()} more bytes to web3.storage, ${pct.toFixed(2)}% complete`)
        }
        const cid = await client.put(files, {
          name: ceremonyName,
          onRootCidReady: (localCid) => {
            showMessage(`> 🔑 locally calculated Content ID: ${localCid} `)
            showMessage('> 📡 sending files to web3.storage, please wait ')
          },
          onStoredChunk: onStoredChunk
        })
        showMessage(`> ✅ web3.storage now hosting ${cid}`)
        showLink(`https://dweb.link/ipfs/${cid}`)
      }, false)

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