import * as fs from "fs";
import { Keypair } from "@solana/web3.js";


declare const console: any;


function createWalletWithKeypair(agentName: string) {
  const keypair = Keypair.generate();

  console.log(`${agentName} wallet created: ${keypair.publicKey.toBase58()}`);

  return keypair;
}

function saveWalletToFile(keypair: Keypair, filename: string) {
  const walletData = {
    publicKey: keypair.publicKey.toBase58(),
    secretKey: Array.from(keypair.secretKey),
  };

  fs.writeFileSync(filename, JSON.stringify(walletData));
  console.log(`Wallet saved to ${filename}`);
}

function readSavedWalletDataFromFile(filename: string) {
  const importedPublicKey = JSON.parse(fs.readFileSync(filename).toString());
  const secretKeyArray = new Uint8Array(importedPublicKey.secretKey);
  return Keypair.fromSecretKey(secretKeyArray);
}

export {
  createWalletWithKeypair,
  saveWalletToFile,
  readSavedWalletDataFromFile,
};
