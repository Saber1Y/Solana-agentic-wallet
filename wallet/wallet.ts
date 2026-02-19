import { Keypair } from "@solana/web3.js";

declare const console: any;

function createWalletWithKeypair() {
  const keypair = Keypair.generate();
  
  console.log("New wallet created with public key:", keypair.publicKey.toBase58());

  return keypair;
}

export { createWalletWithKeypair };