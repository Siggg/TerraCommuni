import { Web3Storage } from 'https://cdn.jsdelivr.net/npm/web3.storage/dist/bundle.esm.min.js'

function makeStorageClient () {
  return new Web3Storage({ token: "{{ web3_storage_JWT }}" })
}

async function listUploads () {
  const client = makeStorageClient()
  for await (const upload of client.list()) {
    // console.log(`${upload.name} - cid: ${upload.cid} - size: ${upload.dagSize}`);
    // console.log(`https://ipns.co/${upload.cid}/ceremony.json`)
  }
}

listUploads()