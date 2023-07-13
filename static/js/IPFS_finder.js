export const IPFS_prefix = null;

// from https://github.com/VanVan/ipfsProxyHTTP/blob/master/www/gateway.txt
const IPFS_prefixes = [
//  "ipfs://",
//  "http://localhost:8080/ipfs/",
  "https://w3s.link/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
  "https://ipfs.io/ipfs/",
  "https://gateway.ipfs.io/ipfs/",
  "uhttps://dweb.link/ipfs/",
  "https://ipfs.eth.aragon.network/ipfs/",
  "https://ipfs.eternum.io/ipfs/",
  "https://nftstorage.link/ipfs/",
  "https://ipfs.anonymize.com/ipfs/",
  "https://konubinix.eu/ipfs/",
  "https://cf-ipfs.com/ipfs/",
  "https://fleek.ipfs.io/ipfs/",
  "https://4everland.io/ipfs/"
];
const test_CID = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme"

export async function prefixIPFS()  {
  // console.log("Calling prefixIPFS");
  if (IPFS_prefix) {
    return IPFS_prefix ;
  };
  for (let prefix of IPFS_prefixes) {
    try {
      let url = `${prefix}${test_CID}`;
	    let fetch_options = {};
	    if (prefix.substring(0,7) != "ipfs://") {
        fetch_options = {
          mode: 'cors', // no-cors, *cors, same-origin
	        credentials: 'same-origin', // include, *same-origin, omit
		    };
	    };
      const response = await fetch(url, fetch_options);
      if (response.ok) {  // Si le statut de la réponse est 200-299
	      console.log(`IPFS can be reached via prefix "${prefix}"`);
        return prefix;  // Retourne la première gateway qui fonctionne, ou ipfs://
      };
    } catch (error) {
      console.warn(`IPFS prefix "${prefix}" does not work:`, error);
    }
  }
  throw new Error("None of the IPFS prefixes work !");
}