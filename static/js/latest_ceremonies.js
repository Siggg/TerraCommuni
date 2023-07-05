import { Web3Storage } from 'https://cdn.jsdelivr.net/npm/web3.storage/dist/bundle.esm.min.js'

function makeStorageClient () {
  return new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGI5OTViOTI1MjI2NmY5ZjZkOUJmQzk2MjEwMkQ1ODg1MjdkOTMyOUIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODg0ODc2NzQwMTIsIm5hbWUiOiIyMDIzLTA3LTA0X3B1dC1maWxlcyJ9.QLpvshXTB7HHF6CeZPivkUToPd7H1pMRrVNIYCXW1Q0" })
}

async function listUploads () {
  const client = makeStorageClient()
  for await (const upload of client.list()) {
    // console.log(`${upload.name} - cid: ${upload.cid} - size: ${upload.dagSize}`);
    // console.log(`https://ipns.co/${upload.cid}/ceremony.json`)
  }
}

listUploads()