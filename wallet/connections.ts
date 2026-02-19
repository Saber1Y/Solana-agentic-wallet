//basically connects to sol devnets

import { Connection } from "@solana/web3.js";
import { readSavedWalletDataFromFile } from "./wallet";

declare const console: any;

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const savedAgentAWalletData = readSavedWalletDataFromFile("agent-a.json");
const savedAgentBWalletData = readSavedWalletDataFromFile("agent-b.json");

const balanceA = await connection.getBalance(savedAgentAWalletData.publicKey);
const balanceB = await connection.getBalance(savedAgentBWalletData.publicKey);

console.log(balanceA / 1e9, "SOL (Agent A)");
console.log(balanceB / 1e9, "SOL (Agent B)");
