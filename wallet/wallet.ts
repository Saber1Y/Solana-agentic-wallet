import * as fs from "fs";
import { Keypair, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { sendAndConfirmTransaction } from "@solana/web3.js";
import { connection } from "./connections";

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

async function sendSOL(from: Keypair, to: PublicKey, amount: number): Promise<string> {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports: amount * 1e9,
    })
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [from]);
  return signature;
}

export {
  createWalletWithKeypair,
  saveWalletToFile,
  readSavedWalletDataFromFile,
  sendSOL,
};
