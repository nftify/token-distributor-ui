import ENV from "src/app/configs/env";

export async function fetchContracts() {
  let contracts = [];

  try {
    const response = await fetch(`${ENV.URLS.API_SERVER}/contracts`);
    contracts = await response.json();
  } catch (e) {
    console.log(e);
  }

  return contracts;
}

export async function fetchMerkleProof(contractName: string, account: string) {
  const response = await fetch(`${ENV.URLS.API_SERVER}/get-proof/${contractName}/${account}`);
  return await response.json();
}