import { Keypair } from "@solana/web3.js";
import * as fs from "fs";

declare const console: any;

function createWalletWithKeypair() {
  const keypair = Keypair.generate();

  console.log(
    "New wallet created with public key:",
    keypair.publicKey.toBase58(),
  );

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

export { createWalletWithKeypair, saveWalletToFile };



