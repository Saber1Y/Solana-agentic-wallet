import { readSavedWalletDataFromFile } from "../wallet/wallet";
import { connection } from "../wallet/connections";

declare const console: any;

const agentA = readSavedWalletDataFromFile("agent-a.json");

console.log("Requesting airdrop of 1 SOL to Agent A...");

const signature = await connection.requestAirdrop(agentA.publicKey, 1e9);
await connection.confirmTransaction(signature);

console.log("Airdrop confirmed!");
console.log("Signature:", signature);
