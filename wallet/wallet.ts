import * as fs from "fs";
import { Keypair, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { sendAndConfirmTransaction } from "@solana/web3.js";
import { connection } from "./connections";
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";

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

function createOrLoadWallet(agentName: string, filename: string): Keypair {
  if (fs.existsSync(filename)) {
    console.log(`Loading existing ${agentName} wallet from ${filename}`);
    return readSavedWalletDataFromFile(filename);
  }

  const keypair = Keypair.generate();
  console.log(`${agentName} wallet created: ${keypair.publicKey.toBase58()}`);
  saveWalletToFile(keypair, filename);
  return keypair;
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

async function getTokenBalance(wallet: PublicKey, tokenMint: PublicKey): Promise<number> {
  const tokenAccount = await getAssociatedTokenAddress(wallet, tokenMint);
  
  try {
    const accountInfo = await connection.getParsedAccountInfo(tokenAccount);
    if (accountInfo.value === null) {
      return 0;
    }
    const data = accountInfo.value.data as any;
    return data.parsed.info.tokenAmount.uiAmount || 0;
  } catch (error) {
    return 0;
  }
}

async function sendSPLToken(
  from: Keypair,
  to: PublicKey,
  tokenMint: PublicKey,
  amount: number
): Promise<string> {
  const fromTokenAccount = await getAssociatedTokenAddress(from.publicKey, tokenMint);
  const toTokenAccount = await getAssociatedTokenAddress(to, tokenMint);

  const transaction = new Transaction().add(
    createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      from.publicKey,
      amount * Math.pow(10, 9) // Assuming 9 decimals
    )
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [from]);
  return signature;
}

export {
  createWalletWithKeypair,
  saveWalletToFile,
  readSavedWalletDataFromFile,
  createOrLoadWallet,
  sendSOL,
  getTokenBalance,
  sendSPLToken,
};
